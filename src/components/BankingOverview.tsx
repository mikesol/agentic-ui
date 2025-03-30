import React, { useState } from 'react';
import { AccountCard } from './AccountCard';
import { TransactionList } from './TransactionList';

/**
 * @component BankingOverview
 * @description Overview section for a banking application showing accounts and recent transactions
 * @domain finance, banking, dashboard
 * @usage Main dashboard display for banking apps showing account balances and recent transactions
 * 
 * @example
 * // Basic usage
 * <BankingOverview
 *   accounts={userAccounts}
 *   transactions={recentTransactions}
 *   formatCurrency={(amount) => `$${amount.toFixed(2)}`}
 * />
 * 
 * @example
 * // With transaction loading
 * <BankingOverview
 *   accounts={accounts}
 *   transactions={transactions}
 *   formatCurrency={formatCurrency}
 *   onFetchMoreTransactions={handleFetchMoreTransactions}
 *   isLoadingTransactions={isLoading}
 * />
 */
export interface BankingOverviewProps {
  /** User's bank accounts */
  accounts: Array<{
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment' | string;
    balance: number;
    currency: string;
    number: string;
    available?: number;
    limit?: number;
    interestRate?: number;
  }>;
  
  /** Transaction history */
  transactions: Array<{
    id: string;
    date: string | Date;
    description: string;
    amount: number;
    type: 'debit' | 'credit';
    category?: string;
    accountId: string;
    status: 'pending' | 'completed' | 'failed' | 'canceled';
    merchantLogo?: string;
    reference?: string;
  }>;
  
  /** Function to format currency values */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Function to fetch more transactions */
  onFetchMoreTransactions?: (accountId?: string, beforeDate?: Date) => Promise<Array<any>> | void;
  
  /** Whether transactions are currently loading */
  isLoadingTransactions?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * BankingOverview Component
 */
export const BankingOverview: React.FC<BankingOverviewProps> = ({
  accounts,
  transactions,
  formatCurrency,
  onFetchMoreTransactions,
  isLoadingTransactions = false,
  className = '',
  style = {}
}) => {
  // State for selected account (null means all accounts)
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  
  // Filter transactions by selected account
  const filteredTransactions = selectedAccountId
    ? transactions.filter(tx => tx.accountId === selectedAccountId)
    : transactions;
    
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Handle loading more transactions
  const handleLoadMore = () => {
    if (onFetchMoreTransactions && !isLoadingTransactions) {
      const oldestTransaction = filteredTransactions[filteredTransactions.length - 1];
      if (oldestTransaction) {
        const oldestDate = new Date(oldestTransaction.date);
        onFetchMoreTransactions(selectedAccountId || undefined, oldestDate);
      }
    }
  };
  
  return (
    <div 
      className={`space-y-6 ${className}`}
      style={style}
    >
      {/* Summary Section */}
      <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg p-4">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-1">Total Balance</h2>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {formatCurrency(totalBalance)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'}
        </p>
      </div>
      
      {/* Accounts Carousel */}
      <div>
        <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Your Accounts</h2>
        
        <div className="flex overflow-x-auto pb-2 space-x-4 -mx-4 px-4">
          {/* All accounts option */}
          <button
            onClick={() => setSelectedAccountId(null)}
            className={`flex-shrink-0 w-56 rounded-lg border-2 ${
              selectedAccountId === null
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                : 'border-gray-200 dark:border-gray-700'
            } p-4 transition`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">All Accounts</div>
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{formatCurrency(totalBalance)}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Balance</div>
            </div>
          </button>
          
          {/* Account cards */}
          {accounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              formatCurrency={formatCurrency}
              isSelected={selectedAccountId === account.id}
              onClick={() => setSelectedAccountId(account.id)}
              className="flex-shrink-0 w-56"
            />
          ))}
        </div>
      </div>
      
      {/* Transactions List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            {selectedAccountId 
              ? `Transactions: ${accounts.find(a => a.id === selectedAccountId)?.name}`
              : 'Recent Transactions'
            }
          </h2>
          {filteredTransactions.length > 0 && (
            <button className="text-sm text-blue-600 dark:text-blue-400">
              See All
            </button>
          )}
        </div>
        
        <TransactionList
          transactions={filteredTransactions}
          formatCurrency={formatCurrency}
          isLoading={isLoadingTransactions}
          onLoadMore={onFetchMoreTransactions ? handleLoadMore : undefined}
          emptyMessage={selectedAccountId 
            ? "No transactions for this account"
            : "No recent transactions"
          }
        />
      </div>
    </div>
  );
};

export default BankingOverview;