import React, { useState } from 'react';
import { Avatar } from './Avatar';

/**
 * @component BankingTransfer
 * @description Form for creating bank transfers between accounts or to external recipients
 * @domain finance, banking, payments
 * @usage Transfer funds between accounts or to external recipients in banking applications
 * 
 * @example
 * // Basic usage
 * <BankingTransfer
 *   accounts={accounts}
 *   formatCurrency={formatCurrency}
 *   onTransfer={handleTransfer}
 * />
 * 
 * @example
 * // With external contacts
 * <BankingTransfer
 *   accounts={accounts}
 *   contacts={contacts}
 *   formatCurrency={formatCurrency}
 *   onTransfer={handleTransfer}
 * />
 */
export interface BankingTransferProps {
  /** User's bank accounts */
  accounts: Array<{
    id: string;
    name: string;
    type: 'checking' | 'savings' | 'credit' | 'investment' | string;
    balance: number;
    currency: string;
    number: string;
    available?: number;
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
  
  /** Function to format currency values */
  formatCurrency: (amount: number, currency?: string) => string;
  
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
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Recurring frequency options
 */
const RECURRING_OPTIONS = [
  { value: 'once', label: 'One time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

/**
 * BankingTransfer Component
 */
export const BankingTransfer: React.FC<BankingTransferProps> = ({
  accounts,
  contacts = [],
  formatCurrency,
  onTransfer,
  className = '',
  style = {}
}) => {
  // Transfer state
  const [transferType, setTransferType] = useState<'between' | 'external'>('between');
  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState<string>('');
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [recurringFrequency, setRecurringFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly'>('once');
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Success message
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Filter accounts to avoid sending to the same account
  const toAccounts = accounts.filter(account => account.id !== fromAccountId);
  
  // Get selected from account
  const fromAccount = accounts.find(account => account.id === fromAccountId);
  
  // Get selected to account or contact
  const toAccount = toAccountId 
    ? accounts.find(account => account.id === toAccountId) 
    : null;
  
  const selectedContact = selectedContactId 
    ? contacts.find(contact => contact.id === selectedContactId) 
    : null;
  
  // Get the maximum amount that can be transferred from the selected account
  const maxAmount = fromAccount ? (fromAccount.available ?? fromAccount.balance) : 0;
  
  // Reset form
  const resetForm = () => {
    setToAccountId('');
    setSelectedContactId('');
    setAmount('');
    setDescription('');
    setScheduledDate('');
    setRecurringFrequency('once');
    setErrors({});
  };
  
  // Handle transfer type change
  const handleTransferTypeChange = (type: 'between' | 'external') => {
    setTransferType(type);
    resetForm();
  };
  
  // Handle account change
  const handleFromAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromAccountId(e.target.value);
    
    // Reset to account if it's the same as the new from account
    if (toAccountId === e.target.value) {
      setToAccountId('');
    }
  };
  
  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };
  
  // Handle transfer submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!fromAccountId) {
      newErrors.fromAccount = 'Please select a source account';
    }
    
    if (transferType === 'between' && !toAccountId) {
      newErrors.toAccount = 'Please select a destination account';
    }
    
    if (transferType === 'external' && !selectedContactId) {
      newErrors.contact = 'Please select a recipient';
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(amount) > maxAmount) {
      newErrors.amount = `Amount exceeds available balance of ${formatCurrency(maxAmount)}`;
    }
    
    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Create transfer data
    const transferData = {
      fromAccountId,
      toAccountId: transferType === 'between' ? toAccountId : '',
      amount: parseFloat(amount),
      description: description.trim(),
      isExternal: transferType === 'external',
      contactId: transferType === 'external' ? selectedContactId : undefined,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      recurringFrequency: scheduledDate ? recurringFrequency : undefined
    };
    
    try {
      // Process transfer
      await onTransfer(transferData);
      
      // Show success message
      setSuccessMessage(
        transferType === 'between'
          ? `Successfully transferred ${formatCurrency(parseFloat(amount))} to ${toAccount?.name}`
          : `Successfully sent ${formatCurrency(parseFloat(amount))} to ${selectedContact?.name}`
      );
      
      // Reset form
      resetForm();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      setErrors({ submit: 'Failed to process transfer. Please try again.' });
    }
  };
  
  return (
    <div 
      className={`${className}`}
      style={style}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Transfer Money
      </h2>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 text-green-700 dark:text-green-300 rounded-md">
          {successMessage}
        </div>
      )}
      
      {/* Transfer type tabs */}
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleTransferTypeChange('between')}
          className={`px-4 py-2 border-b-2 ${
            transferType === 'between'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Between My Accounts
        </button>
        <button
          onClick={() => handleTransferTypeChange('external')}
          className={`px-4 py-2 border-b-2 ${
            transferType === 'external'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          } ml-4`}
        >
          Send to Someone
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* From Account */}
        <div>
          <label htmlFor="from-account" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            From Account
          </label>
          <select
            id="from-account"
            value={fromAccountId}
            onChange={handleFromAccountChange}
            className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.fromAccount
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <option value="">Select account</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>
                {account.name} - {formatCurrency(account.balance)} {account.available !== undefined ? `(${formatCurrency(account.available)} available)` : ''}
              </option>
            ))}
          </select>
          {errors.fromAccount && (
            <p className="mt-1 text-sm text-red-500">{errors.fromAccount}</p>
          )}
        </div>
        
        {/* To Account (Between Accounts) or Contact (External) */}
        {transferType === 'between' ? (
          <div>
            <label htmlFor="to-account" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              To Account
            </label>
            <select
              id="to-account"
              value={toAccountId}
              onChange={(e) => setToAccountId(e.target.value)}
              className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.toAccount
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Select account</option>
              {toAccounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {formatCurrency(account.balance)}
                </option>
              ))}
            </select>
            {errors.toAccount && (
              <p className="mt-1 text-sm text-red-500">{errors.toAccount}</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipient
            </label>
            <div className={`border rounded-md ${
              errors.contact
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              {contacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No contacts available. Please add a contact first.
                </div>
              ) : (
                <div className="max-h-36 overflow-y-auto p-1">
                  {contacts.map(contact => (
                    <div
                      key={contact.id}
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        selectedContactId === contact.id
                          ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedContactId(contact.id)}
                    >
                      <Avatar
                        name={contact.name}
                        src={contact.avatar}
                        size="sm"
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-800 dark:text-white">
                          {contact.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {contact.bank ? `${contact.bank} • ` : ''}
                          {contact.accountNumber.slice(-4).padStart(contact.accountNumber.length, '•')}
                        </div>
                      </div>
                      {selectedContactId === contact.id && (
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.contact && (
              <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
            )}
          </div>
        )}
        
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className={`w-full pl-7 pr-12 py-2 bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.amount
                  ? 'border-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {fromAccount && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-xs text-gray-500">
                  Max: {formatCurrency(maxAmount)}
                </span>
              </div>
            )}
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this for?"
            className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              errors.description
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        
        {/* Schedule (Optional) */}
        <div>
          <div className="flex items-center mb-1">
            <label htmlFor="scheduled-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Schedule (Optional)
            </label>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="flex-1">
              <input
                type="date"
                id="scheduled-date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {scheduledDate && (
              <div className="flex-1">
                <select
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {RECURRING_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="pt-2">
          {errors.submit && (
            <p className="mb-3 text-sm text-red-500">{errors.submit}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {transferType === 'between' ? 'Transfer' : 'Send'} {amount ? formatCurrency(parseFloat(amount) || 0) : ''}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BankingTransfer;