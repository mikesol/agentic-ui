import React from 'react';

/**
 * @component AccountCard
 * @description Displays a bank account card with account details and balance
 * @domain finance, banking, account
 * @usage Display account information in banking applications
 * 
 * @example
 * // Basic usage
 * <AccountCard
 *   account={{
 *     id: 'acc-1',
 *     name: 'Checking Account',
 *     type: 'checking',
 *     balance: 1250.60,
 *     currency: 'USD',
 *     number: '****1234'
 *   }}
 *   formatCurrency={(amount) => `$${amount.toFixed(2)}`}
 * />
 * 
 * @example
 * // With selection and custom styling
 * <AccountCard
 *   account={account}
 *   formatCurrency={formatCurrency}
 *   isSelected={selectedAccountId === account.id}
 *   onClick={() => handleSelectAccount(account.id)}
 *   className="w-full max-w-sm"
 * />
 */
export interface AccountCardProps {
  /** Account object with details */
  account: {
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment' | string;
    balance: number;
    currency: string;
    number: string;
    available?: number;
    limit?: number;
    interestRate?: number;
  };
  
  /** Function to format currency values */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Whether the account is currently selected */
  isSelected?: boolean;
  
  /** Click handler for the card */
  onClick?: () => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Account icon based on account type
 */
const getAccountIcon = (type: string) => {
  switch (type) {
    case 'checking':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      );
    case 'savings':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      );
    case 'credit':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
        </svg>
      );
    case 'investment':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
  }
};

/**
 * Account color based on account type
 */
const getAccountColor = (type: string): string => {
  switch (type) {
    case 'checking':
      return 'bg-blue-100 dark:bg-blue-800 text-blue-500 dark:text-blue-300';
    case 'savings':
      return 'bg-green-100 dark:bg-green-800 text-green-500 dark:text-green-300';
    case 'credit':
      return 'bg-purple-100 dark:bg-purple-800 text-purple-500 dark:text-purple-300';
    case 'investment':
      return 'bg-amber-100 dark:bg-amber-800 text-amber-500 dark:text-amber-300';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300';
  }
};

/**
 * AccountCard Component
 */
export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  formatCurrency,
  isSelected = false,
  onClick,
  className = '',
  style = {}
}) => {
  const {
    name,
    type,
    balance,
    currency,
    number,
    available,
    limit,
    interestRate
  } = account;
  
  // Format the last 4 digits if a full account number is provided
  const displayNumber = number.length > 4 
    ? `••••${number.slice(-4)}`
    : number;
  
  // Determine if this is a credit account
  const isCredit = type === 'credit';
  
  // Determine if this account has availability info
  const hasAvailability = available !== undefined;
  
  return (
    <div 
      className={`rounded-lg border-2 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
          : 'border-gray-200 dark:border-gray-700'
      } p-4 transition cursor-pointer ${className}`}
      style={style}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{name}</div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAccountColor(type)}`}>
          {getAccountIcon(type)}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        {displayNumber}
      </div>
      
      <div className="text-right">
        <div className="text-lg font-bold">
          {formatCurrency(balance, currency)}
        </div>
        
        {/* Show additional details based on account type */}
        {isCredit && limit !== undefined && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Limit: {formatCurrency(limit, currency)}
          </div>
        )}
        
        {hasAvailability && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Available: {formatCurrency(available!, currency)}
          </div>
        )}
        
        {interestRate !== undefined && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {interestRate}% APY
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountCard;