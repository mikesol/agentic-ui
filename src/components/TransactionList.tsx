import React from 'react';

/**
 * @component TransactionList
 * @description Displays a list of financial transactions with details
 * @domain finance, banking, transactions
 * @usage Display transaction history in banking and financial applications
 * 
 * @example
 * // Basic usage
 * <TransactionList
 *   transactions={transactions}
 *   formatCurrency={(amount) => `$${amount.toFixed(2)}`}
 * />
 * 
 * @example
 * // With loading and load more functionality
 * <TransactionList
 *   transactions={transactions}
 *   formatCurrency={formatCurrency}
 *   isLoading={isLoading}
 *   onLoadMore={handleLoadMore}
 *   loadMoreText="Show Previous Transactions"
 * />
 */
export interface TransactionListProps {
  /** Array of transaction objects */
  transactions: Array<{
    id: string;
    date: string | Date;
    description: string;
    amount: number;
    type: 'debit' | 'credit';
    category?: string;
    merchantLogo?: string;
    status: 'pending' | 'completed' | 'failed' | 'canceled';
    reference?: string;
  }>;
  
  /** Function to format currency values */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Whether transactions are currently loading */
  isLoading?: boolean;
  
  /** Function to load more transactions */
  onLoadMore?: () => void;
  
  /** Text for the load more button */
  loadMoreText?: string;
  
  /** Message to display when there are no transactions */
  emptyMessage?: string;
  
  /** Function to handle clicking on a transaction */
  onTransactionClick?: (transactionId: string) => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Get category icon based on transaction category
 */
const getCategoryIcon = (category?: string) => {
  if (!category) {
    return (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
      </svg>
    );
  }
  
  switch (category.toLowerCase()) {
    case 'food':
    case 'restaurant':
    case 'dining':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm-3.5 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" clipRule="evenodd" />
        </svg>
      );
    case 'transportation':
    case 'travel':
    case 'uber':
    case 'taxi':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1V8a4 4 0 00-4-4H4a1 1 0 00-1 1zm0 7v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H15V8h5a2 2 0 012 2v2h-1.05a2.5 2.5 0 01-4.9 0h-4.1a1 1 0 00-1 1v1H5a1 1 0 01-1-1v-3h4a1 1 0 001-1V6H3v5zm16 0a.5.5 0 11-1 0 .5.5 0 011 0zM8 8a.5.5 0 11-1 0 .5.5 0 011 0zm-.5 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm8 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      );
    case 'shopping':
    case 'retail':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      );
    case 'bills':
    case 'utilities':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      );
    case 'entertainment':
    case 'movies':
    case 'music':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
        </svg>
      );
    case 'health':
    case 'medical':
    case 'pharmacy':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      );
    case 'salary':
    case 'income':
    case 'deposit':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
  }
};

/**
 * Get background color based on transaction category
 */
const getCategoryColor = (category?: string): string => {
  if (!category) return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300';
  
  switch (category.toLowerCase()) {
    case 'food':
    case 'restaurant':
    case 'dining':
      return 'bg-orange-100 dark:bg-orange-800 dark:bg-opacity-30 text-orange-500 dark:text-orange-300';
    case 'transportation':
    case 'travel':
    case 'uber':
    case 'taxi':
      return 'bg-blue-100 dark:bg-blue-800 dark:bg-opacity-30 text-blue-500 dark:text-blue-300';
    case 'shopping':
    case 'retail':
      return 'bg-pink-100 dark:bg-pink-800 dark:bg-opacity-30 text-pink-500 dark:text-pink-300';
    case 'bills':
    case 'utilities':
      return 'bg-yellow-100 dark:bg-yellow-800 dark:bg-opacity-30 text-yellow-500 dark:text-yellow-300';
    case 'entertainment':
    case 'movies':
    case 'music':
      return 'bg-purple-100 dark:bg-purple-800 dark:bg-opacity-30 text-purple-500 dark:text-purple-300';
    case 'health':
    case 'medical':
    case 'pharmacy':
      return 'bg-red-100 dark:bg-red-800 dark:bg-opacity-30 text-red-500 dark:text-red-300';
    case 'salary':
    case 'income':
    case 'deposit':
      return 'bg-green-100 dark:bg-green-800 dark:bg-opacity-30 text-green-500 dark:text-green-300';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300';
  }
};

/**
 * Get status label and color
 */
const getStatusInfo = (status: string) => {
  switch (status) {
    case 'pending':
      return {
        label: 'Pending',
        color: 'text-yellow-500 dark:text-yellow-400'
      };
    case 'completed':
      return {
        label: 'Completed',
        color: 'text-green-500 dark:text-green-400'
      };
    case 'failed':
      return {
        label: 'Failed',
        color: 'text-red-500 dark:text-red-400'
      };
    case 'canceled':
      return {
        label: 'Canceled',
        color: 'text-gray-500 dark:text-gray-400'
      };
    default:
      return {
        label: status,
        color: 'text-gray-500 dark:text-gray-400'
      };
  }
};

/**
 * Format date to readable format
 */
const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined 
  });
};

/**
 * TransactionList Component
 */
export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  formatCurrency,
  isLoading = false,
  onLoadMore,
  loadMoreText = 'Load More',
  emptyMessage = 'No transactions to display',
  onTransactionClick,
  className = '',
  style = {}
}) => {
  if (transactions.length === 0 && !isLoading) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className={`${className}`} style={style}>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {transactions.map(transaction => {
          const { label: statusLabel, color: statusColor } = getStatusInfo(transaction.status);
          
          return (
            <li 
              key={transaction.id}
              className="py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition rounded-lg"
              onClick={() => onTransactionClick && onTransactionClick(transaction.id)}
            >
              <div className="flex items-center">
                {transaction.merchantLogo ? (
                  <div className="flex-shrink-0 mr-3">
                    <img 
                      src={transaction.merchantLogo} 
                      alt={transaction.description} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getCategoryColor(transaction.category)}`}>
                    {getCategoryIcon(transaction.category)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.status !== 'completed' && (
                      <span className={`ml-2 ${statusColor}`}>• {statusLabel}</span>
                    )}
                    {transaction.reference && (
                      <span className="ml-2">• Ref: {transaction.reference}</span>
                    )}
                  </div>
                </div>
                
                <div className={`text-sm font-medium ${
                  transaction.type === 'credit' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
      {isLoading && (
        <div className="p-4 text-center">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      )}
      
      {transactions.length > 0 && onLoadMore && !isLoading && (
        <div className="mt-4 text-center">
          <button 
            onClick={onLoadMore}
            className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-20 rounded-md"
          >
            {loadMoreText}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionList;