import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRY = '7d'; // Token expires in 7 days
const DB_TIMEOUT = 15000; // 15 seconds timeout

export const dynamic = 'force-dynamic'; // Disable caching for this route

export async function POST(request: NextRequest) {
  try {
    // Try to connect to the database with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), DB_TIMEOUT)
    );
    
    await Promise.race([connectDB(), timeoutPromise]);
    
    // Parse request body
    const { email, password } = await request.json();
    
    // Log login attempt (without sensitive data)
    console.log(`Login attempt for email: ${email.substring(0, 3)}****`);
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`Login failed: User with email ${email.substring(0, 3)}**** not found`);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log(`Login failed: Invalid password for email ${email.substring(0, 3)}****`);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );
    
    // Set cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/'
    });
    
    console.log(`User successfully logged in: ${email.substring(0, 3)}****`);
    
    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      email: user.email,
      homeCity: user.home_city,
      travelPreferences: user.travel_preferences,
      interrailPassType: user.interrail_pass_type,
      language: user.language,
      notificationsEnabled: user.notifications_enabled
    };
    
    return NextResponse.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    
    // Check for specific errors
    if (error instanceof mongoose.Error) {
      console.error('Mongoose error:', error.message);
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message === 'Database connection timeout') {
        console.error('Database connection timeout error');
        return NextResponse.json(
          { error: 'Database connection timeout', message: 'Please try again later' },
          { status: 504 }
        );
      }
      
      console.error('Error message:', error.message);
      return NextResponse.json(
        { error: 'Login failed', message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Login failed', message: 'Unknown error' },
      { status: 500 }
    );
  }
} 