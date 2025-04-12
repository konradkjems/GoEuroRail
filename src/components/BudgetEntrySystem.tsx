import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  BanknotesIcon, 
  TrashIcon, 
  PencilIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';
import { FormTrip } from '@/types';

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  currency: string;
}

enum ExpenseCategory {
  ACCOMMODATION = 'accommodation',
  FOOD = 'food',
  TRANSPORT = 'transport',
  ACTIVITIES = 'activities',
  SHOPPING = 'shopping',
  OTHER = 'other'
}

interface BudgetEntrySystemProps {
  trip: FormTrip;
  initialBudget?: number;
  budgetData?: any;
  initialExpenses?: Expense[];
  onExpensesUpdate?: (expenses: Expense[]) => void;
  budgetLevel?: 'budget' | 'moderate' | 'luxury';
}

export default function BudgetEntrySystem({ 
  trip, 
  initialBudget, 
  budgetData,
  initialExpenses,
  onExpensesUpdate,
  budgetLevel
}: BudgetEntrySystemProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses || []);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: ExpenseCategory.FOOD,
    description: '',
    currency: 'EUR'
  });
  const [totalBudget, setTotalBudget] = useState<number>(initialBudget || 0);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [showBudgetAlert, setShowBudgetAlert] = useState<boolean>(false);
  const [expensesByCategoryData, setExpensesByCategoryData] = useState<any>({});
  const [expensesByDayData, setExpensesByDayData] = useState<any>({});
  const [notifications, setNotifications] = useState<{ id: string, message: string, type: 'info' | 'warning' | 'error' }[]>([]);
  const previousPercentSpent = useRef<number>(0);
  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Currency options
  const currencyOptions = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
    { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' }
  ];

  // Helper function to safely get trip ID
  const getTripId = (): string => {
    if (!trip) return 'default';
    // First check for _id as it's typed as string
    if (trip._id) return trip._id;
    // Then check for id which is now typed as optional string
    if (typeof trip.id === 'string') return trip.id;
    // If neither exists, use the name as a fallback
    return trip.name || 'default';
  };

  // If budgetData is provided, use it to set the initial budget
  useEffect(() => {
    if (budgetData && budgetData.totalCost) {
      setTotalBudget(budgetData.totalCost);
    }
  }, [budgetData]);

  // Load expenses from local storage on mount
  useEffect(() => {
    if (trip) {
      const tripId = getTripId();
      const savedExpenses = localStorage.getItem(`expenses_${tripId}`);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }

      const savedBudget = localStorage.getItem(`budget_${tripId}`);
      if (savedBudget) {
        setTotalBudget(parseFloat(savedBudget));
      }
    }
  }, [trip]);

  // Save expenses whenever they change
  useEffect(() => {
    if (trip) {
      const tripId = getTripId();
      
      // Update the UI state first
      // Calculate percentage spent for notifications
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const currentPercentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      
      // Check if we've crossed any thresholds
      checkBudgetThresholds(currentPercentSpent);
      
      // Set the budget alert flag (for the persistent warning)
      setShowBudgetAlert(totalSpent >= totalBudget * 0.8);
      
      // Update chart data
      updateChartData();
      
      // Call the callback to update parent component and save to database
      if (onExpensesUpdate) {
        onExpensesUpdate(expenses);
      }
    }
  }, [expenses, trip, totalBudget, onExpensesUpdate]);

  // Save the budget whenever it changes
  useEffect(() => {
    if (trip) {
      const tripId = getTripId();
      localStorage.setItem(`budget_${tripId}`, totalBudget.toString());
    }
  }, [totalBudget, trip]);

  // Update chart data
  const updateChartData = () => {
    // Initialize with all possible categories
    const byCategory: Record<string, number> = {
      [ExpenseCategory.ACCOMMODATION]: 0,
      [ExpenseCategory.FOOD]: 0,
      [ExpenseCategory.TRANSPORT]: 0,
      [ExpenseCategory.ACTIVITIES]: 0,
      [ExpenseCategory.SHOPPING]: 0,
      [ExpenseCategory.OTHER]: 0
    };
    
    // Sum expenses by category
    expenses.forEach(expense => {
      byCategory[expense.category] += expense.amount;
    });
    
    // Only keep categories with values > 0
    const filteredByCategory = Object.fromEntries(
      Object.entries(byCategory).filter(([_, value]) => value > 0)
    );
    
    setExpensesByCategoryData(filteredByCategory);

    // Expenses by day
    const byDay: Record<string, number> = {};
    expenses.forEach(expense => {
      const day = expense.date;
      if (!byDay[day]) {
        byDay[day] = 0;
      }
      byDay[day] += expense.amount;
    });
    setExpensesByDayData(byDay);
  };

  const checkBudgetThresholds = (currentPercentSpent: number) => {
    // Only check if we have a valid budget
    if (totalBudget <= 0) return;
    
    // Define threshold levels
    const thresholds = [
      { level: 50, type: 'info', message: 'You\'ve used 50% of your budget.' },
      { level: 80, type: 'warning', message: 'You\'ve used 80% of your budget. Consider reviewing your spending.' },
      { level: 100, type: 'error', message: 'You\'ve exceeded your budget! Time to review your expenses.' }
    ];
    
    // Check if we've crossed any thresholds
    for (const threshold of thresholds) {
      if (previousPercentSpent.current < threshold.level && currentPercentSpent >= threshold.level) {
        // We've crossed this threshold, create a notification
        addNotification(threshold.message, threshold.type as 'info' | 'warning' | 'error');
      }
    }
    
    // Update the ref for future checks
    previousPercentSpent.current = currentPercentSpent;
  };

  const addNotification = (message: string, type: 'info' | 'warning' | 'error') => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      type
    };
    
    setNotifications(prevNotifications => [
      ...prevNotifications,
      newNotification
    ]);
    
    // Auto-remove notification after 5 seconds
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    
    notificationTimeoutRef.current = setTimeout(() => {
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== newNotification.id)
      );
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  const handleAddExpense = () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      return;
    }

    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString()
    };

    setExpenses([...expenses, expense]);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      category: ExpenseCategory.FOOD,
      description: '',
      currency: 'EUR'
    });
  };

  const handleEditExpense = (id: string) => {
    const expenseToEdit = expenses.find(expense => expense.id === id);
    if (expenseToEdit) {
      setNewExpense({
        date: expenseToEdit.date,
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        description: expenseToEdit.description,
        currency: expenseToEdit.currency
      });
      setEditingExpenseId(id);
    }
  };

  const handleUpdateExpense = () => {
    if (!editingExpenseId) return;

    const updatedExpenses = expenses.map(expense => 
      expense.id === editingExpenseId 
        ? { ...newExpense, id: editingExpenseId }
        : expense
    );

    setExpenses(updatedExpenses);
    setEditingExpenseId(null);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      category: ExpenseCategory.FOOD,
      description: '',
      currency: 'EUR'
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const exportExpensesToCSV = () => {
    // Create CSV header row
    const headers = ['Date', 'Amount', 'Currency', 'Category', 'Description'];
    
    // Create CSV rows for each expense
    const csvData = expenses.map(expense => [
      expense.date,
      expense.amount.toString(),
      expense.currency,
      expense.category,
      `"${expense.description.replace(/"/g, '""')}"`
    ]);
    
    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create a blob and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${trip?.name || 'trip'}_expenses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate totals
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Category names for display
  const categoryDisplayNames: Record<ExpenseCategory, string> = {
    [ExpenseCategory.ACCOMMODATION]: 'Accommodation',
    [ExpenseCategory.FOOD]: 'Food & Drinks',
    [ExpenseCategory.TRANSPORT]: 'Transportation',
    [ExpenseCategory.ACTIVITIES]: 'Activities',
    [ExpenseCategory.SHOPPING]: 'Shopping',
    [ExpenseCategory.OTHER]: 'Other'
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    });
    return formatter.format(amount);
  };

  // Get category color
  const getCategoryColor = (category: ExpenseCategory) => {
    switch (category) {
      case ExpenseCategory.ACCOMMODATION:
        return 'bg-blue-100 text-blue-800';
      case ExpenseCategory.FOOD:
        return 'bg-green-100 text-green-800';
      case ExpenseCategory.TRANSPORT:
        return 'bg-purple-100 text-purple-800';
      case ExpenseCategory.ACTIVITIES:
        return 'bg-amber-100 text-amber-800';
      case ExpenseCategory.SHOPPING:
        return 'bg-pink-100 text-pink-800';
      case ExpenseCategory.OTHER:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Simple visual chart for expenses by category
  const ExpenseCategoryChart = ({ data }: { data: Record<string, number> }) => {
    const categories = Object.keys(data);
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    
    if (total === 0 || categories.length === 0) {
      return <p className="text-gray-500 text-center py-4">No expense data to display</p>;
    }

    return (
      <div className="space-y-2">
        {categories.map(category => {
          const amount = data[category];
          const percentage = (amount / total) * 100;
          
          // Make sure we have valid category names
          const displayName = categoryDisplayNames[category as ExpenseCategory] || 
                             (category.charAt(0).toUpperCase() + category.slice(1));
          
          // Get the proper color for the category
          let barColor = 'bg-gray-500';
          if (category === ExpenseCategory.ACCOMMODATION) barColor = 'bg-blue-500';
          else if (category === ExpenseCategory.FOOD) barColor = 'bg-green-500';
          else if (category === ExpenseCategory.TRANSPORT) barColor = 'bg-purple-500';
          else if (category === ExpenseCategory.ACTIVITIES) barColor = 'bg-amber-500';
          else if (category === ExpenseCategory.SHOPPING) barColor = 'bg-pink-500';
          
          return (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{displayName}</span>
                <span className="text-gray-700">{formatCurrency(amount)} ({percentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${barColor}`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Daily expense summary chart
  const DailyExpenseChart = ({ data }: { data: Record<string, number> }) => {
    const sortedDates = Object.keys(data).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const maxAmount = Math.max(...Object.values(data), 0.01); // Avoid division by zero
    
    if (sortedDates.length === 0) {
      return <p className="text-gray-500 text-center py-4">No daily expense data to display</p>;
    }

    // Show only the last 7 days of data if we have more
    const recentDates = sortedDates.length > 7 ? sortedDates.slice(-7) : sortedDates;

    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500 mb-2">
          {recentDates.length > 1 ? `Last ${recentDates.length} days of spending` : 'Daily spending'}
        </p>
        
        <div className="flex items-end space-x-1 h-32">
          {recentDates.map(date => {
            const amount = data[date];
            // Ensure barHeight is at least 1% to be visible when amount is very small
            const barHeight = maxAmount > 0 ? Math.max((amount / maxAmount) * 100, 1) : 1;
            const formattedDate = new Date(date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
            
            return (
              <div key={date} className="flex flex-col items-center flex-1">
                <div className="w-full flex justify-center">
                  <div 
                    className="w-4/5 bg-teal-500 rounded-t"
                    style={{ height: `${barHeight}%` }}
                  ></div>
                </div>
                <div className="mt-1 text-xs text-gray-500 w-full text-center truncate" title={formattedDate}>
                  {formattedDate}
                </div>
                <div className="text-xs font-medium text-gray-700 truncate w-full text-center" title={formatCurrency(amount)}>
                  {formatCurrency(amount, 'EUR')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 space-y-4">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-[10000] w-72 space-y-2">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`p-3 rounded-md shadow-md text-sm flex justify-between items-start ${
              notification.type === 'error' ? 'bg-red-50 text-red-700 border-l-4 border-red-500' :
              notification.type === 'warning' ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500' :
              'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
            }`}
          >
            <p>{notification.message}</p>
            <button
              type="button"
              className="ml-2 inline-flex text-gray-400 hover:text-gray-600"
              onClick={() => removeNotification(notification.id)}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Main content - 2 column layout for desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Budget Overview and Form */}
        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Budget Overview</h3>
              <div className="flex space-x-2">
                <button
                  onClick={exportExpensesToCSV}
                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="total-budget" className="block text-sm font-medium text-gray-700">
                Total Budget (EUR)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  id="total-budget"
                  className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                  step="10"
                  min="0"
                />
              </div>
            </div>
            
            {/* Budget Level Display */}
            {budgetLevel && (
              <div className="mb-4 bg-blue-50 p-3 rounded-md">
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Budget Level:</span> {budgetLevel.charAt(0).toUpperCase() + budgetLevel.slice(1)}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  Budget level is managed in the main trip planner.
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-500">Total Spent</div>
                <div className="text-xl font-semibold text-gray-800">{formatCurrency(totalSpent)}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-500">Remaining</div>
                <div className={`text-xl font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(remaining)}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-500">% of Budget Used</div>
                <div className="text-xl font-semibold text-gray-800">{percentSpent.toFixed(1)}%</div>
              </div>
            </div>
            
            {/* Budget progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className={`h-2.5 rounded-full ${
                  percentSpent > 100 
                    ? 'bg-red-600' 
                    : percentSpent > 80 
                      ? 'bg-amber-500' 
                      : 'bg-teal-600'
                }`} 
                style={{ width: `${Math.min(100, percentSpent)}%` }}
              ></div>
            </div>
            
            {/* Budget alert */}
            {showBudgetAlert && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      {remaining < 0 
                        ? `You've exceeded your budget by ${formatCurrency(Math.abs(remaining))}`
                        : `You've used ${percentSpent.toFixed(1)}% of your budget. Consider monitoring your spending.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Add New Expense Form */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingExpenseId ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="expense-date" className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  id="expense-date"
                  className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="expense-category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="expense-category"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                >
                  {Object.values(ExpenseCategory).map((category) => (
                    <option key={category} value={category}>
                      {categoryDisplayNames[category]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="expense-amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  id="expense-amount"
                  className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md text-black"
                  value={newExpense.amount || ''}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="expense-currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="expense-currency"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  value={newExpense.currency}
                  onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}
                >
                  {currencyOptions.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol}) - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="expense-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="expense-description"
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="e.g. Dinner at Restaurant, Train Ticket, etc."
              />
            </div>
            
            <div className="flex justify-end">
              {editingExpenseId ? (
                <div className="space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    onClick={() => {
                      setEditingExpenseId(null);
                      setNewExpense({
                        date: new Date().toISOString().split('T')[0],
                        amount: 0,
                        category: ExpenseCategory.FOOD,
                        description: '',
                        currency: 'EUR'
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    onClick={handleUpdateExpense}
                  >
                    Update
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  onClick={handleAddExpense}
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Add Expense
                </button>
              )}
            </div>
          </div>
          
          {/* Data Visualization - only shown on mobile */}
          {expenses.length > 0 && (
            <div className="lg:hidden bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Analysis</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Spending by Category</h4>
                  <ExpenseCategoryChart data={expensesByCategoryData} />
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Daily Expenses</h4>
                  <DailyExpenseChart data={expensesByDayData} />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Right column - Data Visualization and Expenses List */}
        <div className="space-y-6">
          {/* Data Visualization - desktop view */}
          {expenses.length > 0 && (
            <div className="hidden lg:block bg-white rounded-lg border p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expense Analysis</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Spending by Category</h4>
                  <ExpenseCategoryChart data={expensesByCategoryData} />
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Daily Expenses</h4>
                  <DailyExpenseChart data={expensesByDayData} />
                </div>
              </div>
            </div>
          )}
          
          {/* Expenses List */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Expenses</h3>
            
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No expenses recorded yet.</p>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Date</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Amount</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {expenses.slice().reverse().map((expense) => (
                      <tr key={expense.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {expense.date}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {expense.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                            {categoryDisplayNames[expense.category]}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-right font-medium text-black">
                          {formatCurrency(expense.amount, expense.currency)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => handleEditExpense(expense.id)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              <PencilIcon className="h-4 w-4" aria-hidden="true" />
                              <span className="sr-only">Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" aria-hidden="true" />
                              <span className="sr-only">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 