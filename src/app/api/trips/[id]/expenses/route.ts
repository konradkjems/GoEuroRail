import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Expense } from '@/models';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

// Default mock user ID for development when auth is not properly set up
const MOCK_USER_ID = '507f1f77bcf86cd799439011'; // Valid ObjectId format

/**
 * GET /api/trips/[id]/expenses
 * Retrieve expenses for a specific trip
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    
    // Connect to database
    await connectDB();
    
    const tripId = params.id;
    
    // Use user ID from auth or fallback to mock ID for development
    let userId;
    if (user && user.userId) {
      userId = user.userId;
      console.log(`Authenticated user: ${userId}`);
    } else {
      userId = MOCK_USER_ID;
      console.log(`Using mock user ID: ${userId}`);
    }
    
    console.log(`Retrieving expenses for trip: ${tripId}, user: ${userId}`);
    
    // Get expenses for this trip
    const expenses = await Expense.find({ 
      trip_id: tripId,
      user_id: userId
    }).sort({ date: -1 });
    
    console.log(`Found ${expenses.length} expenses`);
    
    return NextResponse.json({ expenses });
  } catch (error: any) {
    console.error('Error retrieving expenses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve expenses' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/trips/[id]/expenses
 * Save expenses for a specific trip
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const user = await verifyAuth();
    
    // Connect to database
    await connectDB();
    
    const tripId = params.id;
    
    // Use user ID from auth or fallback to mock ID for development
    let userId;
    if (user && user.userId) {
      userId = user.userId;
      console.log(`Authenticated user: ${userId}`);
    } else {
      userId = MOCK_USER_ID;
      console.log(`Using mock user ID: ${userId}`);
    }
    
    const data = await request.json();
    
    console.log(`Processing expenses for trip: ${tripId}, user: ${userId}`);
    
    // Handle batch update (multiple expenses)
    if (Array.isArray(data.expenses)) {
      // First delete all existing expenses for this trip
      const deleteResult = await Expense.deleteMany({ trip_id: tripId, user_id: userId });
      console.log(`Deleted ${deleteResult.deletedCount} existing expenses`);
      
      // Then create all the new expenses
      const expensesToInsert = data.expenses.map((expense: any) => {
        // Create a new expense object without the _id field
        const { _id, id, ...expenseData } = expense;
        
        return {
          ...expenseData,
          trip_id: tripId,  // This is a string now, not an ObjectId
          user_id: userId,  // This should be an ObjectId
          date: new Date(expense.date)
        };
      });
      
      console.log(`Preparing to insert ${expensesToInsert.length} expenses`);
      
      // Insert all expenses if there are any
      let result;
      if (expensesToInsert.length > 0) {
        try {
          console.log('Sample expense to insert:', JSON.stringify(expensesToInsert[0], null, 2));
          result = await Expense.insertMany(expensesToInsert);
          console.log(`Successfully inserted ${result.length} expenses`);
        } catch (error) {
          console.error('Error during expense insertion:', error);
          throw error; // Re-throw to be caught by the outer try/catch
        }
      } else {
        result = { length: 0 };
        console.log('No expenses to insert');
      }
      
      // Also update the budget level if provided
      if (data.budgetLevel) {
        // In a real application, you would update the Trip model with the budget level
        // await Trip.findByIdAndUpdate(tripId, { budget_level: data.budgetLevel });
        console.log(`Updated budget level to ${data.budgetLevel} for trip ${tripId}`);
      }
      
      return NextResponse.json({ 
        success: true, 
        count: result.length 
      });
    } 
    
    // Handle single expense
    else {
      console.log('Adding a single expense');
      
      // Create a new expense object without the _id field
      const { _id, id, ...expenseData } = data;
      
      const expense = new Expense({
        ...expenseData,
        trip_id: tripId,  // This is a string now, not an ObjectId
        user_id: userId,  // This should be an ObjectId
        date: new Date(data.date)
      });
      
      const savedExpense = await expense.save();
      console.log('Expense saved successfully');
      return NextResponse.json({ success: true, expense: savedExpense });
    }
  } catch (error: any) {
    console.error('Error saving expenses:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to save expenses',
        details: error.stack,
        name: error.name,
        code: error.code
      },
      { status: 500 }
    );
  }
} 