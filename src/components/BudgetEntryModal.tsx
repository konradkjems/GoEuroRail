import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import BudgetEntrySystem from './BudgetEntrySystem';
import { FormTrip } from '@/types';

interface BudgetEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: FormTrip;
  initialBudget?: number;
  budgetData?: any;
  expenses?: any[];
  handleExpensesUpdate?: (updatedExpenses: any[]) => void;
  budgetLevel?: 'budget' | 'moderate' | 'luxury';
}

export default function BudgetEntryModal({ 
  isOpen, 
  onClose, 
  trip, 
  initialBudget, 
  budgetData,
  expenses,
  handleExpensesUpdate,
  budgetLevel
}: BudgetEntryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-[90%] sm:w-[90%] max-h-[90vh] overflow-y-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Trip Expense Tracker
              </h3>
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-4">
              <BudgetEntrySystem 
                trip={trip} 
                initialBudget={initialBudget} 
                budgetData={budgetData} 
                initialExpenses={expenses}
                onExpensesUpdate={handleExpensesUpdate}
                budgetLevel={budgetLevel}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 