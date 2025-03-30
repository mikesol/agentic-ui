import React, { useState } from 'react';
import { BankingOverview } from './BankingOverview';
import { BankingMessages } from './BankingMessages';
import { BankingTransfer } from './BankingTransfer';
import { BankingProfile } from './BankingProfile';
import { Avatar } from './Avatar';

/**
 * @component BankingApplication
 * @description A complete banking application with overview, messages, transfers, and profile sections
 * @domain finance, banking, payments
 * @usage Banking interface with account overview, messaging, transfers, and profile management
 * 
 * @example
 * // Basic usage with default styling
 * <BankingApplication 
 *   user={{ id: 'user-1', name: 'John Doe', email: 'john@example.com' }}
 *   accounts={userAccounts}
 *   transactions={transactions}
 *   messages={messages}
 *   onSendMessage={(message) => api.sendMessage(message)}
 *   onTransfer={(transferData) => api.processTransfer(transferData)}
 * />
 * 
 * @example
 * // With custom handlers and theme
 * <BankingApplication 
 *   user={currentUser}
 *   accounts={accounts}
 *   transactions={transactions}
 *   messages={messages}
 *   onSendMessage={handleSendMessage}
 *   onTransfer={handleTransfer}
 *   onUpdateProfile={handleProfileUpdate}
 *   theme="dark"
 * />
 */
export interface BankingApplicationProps {
  /** Current user information */
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    address?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
  };
  
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
  
  /** Bank messages */
  messages: Array<{
    id: string;
    subject: string;
    body: string;
    date: string | Date;
    isRead: boolean;
    attachments?: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
      size: number;
    }>;
    sender: 'bank' | 'user';
  }>;
  
  /** External contacts for transfers */
  contacts?: Array<{
    id: string;
    name: string;
    accountNumber: string;
    bank?: string;
    email?: string;
    avatar?: string;
  }>;
  
  /** Function to send a message to the bank */
  onSendMessage: (message: {
    subject: string;
    body: string;
    attachments?: File[];
  }) => Promise<void> | void;
  
  /** Function to process a transfer */
  onTransfer: (transfer: {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    description: string;
    isExternal?: boolean;
    contactId?: string;
    scheduledDate?: Date;
    recurringFrequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  }) => Promise<void> | void;
  
  /** Function to update profile information */
  onUpdateProfile?: (profileData: Partial<BankingApplicationProps['user']>) => Promise<void> | void;
  
  /** Function to fetch more transactions */
  onFetchMoreTransactions?: (accountId?: string, beforeDate?: Date) => Promise<Array<any>> | void;
  
  /** Theme (optional) */
  theme?: 'light' | 'dark' | 'system' | string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

type TabType = 'overview' | 'messages' | 'transfer' | 'profile';

/**
 * BankingApplication Component
 */
export const BankingApplication: React.FC<BankingApplicationProps> = ({
  user,
  accounts,
  transactions,
  messages,
  contacts = [],
  onSendMessage,
  onTransfer,
  onUpdateProfile,
  onFetchMoreTransactions,
  theme = 'light',
  className = '',
  style = {}
}) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Format currency based on currency code
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    }).format(amount);
  };
  
  // Total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Count unread messages
  const unreadMessages = messages.filter(msg => !msg.isRead).length;
  
  // Render the selected tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <BankingOverview
            accounts={accounts}
            transactions={transactions}
            formatCurrency={formatCurrency}
            onFetchMoreTransactions={onFetchMoreTransactions}
          />
        );
        
      case 'messages':
        return (
          <BankingMessages
            messages={messages}
            user={user}
            onSendMessage={onSendMessage}
          />
        );
        
      case 'transfer':
        return (
          <BankingTransfer
            accounts={accounts}
            contacts={contacts}
            formatCurrency={formatCurrency}
            onTransfer={onTransfer}
          />
        );
        
      case 'profile':
        return (
          <BankingProfile
            user={user}
            onUpdateProfile={onUpdateProfile}
          />
        );
        
      default:
        return <div>Select a tab</div>;
    }
  };
  
  return (
    <div 
      className={`flex flex-col h-full w-full bg-white dark:bg-gray-800 ${theme === 'dark' ? 'dark' : ''} ${className}`}
      style={style}
    >
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Banking App</h1>
          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-blue-100">{formatCurrency(totalBalance)}</div>
            </div>
            <Avatar
              name={user.name}
              src={user.avatar}
              size="md"
              shape="circle"
            />
          </div>
        </div>
      </header>
      
      {/* Tab content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4">
          {renderTabContent()}
        </div>
      </main>
      
      {/* Footer navigation tabs */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <nav className="container mx-auto">
          <ul className="flex">
            <li className="flex-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full py-4 flex flex-col items-center ${
                  activeTab === 'overview'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                aria-current={activeTab === 'overview' ? 'page' : undefined}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <span className="text-xs mt-1">Overview</span>
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full py-4 flex flex-col items-center ${
                  activeTab === 'messages'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                aria-current={activeTab === 'messages' ? 'page' : undefined}
              >
                <div className="relative">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">Messages</span>
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => setActiveTab('transfer')}
                className={`w-full py-4 flex flex-col items-center ${
                  activeTab === 'transfer'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                aria-current={activeTab === 'transfer' ? 'page' : undefined}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
                <span className="text-xs mt-1">Transfer</span>
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full py-4 flex flex-col items-center ${
                  activeTab === 'profile'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
                aria-current={activeTab === 'profile' ? 'page' : undefined}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="text-xs mt-1">Profile</span>
              </button>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default BankingApplication;