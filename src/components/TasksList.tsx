import React, { useState } from 'react';

/**
 * @component TasksList
 * @description Displays a list of tasks with filtering, sorting, and actions
 * @domain business, sales, management, crm
 * @usage View, filter, and manage tasks in a CRM system
 * 
 * @example
 * // Basic usage
 * <TasksList 
 *   tasks={tasks}
 *   customers={customers}
 *   deals={deals}
 *   formatDate={formatDate}
 *   onCreateTask={handleCreateTask}
 *   onUpdateTask={handleUpdateTask}
 *   onViewCustomer={handleViewCustomer}
 * />
 * 
 * @example
 * // With all handlers
 * <TasksList 
 *   tasks={tasks}
 *   customers={customers}
 *   deals={deals}
 *   formatDate={formatDate}
 *   onCreateTask={handleCreateTask}
 *   onUpdateTask={handleUpdateTask}
 *   onDeleteTask={handleDeleteTask}
 *   onViewCustomer={handleViewCustomer}
 *   onExportData={handleExportData}
 * />
 */
export interface TasksListProps {
  /** Tasks to display */
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
  
  /** Customers data for reference */
  customers: Array<{
    id: string;
    name: string;
    company?: string;
    status: string;
  }>;
  
  /** Deals data for reference */
  deals: Array<{
    id: string;
    title: string;
    customerId: string;
  }>;
  
  /** Function to format date display */
  formatDate: (date: string | Date | undefined) => string;
  
  /** Function to create a new task */
  onCreateTask?: (task: Omit<TasksListProps['tasks'][0], 'id'>) => Promise<{ id: string }> | void;
  
  /** Function to update a task */
  onUpdateTask?: (taskId: string, data: Partial<TasksListProps['tasks'][0]>) => Promise<void> | void;
  
  /** Function to delete a task */
  onDeleteTask?: (taskId: string) => Promise<void> | void;
  
  /** Function to view a customer's details */
  onViewCustomer: (customerId: string) => void;
  
  /** Function to export tasks data */
  onExportData?: () => Promise<void> | void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * TasksList Component
 */
export const TasksList: React.FC<TasksListProps> = ({
  tasks,
  customers,
  deals,
  formatDate,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onViewCustomer,
  onExportData,
  className = '',
  style = {}
}) => {
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Status filter state
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Priority filter state
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  
  // Sort option state
  const [sortOption, setSortOption] = useState<string>('due-asc');
  
  // New task modal state
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'to-do' as const,
    priority: 'medium' as const,
    dueDate: '',
    relatedTo: {
      type: 'customer' as const,
      id: ''
    }
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status: string | null) => {
    setStatusFilter(status);
  };
  
  // Handle priority filter change
  const handlePriorityFilterChange = (priority: string | null) => {
    setPriorityFilter(priority);
  };
  
  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };
  
  // Handle new task form change
  const handleNewTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'relatedType') {
      setNewTask(prev => ({
        ...prev,
        relatedTo: {
          ...prev.relatedTo,
          type: value as 'customer' | 'deal',
          id: '' // Reset ID when type changes
        }
      }));
    } else if (name === 'relatedId') {
      setNewTask(prev => ({
        ...prev,
        relatedTo: {
          ...prev.relatedTo,
          id: value
        }
      }));
    } else {
      setNewTask(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle create task form submit
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateTask) return;
    
    // Check if relatedTo is complete, if not, remove it
    const taskToCreate = {
      ...newTask,
      relatedTo: newTask.relatedTo.id ? newTask.relatedTo : undefined
    };
    
    try {
      await onCreateTask(taskToCreate);
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'to-do',
        priority: 'medium',
        dueDate: '',
        relatedTo: {
          type: 'customer',
          id: ''
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
      const updateData: Partial<TasksListProps['tasks'][0]> = { 
        status,
        ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {})
      };
      
      await onUpdateTask(taskId, updateData);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  // Filter and sort tasks based on current selections
  const filteredTasks = tasks
    // Filter by status if a filter is selected
    .filter(task => !statusFilter || task.status === statusFilter)
    // Filter by priority if a filter is selected
    .filter(task => !priorityFilter || task.priority === priorityFilter)
    // Filter by search query
    .filter(task => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      const customer = task.relatedTo?.type === 'customer' && customers.find(c => c.id === task.relatedTo?.id);
      const deal = task.relatedTo?.type === 'deal' && deals.find(d => d.id === task.relatedTo?.id);
      
      return (
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (customer && customer.name.toLowerCase().includes(query)) ||
        (deal && deal.title.toLowerCase().includes(query))
      );
    })
    // Sort based on selected option
    .sort((a, b) => {
      switch (sortOption) {
        case 'due-asc':
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return aDate - bDate;
        case 'due-desc':
          const aDate2 = a.dueDate ? new Date(a.dueDate).getTime() : -Infinity;
          const bDate2 = b.dueDate ? new Date(b.dueDate).getTime() : -Infinity;
          return bDate2 - aDate2;
        case 'priority-high':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'priority-low':
          const priorityOrder2 = { high: 0, medium: 1, low: 2 };
          return priorityOrder2[b.priority] - priorityOrder2[a.priority];
        case 'status':
          const statusOrder = { 'to-do': 0, 'in-progress': 1, 'completed': 2, 'cancelled': 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  
  // Helper function to get status color
  const getStatusColor = (status: string): string => {
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
  
  // Helper function to get status label
  const getStatusLabel = (status: string): string => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Get related entity details
  const getRelatedEntityDetails = (task: TasksListProps['tasks'][0]) => {
    if (!task.relatedTo) return null;
    
    if (task.relatedTo.type === 'customer') {
      const customer = customers.find(c => c.id === task.relatedTo?.id);
      if (!customer) return null;
      
      return {
        type: 'Customer',
        name: customer.name,
        onClick: () => onViewCustomer(customer.id)
      };
    } else if (task.relatedTo.type === 'deal') {
      const deal = deals.find(d => d.id === task.relatedTo?.id);
      if (!deal) return null;
      
      const customer = customers.find(c => c.id === deal.customerId);
      
      return {
        type: 'Deal',
        name: deal.title,
        subtext: customer ? `(${customer.name})` : undefined,
        onClick: customer ? () => onViewCustomer(customer.id) : undefined
      };
    }
    
    return null;
  };
  
  return (
    <div className={`${className}`} style={style}>
      {/* Header with search and actions */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {onCreateTask && (
            <button
              onClick={() => setShowNewTaskModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Task
            </button>
          )}
          
          {onExportData && (
            <button
              onClick={onExportData}
              className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export
            </button>
          )}
        </div>
      </div>
      
      {/* Filters and sorting */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilterChange(null)}
              className={`px-3 py-1 text-sm rounded-full ${
                statusFilter === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All Status
            </button>
            
            {['to-do', 'in-progress', 'completed', 'cancelled'].map(status => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={`px-3 py-1 text-sm rounded-full ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : getStatusColor(status)
                }`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
          
          {/* Priority filters */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Priority:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => handlePriorityFilterChange(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  priorityFilter === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </button>
              
              {['high', 'medium', 'low'].map(priority => (
                <button
                  key={priority}
                  onClick={() => handlePriorityFilterChange(priority)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    priorityFilter === priority
                      ? 'bg-blue-600 text-white'
                      : `bg-gray-200 dark:bg-gray-700 ${getPriorityColor(priority)}`
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sort options */}
          <div className="flex items-center">
            <label htmlFor="sort" className="text-sm text-gray-600 dark:text-gray-300 mr-2 whitespace-nowrap">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={handleSortChange}
              className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="due-asc">Due Date (Earliest)</option>
              <option value="due-desc">Due Date (Latest)</option>
              <option value="priority-high">Priority (Highest)</option>
              <option value="priority-low">Priority (Lowest)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tasks list */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => {
              const isOverdue = task.status === 'to-do' && task.dueDate && new Date(task.dueDate) < new Date();
              const relatedEntity = getRelatedEntityDetails(task);
              
              return (
                <li key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="p-4">
                    <div className="flex items-start">
                      {/* Checkbox for completion */}
                      {onUpdateTask && (
                        <div className="flex-shrink-0 pt-1">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => handleUpdateTaskStatus(task.id, task.status === 'completed' ? 'to-do' : 'completed')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                          />
                        </div>
                      )}
                      
                      {/* Task details */}
                      <div className={`ml-3 flex-1 ${task.status === 'completed' || task.status === 'cancelled' ? 'opacity-60' : ''}`}>
                        <div className="flex justify-between">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </div>
                          <div className="flex space-x-2">
                            {onUpdateTask && task.status !== 'completed' && task.status !== 'cancelled' && (
                              <select
                                value={task.status}
                                onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as any)}
                                className={`text-xs rounded-full py-1 px-2 border-none ${getStatusColor(task.status)}`}
                              >
                                <option value="to-do">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            )}
                            
                            {(task.status === 'completed' || task.status === 'cancelled') && (
                              <span className={`text-xs rounded-full py-1 px-2 ${getStatusColor(task.status)}`}>
                                {getStatusLabel(task.status)}
                              </span>
                            )}
                            
                            <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {task.dueDate && (
                              <div className={`flex items-center text-xs ${
                                isOverdue 
                                  ? 'text-red-600 dark:text-red-400 font-medium' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {isOverdue ? 'Overdue: ' : 'Due: '}
                                {formatDate(task.dueDate)}
                              </div>
                            )}
                            
                            {relatedEntity && (
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <span className="mr-1">{relatedEntity.type}:</span>
                                <button 
                                  onClick={relatedEntity.onClick} 
                                  className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                  {relatedEntity.name}
                                </button>
                                {relatedEntity.subtext && (
                                  <span className="ml-1">{relatedEntity.subtext}</span>
                                )}
                              </div>
                            )}
                            
                            {task.completedAt && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Completed: {formatDate(task.completedAt)}
                              </div>
                            )}
                          </div>
                          
                          {onDeleteTask && (
                            <button
                              onClick={() => onDeleteTask(task.id)}
                              className="text-xs text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              No tasks found
            </li>
          )}
        </ul>
      </div>
      
      {/* New Task Modal */}
      {showNewTaskModal && (
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Related To
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select
                        id="relatedType"
                        name="relatedType"
                        value={newTask.relatedTo.type}
                        onChange={handleNewTaskChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="deal">Deal</option>
                      </select>
                    </div>
                    
                    <div>
                      <select
                        id="relatedId"
                        name="relatedId"
                        value={newTask.relatedTo.id}
                        onChange={handleNewTaskChange}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select {newTask.relatedTo.type === 'customer' ? 'a customer' : 'a deal'}</option>
                        {newTask.relatedTo.type === 'customer' ? (
                          customers.map(customer => (
                            <option key={customer.id} value={customer.id}>
                              {customer.name} {customer.company && `(${customer.company})`}
                            </option>
                          ))
                        ) : (
                          deals.map(deal => {
                            const customer = customers.find(c => c.id === deal.customerId);
                            return (
                              <option key={deal.id} value={deal.id}>
                                {deal.title} {customer && `(${customer.name})`}
                              </option>
                            );
                          })
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right space-x-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
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

export default TasksList;