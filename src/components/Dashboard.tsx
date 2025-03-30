import React, { useState, useEffect } from 'react';
import { Avatar } from './Avatar';

/**
 * @component Dashboard
 * @description Displays a comprehensive dashboard with key metrics, recent activities, and charts
 * @domain business, sales, management, crm
 * @usage Overview dashboard for CRM with visualizations and quick access to key data
 * 
 * @example
 * // Basic usage
 * <Dashboard 
 *   user={user}
 *   customers={customers}
 *   deals={deals}
 *   tasks={tasks}
 *   formatCurrency={formatCurrency}
 *   formatDate={formatDate}
 *   onViewCustomer={handleViewCustomer}
 * />
 * 
 * @example
 * // With analytics
 * <Dashboard 
 *   user={user}
 *   customers={customers}
 *   deals={deals}
 *   tasks={tasks}
 *   formatCurrency={formatCurrency}
 *   formatDate={formatDate}
 *   onViewCustomer={handleViewCustomer}
 *   onFetchAnalytics={fetchAnalyticsData}
 * />
 */
export interface DashboardProps {
  /** Current user information */
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  
  /** Customers in the CRM */
  customers: Array<{
    id: string;
    name: string;
    company?: string;
    email?: string;
    status: 'lead' | 'prospect' | 'customer' | 'churned';
    createdAt: string | Date;
    lastContactedAt?: string | Date;
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
  }>;
  
  /** Tasks in the CRM */
  tasks: Array<{
    id: string;
    title: string;
    description?: string;
    status: 'to-do' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string | Date;
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
  
  /** Function to handle viewing a customer's details */
  onViewCustomer: (customerId: string) => void;
  
  /** Function to fetch analytics data */
  onFetchAnalytics?: () => Promise<{
    revenueByMonth: Array<{ month: string; revenue: number }>;
    dealsByStage: Array<{ stage: string; count: number }>;
    customersByStatus: Array<{ status: string; count: number }>;
    topPerformers: Array<{ userId: string; name: string; dealsWon: number; revenue: number }>;
  }> | void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Dashboard Component
 */
export const Dashboard: React.FC<DashboardProps> = ({
  user,
  customers,
  deals,
  tasks,
  formatCurrency,
  formatDate,
  onViewCustomer,
  onFetchAnalytics,
  className = '',
  style = {}
}) => {
  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState<{
    revenueByMonth: Array<{ month: string; revenue: number }>;
    dealsByStage: Array<{ stage: string; count: number }>;
    customersByStatus: Array<{ status: string; count: number }>;
    topPerformers: Array<{ userId: string; name: string; dealsWon: number; revenue: number }>;
  } | null>(null);
  
  // Loading state for analytics
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  
  // Calculate summary metrics
  const totalCustomers = customers.length;
  const activeDeals = deals.filter(d => !['closed-won', 'closed-lost'].includes(d.stage)).length;
  const wonDeals = deals.filter(d => d.stage === 'closed-won').length;
  const totalRevenue = deals
    .filter(d => d.stage === 'closed-won')
    .reduce((sum, deal) => sum + deal.value, 0);
  
  const overdueCount = tasks.filter(task => 
    task.status === 'to-do' && 
    task.dueDate && 
    new Date(task.dueDate) < new Date() &&
    (task.assignedTo === user.id || !task.assignedTo)
  ).length;
  
  // Get recent activities by combining recent customers, deals, and completed tasks
  const recentActivities = [
    ...customers.slice(0, 5).map(customer => ({
      id: `customer-${customer.id}`,
      type: 'customer' as const,
      title: `New customer: ${customer.name}`,
      date: new Date(customer.createdAt),
      customer
    })),
    ...deals.slice(0, 5).map(deal => ({
      id: `deal-${deal.id}`,
      type: 'deal' as const,
      title: `New deal: ${deal.title}`,
      date: new Date(deal.startDate),
      deal,
      customer: customers.find(c => c.id === deal.customerId)
    })),
    ...tasks
      .filter(task => task.status === 'completed')
      .slice(0, 5)
      .map(task => ({
        id: `task-${task.id}`,
        type: 'task' as const,
        title: `Completed task: ${task.title}`,
        date: new Date(), // Use current date as completed date if not available
        task,
        customer: task.relatedTo?.type === 'customer' 
          ? customers.find(c => c.id === task.relatedTo?.id) 
          : undefined
      }))
  ]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 5);
  
  // Get upcoming tasks
  const upcomingTasks = tasks
    .filter(task => 
      task.status === 'to-do' && 
      task.dueDate && 
      (task.assignedTo === user.id || !task.assignedTo)
    )
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    })
    .slice(0, 5);
  
  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      if (onFetchAnalytics) {
        setIsLoadingAnalytics(true);
        try {
          const data = await onFetchAnalytics();
          if (data) {
            setAnalyticsData(data);
          }
        } catch (error) {
          console.error('Error fetching analytics:', error);
        } finally {
          setIsLoadingAnalytics(false);
        }
      }
    };
    
    fetchAnalytics();
  }, [onFetchAnalytics]);
  
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
  
  return (
    <div className={`space-y-6 ${className}`} style={style}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Total Customers</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalCustomers}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Deals Won</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{wonDeals}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${
              overdueCount > 0 
                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' 
                : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
            } mr-4`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-gray-500 dark:text-gray-400 text-sm">Overdue Tasks</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{overdueCount}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h2>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {recentActivities.map(activity => (
                <li key={activity.id} className="flex space-x-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'customer' 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                      : activity.type === 'deal'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                        : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                  }`}>
                    {activity.type === 'customer' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {activity.type === 'deal' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    {activity.type === 'task' && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.customer && (
                        <button 
                          className="hover:underline"
                          onClick={() => onViewCustomer(activity.customer.id)}
                        >
                          {activity.customer.name}
                          {activity.customer.company && ` (${activity.customer.company})`}
                        </button>
                      )}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(activity.date)}
                  </div>
                </li>
              ))}
              
              {recentActivities.length === 0 && (
                <li className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No recent activities to display
                </li>
              )}
            </ul>
          </div>
        </div>
        
        {/* Upcoming Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Tasks</h2>
          </div>
          <div className="p-4">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingTasks.map(task => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
                
                return (
                  <li key={task.id} className="py-3">
                    <div className="flex items-start">
                      <div className="mr-3 pt-1">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-1 flex items-center space-x-2">
                          <span className={`inline-flex items-center text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                          {task.dueDate && (
                            <span className={`inline-flex items-center text-xs font-medium ${
                              isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {isOverdue ? 'Overdue: ' : 'Due: '}
                              {formatDate(task.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
              
              {upcomingTasks.length === 0 && (
                <li className="text-center py-4 text-gray-500 dark:text-gray-400">
                  No upcoming tasks
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Analytics Charts (placeholder) */}
      {onFetchAnalytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Revenue Trend</h2>
            </div>
            <div className="p-6 h-64 flex items-center justify-center">
              {isLoadingAnalytics ? (
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
              ) : analyticsData?.revenueByMonth ? (
                <div className="w-full h-full">
                  {/* Revenue chart would go here */}
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    Chart would display revenue trend across {analyticsData.revenueByMonth.length} months
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">No revenue data available</div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Deal Pipeline</h2>
            </div>
            <div className="p-6 h-64 flex items-center justify-center">
              {isLoadingAnalytics ? (
                <div className="text-gray-500 dark:text-gray-400">Loading...</div>
              ) : analyticsData?.dealsByStage ? (
                <div className="w-full h-full">
                  {/* Deal pipeline chart would go here */}
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    Chart would display deals across {analyticsData.dealsByStage.length} pipeline stages
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">No pipeline data available</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* New Customers Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Customers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
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
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {customers
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map(customer => (
                  <tr key={customer.id}>
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
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {customer.company || customer.email}
                          </div>
                        </div>
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
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;