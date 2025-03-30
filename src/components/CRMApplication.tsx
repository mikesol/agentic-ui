import React, { useState } from 'react';
import { CustomerList } from './CustomerList';
import { CustomerDetail } from './CustomerDetail';
import { DealsList } from './DealsList';
import { TasksList } from './TasksList';
import { Dashboard } from './Dashboard';
import { Avatar } from './Avatar';

/**
 * @component CRMApplication
 * @description A complete customer relationship management application with customers, deals, tasks, and analytics
 * @domain business, sales, management, crm
 * @usage Complete CRM interface for managing customer relationships, deals pipeline, tasks, and analytics
 * 
 * @example
 * // Basic usage with default styling
 * <CRMApplication 
 *   user={{ id: 'user-1', name: 'John Doe', email: 'john@example.com' }}
 *   customers={customers}
 *   deals={deals}
 *   tasks={tasks}
 *   onCreateCustomer={(customer) => api.createCustomer(customer)}
 *   onUpdateCustomer={(id, data) => api.updateCustomer(id, data)}
 * />
 * 
 * @example
 * // With custom handlers and theme
 * <CRMApplication 
 *   user={currentUser}
 *   customers={customers}
 *   deals={deals}
 *   tasks={tasks}
 *   onCreateCustomer={handleCreateCustomer}
 *   onUpdateCustomer={handleUpdateCustomer}
 *   onCreateDeal={handleCreateDeal}
 *   onUpdateDeal={handleUpdateDeal}
 *   onCreateTask={handleCreateTask}
 *   onUpdateTask={handleUpdateTask}
 *   theme="dark"
 * />
 */
export interface CRMApplicationProps {
  /** Current user information */
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
    department?: string;
  };
  
  /** Customers in the CRM */
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
  
  /** Deals/opportunities in the CRM */
  deals: Array<{
    id: string;
    title: string;
    customerId: string;
    value: number;
    currency?: string;
    stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
    priority?: 'low' | 'medium' | 'high';
    startDate: string | Date;
    closedDate?: string | Date;
    expectedCloseDate?: string | Date;
    probability?: number;
    products?: Array<{ id: string; name: string; quantity: number; price: number }>;
    assignedTo?: string;
    notes?: string;
  }>;
  
  /** Tasks in the CRM */
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    status: 'to-do' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string | Date;
    completedAt?: string | Date;
    assignedTo?: string;
    relatedTo?: {
      type: 'customer' | 'deal';
      id: string;
    };
    reminders?: Array<{
      id: string;
      time: string | Date;
    }>;
  }>;
  
  /** Function to create a new customer */
  onCreateCustomer: (customer: Omit<CRMApplicationProps['customers'][0], 'id' | 'createdAt'>) => Promise<{ id: string }> | void;
  
  /** Function to update a customer */
  onUpdateCustomer: (customerId: string, data: Partial<CRMApplicationProps['customers'][0]>) => Promise<void> | void;
  
  /** Function to delete a customer */
  onDeleteCustomer?: (customerId: string) => Promise<void> | void;
  
  /** Function to create a new deal */
  onCreateDeal?: (deal: Omit<CRMApplicationProps['deals'][0], 'id'>) => Promise<{ id: string }> | void;
  
  /** Function to update a deal */
  onUpdateDeal?: (dealId: string, data: Partial<CRMApplicationProps['deals'][0]>) => Promise<void> | void;
  
  /** Function to delete a deal */
  onDeleteDeal?: (dealId: string) => Promise<void> | void;
  
  /** Function to create a new task */
  onCreateTask?: (task: Omit<CRMApplicationProps['tasks'][0], 'id'>) => Promise<{ id: string }> | void;
  
  /** Function to update a task */
  onUpdateTask?: (taskId: string, data: Partial<CRMApplicationProps['tasks'][0]>) => Promise<void> | void;
  
  /** Function to delete a task */
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  
  /** Function to import customer data */
  onImportData?: (file: File) => Promise<void> | void;
  
  /** Function to export customer data */
  onExportData?: (type: 'customers' | 'deals' | 'tasks' | 'all') => Promise<void> | void;
  
  /** Function to fetch analytics data */
  onFetchAnalytics?: () => Promise<{
    revenueByMonth: Array<{ month: string; revenue: number }>;
    dealsByStage: Array<{ stage: string; count: number }>;
    customersByStatus: Array<{ status: string; count: number }>;
    topPerformers: Array<{ userId: string; name: string; dealsWon: number; revenue: number }>;
  }> | void;
  
  /** Theme (optional) */
  theme?: 'light' | 'dark' | 'system' | string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

type ViewType = 'dashboard' | 'customers' | 'deals' | 'tasks' | 'customer-detail';

/**
 * CRMApplication Component
 */
export const CRMApplication: React.FC<CRMApplicationProps> = ({
  user,
  customers,
  deals,
  tasks,
  onCreateCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
  onCreateDeal,
  onUpdateDeal,
  onDeleteDeal,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onImportData,
  onExportData,
  onFetchAnalytics,
  theme = 'light',
  className = '',
  style = {}
}) => {
  // Current view state
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  
  // Selected customer for detail view
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  // Format currency based on currency code
  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency 
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle viewing a customer's details
  const handleViewCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setCurrentView('customer-detail');
  };
  
  // Get customer by ID
  const getCustomerById = (customerId: string) => {
    return customers.find(customer => customer.id === customerId);
  };
  
  // Get deals for a customer
  const getDealsForCustomer = (customerId: string) => {
    return deals.filter(deal => deal.customerId === customerId);
  };
  
  // Get tasks for a customer
  const getTasksForCustomer = (customerId: string) => {
    return tasks.filter(task => task.relatedTo?.type === 'customer' && task.relatedTo.id === customerId);
  };
  
  // Get tasks for a deal
  const getTasksForDeal = (dealId: string) => {
    return tasks.filter(task => task.relatedTo?.type === 'deal' && task.relatedTo.id === dealId);
  };
  
  // Render the main content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            customers={customers}
            deals={deals}
            tasks={tasks}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onFetchAnalytics={onFetchAnalytics}
            onViewCustomer={handleViewCustomer}
          />
        );
        
      case 'customers':
        return (
          <CustomerList 
            customers={customers}
            formatDate={formatDate}
            onViewCustomer={handleViewCustomer}
            onCreateCustomer={onCreateCustomer}
            onUpdateCustomer={onUpdateCustomer}
            onDeleteCustomer={onDeleteCustomer}
            onImportData={onImportData}
            onExportData={onExportData && (() => onExportData('customers'))}
          />
        );
        
      case 'deals':
        return (
          <DealsList 
            deals={deals}
            customers={customers}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onCreateDeal={onCreateDeal}
            onUpdateDeal={onUpdateDeal}
            onDeleteDeal={onDeleteDeal}
            onViewCustomer={handleViewCustomer}
            onExportData={onExportData && (() => onExportData('deals'))}
          />
        );
        
      case 'tasks':
        return (
          <TasksList 
            tasks={tasks}
            customers={customers}
            deals={deals}
            formatDate={formatDate}
            onCreateTask={onCreateTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onViewCustomer={handleViewCustomer}
            onExportData={onExportData && (() => onExportData('tasks'))}
          />
        );
        
      case 'customer-detail':
        if (!selectedCustomerId) {
          return null;
        }
        
        const customer = getCustomerById(selectedCustomerId);
        if (!customer) {
          return <div>Customer not found</div>;
        }
        
        const customerDeals = getDealsForCustomer(selectedCustomerId);
        const customerTasks = getTasksForCustomer(selectedCustomerId);
        
        return (
          <CustomerDetail 
            customer={customer}
            deals={customerDeals}
            tasks={customerTasks}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onUpdateCustomer={(data) => onUpdateCustomer(selectedCustomerId, data)}
            onDeleteCustomer={onDeleteCustomer && (() => onDeleteCustomer(selectedCustomerId))}
            onCreateDeal={onCreateDeal}
            onUpdateDeal={onUpdateDeal}
            onDeleteDeal={onDeleteDeal}
            onCreateTask={onCreateTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            onBack={() => setCurrentView('customers')}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div 
      className={`flex h-screen w-full bg-gray-100 dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''} ${className}`}
      style={style}
    >
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="hidden md:block text-xl font-bold text-blue-600 dark:text-blue-400">
              CRM<span className="text-gray-500 dark:text-gray-400">Pro</span>
            </div>
            <div className="block md:hidden text-xl font-bold text-blue-600 dark:text-blue-400">
              CR
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center w-full p-2 rounded-md ${
                currentView === 'dashboard'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden md:block">Dashboard</span>
            </button>
            
            <button
              onClick={() => setCurrentView('customers')}
              className={`flex items-center w-full p-2 rounded-md ${
                currentView === 'customers' || currentView === 'customer-detail'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="hidden md:block">Customers</span>
            </button>
            
            <button
              onClick={() => setCurrentView('deals')}
              className={`flex items-center w-full p-2 rounded-md ${
                currentView === 'deals'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="hidden md:block">Deals</span>
            </button>
            
            <button
              onClick={() => setCurrentView('tasks')}
              className={`flex items-center w-full p-2 rounded-md ${
                currentView === 'tasks'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden md:block">Tasks</span>
            </button>
          </nav>
          
          {/* User Profile */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center space-x-3">
              <Avatar
                name={user.name}
                src={user.avatar}
                size="sm"
                shape="circle"
              />
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user.role || user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentView === 'dashboard' && 'Dashboard'}
              {currentView === 'customers' && 'Customers'}
              {currentView === 'deals' && 'Deals'}
              {currentView === 'tasks' && 'Tasks'}
              {currentView === 'customer-detail' && 'Customer Details'}
            </h1>
            
            <div className="flex items-center space-x-2">
              {currentView !== 'dashboard' && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </button>
              )}
              
              <div className="relative">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
              
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default CRMApplication;