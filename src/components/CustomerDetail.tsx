import React, { useState } from 'react';
import { Avatar } from './Avatar';

/**
 * @component CustomerDetail
 * @description Displays detailed information about a customer with their deals and tasks
 * @domain business, sales, management, crm
 * @usage View and edit detailed customer information, related deals, and tasks
 * 
 * @example
 * // Basic usage
 * <CustomerDetail 
 *   customer={customer}
 *   deals={customerDeals}
 *   tasks={customerTasks}
 *   formatCurrency={formatCurrency}
 *   formatDate={formatDate}
 *   onUpdateCustomer={handleUpdateCustomer}
 *   onBack={() => setView('customers')}
 * />
 * 
 * @example
 * // With all handlers
 * <CustomerDetail 
 *   customer={customer}
 *   deals={customerDeals}
 *   tasks={customerTasks}
 *   formatCurrency={formatCurrency}
 *   formatDate={formatDate}
 *   onUpdateCustomer={handleUpdateCustomer}
 *   onDeleteCustomer={handleDeleteCustomer}
 *   onCreateDeal={handleCreateDeal}
 *   onUpdateDeal={handleUpdateDeal}
 *   onDeleteDeal={handleDeleteDeal}
 *   onCreateTask={handleCreateTask}
 *   onUpdateTask={handleUpdateTask}
 *   onDeleteTask={handleDeleteTask}
 *   onBack={() => setView('customers')}
 * />
 */
export interface CustomerDetailProps {
  /** Customer to display */
  customer: {
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
  };
  
  /** Deals related to this customer */
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
  }>;
  
  /** Tasks related to this customer */
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
  }>;
  
  /** Function to format currency display */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Function to format date display */
  formatDate: (date: string | Date | undefined) => string;
  
  /** Function to update a customer */
  onUpdateCustomer: (data: Partial<CustomerDetailProps['customer']>) => Promise<void> | void;
  
  /** Function to delete a customer */
  onDeleteCustomer?: () => Promise<void> | void;
  
  /** Function to create a new deal */
  onCreateDeal?: (deal: Omit<CustomerDetailProps['deals'][0], 'id'>) => Promise<{ id: string }> | void;
  
  /** Function to update a deal */
  onUpdateDeal?: (dealId: string, data: Partial<CustomerDetailProps['deals'][0]>) => Promise<void> | void;
  
  /** Function to delete a deal */
  onDeleteDeal?: (dealId: string) => Promise<void> | void;
  
  /** Function to create a new task */
  onCreateTask?: (task: Omit<CustomerDetailProps['tasks'][0], 'id'>) => Promise<{ id: string }> | void;
  
  /** Function to update a task */
  onUpdateTask?: (taskId: string, data: Partial<CustomerDetailProps['tasks'][0]>) => Promise<void> | void;
  
  /** Function to delete a task */
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  
  /** Function to navigate back to customer list */
  onBack: () => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * CustomerDetail Component
 */
export const CustomerDetail: React.FC<CustomerDetailProps> = ({
  customer,
  deals,
  tasks,
  formatCurrency,
  formatDate,
  onUpdateCustomer,
  onDeleteCustomer,
  onCreateDeal,
  onUpdateDeal,
  onDeleteDeal,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onBack,
  className = '',
  style = {}
}) => {
  // Active tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'tasks' | 'edit'>('overview');
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: customer.name,
    company: customer.company || '',
    email: customer.email || '',
    phone: customer.phone || '',
    status: customer.status,
    industry: customer.industry || '',
    website: customer.website || '',
    address: customer.address || '',
    notes: customer.notes || '',
    tags: customer.tags || []
  });
  
  // Current tag input state
  const [currentTag, setCurrentTag] = useState('');
  
  // New deal form state
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    customerId: customer.id,
    value: 0,
    currency: 'USD',
    stage: 'prospecting' as const,
    priority: 'medium' as const,
    startDate: new Date().toISOString().split('T')[0],
    expectedCloseDate: ''
  });
  
  // New task form state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'to-do' as const,
    priority: 'medium' as const,
    dueDate: '',
    relatedTo: {
      type: 'customer' as const,
      id: customer.id
    }
  });
  
  // Handle edit form change
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle tag input key down
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!editForm.tags.includes(currentTag.trim())) {
        setEditForm(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    setEditForm(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Handle save customer changes
  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    try {
      await onUpdateCustomer(editForm);
      setActiveTab('overview');
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };
  
  // Handle new deal form change
  const handleNewDealChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDeal(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle create deal form submit
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateDeal) return;
    
    try {
      await onCreateDeal(newDeal);
      setShowAddDealModal(false);
      setNewDeal({
        title: '',
        customerId: customer.id,
        value: 0,
        currency: 'USD',
        stage: 'prospecting',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        expectedCloseDate: ''
      });
    } catch (error) {
      console.error('Error creating deal:', error);
    }
  };
  
  // Handle new task form change
  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle create task form submit
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateTask) return;
    
    try {
      await onCreateTask(newTask);
      setShowAddTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'to-do',
        priority: 'medium',
        dueDate: '',
        relatedTo: {
          type: 'customer',
          id: customer.id
        }
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  // Handle task status update
  const handleUpdateTaskStatus = async (taskId: string, status: 'to-do' | 'in-progress' | 'completed' | 'cancelled') => {
    if (!onUpdateTask) return;
    
    try {
      await onUpdateTask(taskId, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
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
  
  // Helper function to get stage color
  const getStageColor = (stage: string): string => {
    switch (stage) {
      case 'prospecting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'qualification':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
      case 'proposal':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'negotiation':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'closed-won':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'closed-lost':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };
  
  // Helper function to get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'low':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  // Helper function to get task status color
  const getTaskStatusColor = (status: string): string => {
    switch (status) {
      case 'to-do':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };
  
  return (
    <div className={`${className}`} style={style}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex-shrink-0 mr-4">
              <Avatar
                name={customer.name}
                src={customer.avatar}
                size="lg"
                shape="circle"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{customer.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                  {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                </span>
                {customer.company && (
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {customer.company}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-2">
            <button
              onClick={() => setActiveTab('edit')}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Edit
            </button>
            {onDeleteCustomer && (
              <button
                onClick={onDeleteCustomer}
                className="px-3 py-1.5 text-sm border border-red-300 dark:border-red-600 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-6 py-2 flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium mr-2 ${
              activeTab === 'overview'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-2 text-sm font-medium mr-2 ${
              activeTab === 'deals'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Deals ({deals.length})
          </button>
          
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 text-sm font-medium mr-2 ${
              activeTab === 'tasks'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Tasks ({tasks.length})
          </button>
          
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 text-sm font-medium hidden sm:block ${
              activeTab === 'edit'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Edit
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Customer Information</h2>
            </div>
            <div className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.company || '-'}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {customer.email ? (
                      <a href={`mailto:${customer.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {customer.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {customer.phone ? (
                      <a href={`tel:${customer.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {customer.phone}
                      </a>
                    ) : (
                      '-'
                    )}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Industry</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.industry || '-'}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {customer.website ? (
                      <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                        {customer.website}
                      </a>
                    ) : (
                      '-'
                    )}
                  </dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{customer.address || '-'}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(customer.createdAt)}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Contacted</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {customer.lastContactedAt ? formatDate(customer.lastContactedAt) : 'Never'}
                  </dd>
                </div>
                
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</dt>
                  <dd className="mt-1">
                    <div className="flex flex-wrap gap-2">
                      {customer.tags && customer.tags.length > 0 ? (
                        customer.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">No tags</span>
                      )}
                    </div>
                  </dd>
                </div>
              </dl>
              
              {customer.notes && (
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h3>
                  <div className="text-sm text-gray-900 dark:text-white whitespace-pre-line">{customer.notes}</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Summary</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Deals</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">{deals.length}</dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Deals</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).length}
                  </dd>
                </div>
                
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Won Deals</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {deals.filter(d => d.stage === 'closed-won').length}
                  </dd>
                </div>
                
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Value</dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(deals.reduce((sum, deal) => sum + deal.value, 0))}
                  </dd>
                </div>
              </dl>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Tasks</h3>
              </div>
              <div className="p-4">
                {tasks.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks
                      .sort((a, b) => {
                        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                        return dateA - dateB;
                      })
                      .slice(0, 5)
                      .map(task => (
                        <li key={task.id} className="py-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                onChange={() => handleUpdateTaskStatus(task.id, task.status === 'completed' ? 'to-do' : 'completed')}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                              />
                              <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                  task.status === 'completed' 
                                    ? 'text-gray-400 dark:text-gray-500 line-through' 
                                    : 'text-gray-900 dark:text-white'
                                }`}>
                                  {task.title}
                                </p>
                                {task.dueDate && (
                                  <p className={`text-xs ${
                                    task.status === 'completed'
                                      ? 'text-gray-400 dark:text-gray-500'
                                      : new Date(task.dueDate) < new Date()
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {task.status === 'completed' ? 'Completed' : 'Due'}: {formatDate(task.dueDate)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3">
                    No tasks found
                  </p>
                )}
                
                {onCreateTask && (
                  <div className="mt-4 flex">
                    <button
                      onClick={() => setShowAddTaskModal(true)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Task
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'deals' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Deals</h2>
            {onCreateDeal && (
              <button
                onClick={() => setShowAddDealModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
              >
                Add Deal
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Expected Close
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {deals.length > 0 ? (
                  deals.map(deal => (
                    <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {deal.title}
                            </div>
                            {deal.priority && (
                              <div className={`text-xs ${getPriorityColor(deal.priority)}`}>
                                {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)} Priority
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                          {deal.stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatCurrency(deal.value, deal.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(deal.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {deal.expectedCloseDate ? formatDate(deal.expectedCloseDate) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {onUpdateDeal && (
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                            Edit
                          </button>
                        )}
                        {onDeleteDeal && (
                          <button
                            onClick={() => onDeleteDeal(deal.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No deals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'tasks' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tasks</h2>
            {onCreateTask && (
              <button
                onClick={() => setShowAddTaskModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm"
              >
                Add Task
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.length > 0 ? (
                  tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {task.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTaskStatusColor(task.status)}`}>
                          {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {task.dueDate ? (
                          <span className={
                            task.status === 'completed' || task.status === 'cancelled'
                              ? ''
                              : new Date(task.dueDate) < new Date()
                                ? 'text-red-600 dark:text-red-400 font-medium'
                                : ''
                          }>
                            {formatDate(task.dueDate)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {onUpdateTask && (
                          <div className="flex space-x-3 justify-end">
                            {task.status !== 'completed' && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Complete
                              </button>
                            )}
                            {task.status === 'completed' && (
                              <button
                                onClick={() => handleUpdateTaskStatus(task.id, 'to-do')}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                Reopen
                              </button>
                            )}
                            {onDeleteTask && (
                              <button
                                onClick={() => onDeleteTask(task.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'edit' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Edit Customer</h2>
          </div>
          
          <form onSubmit={handleSaveChanges}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditFormChange}
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
                  value={editForm.company}
                  onChange={handleEditFormChange}
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
                  value={editForm.email}
                  onChange={handleEditFormChange}
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
                  value={editForm.phone}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={editForm.status}
                  onChange={handleEditFormChange}
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
                  value={editForm.industry}
                  onChange={handleEditFormChange}
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
                  value={editForm.website}
                  onChange={handleEditFormChange}
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
                  value={editForm.address}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (press Enter to add)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editForm.tags.map(tag => (
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
              
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={editForm.notes}
                  onChange={handleEditFormChange}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Add Deal Modal */}
      {showAddDealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Add New Deal
              </h3>
            </div>
            
            <form onSubmit={handleCreateDeal}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newDeal.title}
                    onChange={handleNewDealChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Value *
                    </label>
                    <input
                      type="number"
                      id="value"
                      name="value"
                      value={newDeal.value}
                      onChange={handleNewDealChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Currency
                    </label>
                    <input
                      type="text"
                      id="currency"
                      name="currency"
                      value={newDeal.currency}
                      onChange={handleNewDealChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Stage *
                  </label>
                  <select
                    id="stage"
                    name="stage"
                    value={newDeal.stage}
                    onChange={handleNewDealChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="prospecting">Prospecting</option>
                    <option value="qualification">Qualification</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed-won">Closed Won</option>
                    <option value="closed-lost">Closed Lost</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={newDeal.priority}
                    onChange={handleNewDealChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newDeal.startDate}
                      onChange={handleNewDealChange}
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expectedCloseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Expected Close Date
                    </label>
                    <input
                      type="date"
                      id="expectedCloseDate"
                      name="expectedCloseDate"
                      value={newDeal.expectedCloseDate}
                      onChange={handleNewDealChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right space-x-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Add New Task
              </h3>
            </div>
            
            <form onSubmit={handleCreateTask}>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleNewTaskChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={newTask.description}
                    onChange={handleNewTaskChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status *
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={newTask.status}
                      onChange={handleNewTaskChange}
                      required
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="to-do">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleNewTaskChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleNewTaskChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right space-x-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;