import React, { useState } from 'react';
import { Avatar } from './Avatar';

/**
 * @component CustomerList
 * @description Displays a list of customers with searching, filtering, and action capabilities
 * @domain business, sales, management, crm
 * @usage View, search and manage customer records in a CRM system
 * 
 * @example
 * // Basic usage
 * <CustomerList 
 *   customers={customers}
 *   formatDate={formatDate}
 *   onViewCustomer={handleViewCustomer}
 *   onCreateCustomer={handleCreateCustomer}
 *   onUpdateCustomer={handleUpdateCustomer}
 * />
 * 
 * @example
 * // With delete and import/export
 * <CustomerList 
 *   customers={customers}
 *   formatDate={formatDate}
 *   onViewCustomer={handleViewCustomer}
 *   onCreateCustomer={handleCreateCustomer}
 *   onUpdateCustomer={handleUpdateCustomer}
 *   onDeleteCustomer={handleDeleteCustomer}
 *   onImportData={handleImportData}
 *   onExportData={handleExportData}
 * />
 */
export interface CustomerListProps {
  /** Customers to display */
  customers: Array<{
    id: string;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    status: 'lead' | 'prospect' | 'customer' | 'churned';
    industry?: string;
    website?: string;
    address?: string;
    createdAt: string | Date;
    lastContactedAt?: string | Date;
    assignedTo?: string;
    tags?: string[];
    notes?: string;
    avatar?: string;
  }>;
  
  /** Function to format date display */
  formatDate: (date: string | Date | undefined) => string;
  
  /** Function to handle viewing a customer's details */
  onViewCustomer: (customerId: string) => void;
  
  /** Function to create a new customer */
  onCreateCustomer: (customer: Omit<CustomerListProps['customers'][0], 'id' | 'createdAt'>) => Promise<{ id: string }> | void;
  
  /** Function to update a customer */
  onUpdateCustomer: (customerId: string, data: Partial<CustomerListProps['customers'][0]>) => Promise<void> | void;
  
  /** Function to delete a customer */
  onDeleteCustomer?: (customerId: string) => Promise<void> | void;
  
  /** Function to import customer data */
  onImportData?: (file: File) => Promise<void> | void;
  
  /** Function to export customer data */
  onExportData?: () => Promise<void> | void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * CustomerList Component
 */
export const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  formatDate,
  onViewCustomer,
  onCreateCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onImportData,
  onExportData,
  className = '',
  style = {}
}) => {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Status filter state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Show create customer modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'lead' as const,
    industry: '',
    website: '',
    address: '',
    tags: [] as string[]
  });
  
  // Current tag input state
  const [currentTag, setCurrentTag] = useState('');
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status);
  };
  
  // Handle new customer form change
  const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle tag input key down
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!newCustomer.tags.includes(currentTag.trim())) {
        setNewCustomer(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    setNewCustomer(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Handle create customer form submit
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateCustomer(newCustomer);
      setShowCreateModal(false);
      setNewCustomer({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'lead',
        industry: '',
        website: '',
        address: '',
        tags: []
      });
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  };
  
  // Handle file import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportData) {
      onImportData(file);
    }
  };
  
  // Filter customers based on search query and status filter
  const filteredCustomers = customers.filter(customer => {
    // Filter by status if a filter is selected
    if (statusFilter && customer.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        customer.name.toLowerCase().includes(query) ||
        (customer.company && customer.company.toLowerCase().includes(query)) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.phone && customer.phone.includes(query)) ||
        (customer.tags && customer.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    return true;
  });
  
  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'lead':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'prospect':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'customer':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'churned':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };
  
  return (
    <div className={`${className}`} style={style}>
      {/* Header with search and filters */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Customer
          </button>
          
          {(onImportData || onExportData) && (
            <div className="relative">
              <button
                id="import-export-menu"
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Import / Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 hidden group-hover:block">
                {onImportData && (
                  <label className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                    Import CSV
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileImport}
                    />
                  </label>
                )}
                {onExportData && (
                  <button
                    onClick={onExportData}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Export CSV
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => handleStatusFilterChange(null)}
          className={`px-3 py-1 text-sm rounded-full ${
            statusFilter === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        
        {['lead', 'prospect', 'customer', 'churned'].map(status => (
          <button
            key={status}
            onClick={() => handleStatusFilterChange(status)}
            className={`px-3 py-1 text-sm rounded-full ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : getStatusColor(status)
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}s
          </button>
        ))}
      </div>
      
      {/* Customers table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Contact
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCustomers.map(customer => (
                <tr 
                  key={customer.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Avatar
                          name={customer.name}
                          src={customer.avatar}
                          size="sm"
                          shape="circle"
                        />
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => onViewCustomer(customer.id)}
                          className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {customer.name}
                        </button>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {customer.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {customer.lastContactedAt ? formatDate(customer.lastContactedAt) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewCustomer(customer.id)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                    {onDeleteCustomer && (
                      <button
                        onClick={() => onDeleteCustomer(customer.id)}
                        className="ml-3 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Add New Customer
              </h3>
            </div>
            
            <form onSubmit={handleCreateCustomer}>
              <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newCustomer.name}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={newCustomer.company}
                    onChange={handleNewCustomerChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newCustomer.email}
                    onChange={handleNewCustomerChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newCustomer.phone}
                    onChange={handleNewCustomerChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={newCustomer.status}
                    onChange={handleNewCustomerChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="churned">Churned</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    value={newCustomer.industry}
                    onChange={handleNewCustomerChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={newCustomer.website}
                    onChange={handleNewCustomerChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newCustomer.address}
                    onChange={handleNewCustomerChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (press Enter to add)
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newCustomer.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-700 focus:outline-none"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Add tags..."
                  />
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;