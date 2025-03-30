import React, { useState } from 'react';

/**
 * @component DealsList
 * @description Displays a list of deals with filtering, sorting, and kanban board views
 * @domain business, sales, management, crm
 * @usage View, filter, and manage deals in a CRM system
 * 
 * @example
 * // Basic usage
 * <DealsList 
 *   deals={deals}
 *   customers={customers}
 *   formatCurrency={formatCurrency}
 *   formatDate={formatDate}
 *   onCreateDeal={handleCreateDeal}
 *   onUpdateDeal={handleUpdateDeal}
 *   onViewCustomer={handleViewCustomer}
 * />
 * 
 * @example
 * // With all handlers
 * <DealsList 
 *   deals={deals}
 *   customers={customers}
 *   formatCurrency={formatCurrency}
 *   formatDate={formatDate}
 *   onCreateDeal={handleCreateDeal}
 *   onUpdateDeal={handleUpdateDeal}
 *   onDeleteDeal={handleDeleteDeal}
 *   onViewCustomer={handleViewCustomer}
 *   onExportData={handleExportData}
 * />
 */
export interface DealsListProps {
  /** Deals to display */
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
  }>;
  
  /** Customers data for reference */
  customers: Array<{
    id: string;
    name: string;
    company?: string;
    email?: string;
    status: string;
    avatar?: string;
  }>;
  
  /** Function to format currency display */
  formatCurrency: (amount: number, currency?: string) => string;
  
  /** Function to format date display */
  formatDate: (date: string | Date | undefined) => string;
  
  /** Function to create a new deal */
  onCreateDeal?: (deal: Omit<DealsListProps['deals'][0], 'id'>) => Promise<{ id: string }> | void;
  
  /** Function to update a deal */
  onUpdateDeal?: (dealId: string, data: Partial<DealsListProps['deals'][0]>) => Promise<void> | void;
  
  /** Function to delete a deal */
  onDeleteDeal?: (dealId: string) => Promise<void> | void;
  
  /** Function to view a customer's details */
  onViewCustomer: (customerId: string) => void;
  
  /** Function to export deals data */
  onExportData?: () => Promise<void> | void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * DealsList Component
 */
export const DealsList: React.FC<DealsListProps> = ({
  deals,
  customers,
  formatCurrency,
  formatDate,
  onCreateDeal,
  onUpdateDeal,
  onDeleteDeal,
  onViewCustomer,
  onExportData,
  className = '',
  style = {}
}) => {
  // View type state (list or board)
  const [viewType, setViewType] = useState<'list' | 'board'>('list');
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stage filter state
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  
  // Sort option state
  const [sortOption, setSortOption] = useState<string>('value-desc');
  
  // New deal modal state
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  
  // New deal form state
  const [newDeal, setNewDeal] = useState({
    title: '',
    customerId: '',
    value: 0,
    currency: 'USD',
    stage: 'prospecting' as const,
    priority: 'medium' as const,
    startDate: new Date().toISOString().split('T')[0],
    expectedCloseDate: ''
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle stage filter change
  const handleStageFilterChange = (stage: string | null) => {
    setStageFilter(stage);
  };
  
  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
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
      setShowNewDealModal(false);
      setNewDeal({
        title: '',
        customerId: '',
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
  
  // Handle updating deal stage
  const handleUpdateDealStage = async (dealId: string, stage: DealsListProps['deals'][0]['stage']) => {
    if (!onUpdateDeal) return;
    
    try {
      await onUpdateDeal(dealId, { 
        stage,
        ...(stage === 'closed-won' || stage === 'closed-lost' ? { closedDate: new Date().toISOString() } : {})
      });
    } catch (error) {
      console.error('Error updating deal stage:', error);
    }
  };
  
  // Filter and sort deals based on current selections
  const filteredDeals = deals
    // Filter by stage if a filter is selected
    .filter(deal => !stageFilter || deal.stage === stageFilter)
    // Filter by search query
    .filter(deal => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      const customer = customers.find(c => c.id === deal.customerId);
      
      return (
        deal.title.toLowerCase().includes(query) ||
        (customer && (
          customer.name.toLowerCase().includes(query) ||
          (customer.company && customer.company.toLowerCase().includes(query))
        ))
      );
    })
    // Sort based on selected option
    .sort((a, b) => {
      switch (sortOption) {
        case 'value-desc':
          return b.value - a.value;
        case 'value-asc':
          return a.value - b.value;
        case 'date-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'date-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'closing-soon':
          const aDate = a.expectedCloseDate ? new Date(a.expectedCloseDate).getTime() : Infinity;
          const bDate = b.expectedCloseDate ? new Date(b.expectedCloseDate).getTime() : Infinity;
          return aDate - bDate;
        default:
          return 0;
      }
    });
  
  // Group deals by stage for board view
  const dealsByStage = [
    'prospecting',
    'qualification',
    'proposal',
    'negotiation',
    'closed-won',
    'closed-lost'
  ].reduce((acc, stage) => {
    acc[stage] = filteredDeals.filter(deal => deal.stage === stage);
    return acc;
  }, {} as Record<string, typeof filteredDeals>);
  
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
  
  // Helper function to get stage label
  const getStageLabel = (stage: string): string => {
    return stage.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Calculate total by stage
  const totalByStage = Object.entries(dealsByStage).reduce((acc, [stage, stageDeals]) => {
    acc[stage] = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div className={`${className}`} style={style}>
      {/* Header with search, view type toggle, and actions */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search deals..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewType('list')}
              className={`px-3 py-1 rounded-md ${
                viewType === 'list'
                  ? 'bg-white dark:bg-gray-600 shadow'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewType('board')}
              className={`px-3 py-1 rounded-md ${
                viewType === 'board'
                  ? 'bg-white dark:bg-gray-600 shadow'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {onCreateDeal && (
            <button
              onClick={() => setShowNewDealModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Deal
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
          {/* Stage filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStageFilterChange(null)}
              className={`px-3 py-1 text-sm rounded-full ${
                stageFilter === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
            >
              All Stages
            </button>
            
            {[
              'prospecting',
              'qualification',
              'proposal',
              'negotiation',
              'closed-won',
              'closed-lost'
            ].map(stage => (
              <button
                key={stage}
                onClick={() => handleStageFilterChange(stage)}
                className={`px-3 py-1 text-sm rounded-full ${
                  stageFilter === stage
                    ? 'bg-blue-600 text-white'
                    : getStageColor(stage)
                }`}
              >
                {getStageLabel(stage)}
              </button>
            ))}
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
              <option value="value-desc">Highest Value</option>
              <option value="value-asc">Lowest Value</option>
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
              <option value="closing-soon">Closing Soon</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* List view */}
      {viewType === 'list' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Deal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stage
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
                {filteredDeals.length > 0 ? (
                  filteredDeals.map(deal => {
                    const customer = customers.find(c => c.id === deal.customerId);
                    
                    return (
                      <tr key={deal.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {deal.title}
                          </div>
                          {deal.priority && (
                            <div className={`text-xs ${getPriorityColor(deal.priority)}`}>
                              {deal.priority.charAt(0).toUpperCase() + deal.priority.slice(1)} Priority
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer ? (
                            <button
                              onClick={() => onViewCustomer(customer.id)}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {customer.name}
                              {customer.company && (
                                <span className="text-gray-500 dark:text-gray-400"> ({customer.company})</span>
                              )}
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500 dark:text-gray-400">Unknown</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(deal.value, deal.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {onUpdateDeal ? (
                            <select
                              value={deal.stage}
                              onChange={(e) => handleUpdateDealStage(deal.id, e.target.value as any)}
                              className={`text-xs rounded-full py-1 px-2 border-none ${getStageColor(deal.stage)}`}
                            >
                              {[
                                'prospecting',
                                'qualification',
                                'proposal',
                                'negotiation',
                                'closed-won',
                                'closed-lost'
                              ].map(stage => (
                                <option key={stage} value={stage}>
                                  {getStageLabel(stage)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                              {getStageLabel(deal.stage)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {deal.expectedCloseDate ? formatDate(deal.expectedCloseDate) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                    );
                  })
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
      
      {/* Board view */}
      {viewType === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto max-w-full">
          {Object.entries(dealsByStage).map(([stage, stageDeals]) => (
            <div key={stage} className="min-w-[250px]">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <h3 className={`text-sm font-medium ${getStageColor(stage)}`}>
                      {getStageLabel(stage)}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {formatCurrency(totalByStage[stage] || 0)}
                    </span>
                  </div>
                </div>
                
                <div className="p-2">
                  {stageDeals.length > 0 ? (
                    <div className="space-y-2">
                      {stageDeals.map(deal => {
                        const customer = customers.find(c => c.id === deal.customerId);
                        
                        return (
                          <div key={deal.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                            <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              {deal.title}
                            </div>
                            
                            {customer && (
                              <button
                                onClick={() => onViewCustomer(customer.id)}
                                className="block text-xs text-blue-600 dark:text-blue-400 hover:underline mb-2"
                              >
                                {customer.name}
                              </button>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-900 dark:text-white">
                                {formatCurrency(deal.value, deal.currency)}
                              </span>
                              
                              {deal.priority && (
                                <span className={`text-xs ${getPriorityColor(deal.priority)}`}>
                                  {deal.priority.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            
                            {deal.expectedCloseDate && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Due: {formatDate(deal.expectedCloseDate)}
                              </div>
                            )}
                            
                            {onUpdateDeal && (
                              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                                <div className="flex space-x-1">
                                  {stage !== 'prospecting' && (
                                    <button
                                      onClick={() => {
                                        const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
                                        const currentIndex = stages.indexOf(stage as any);
                                        const prevStage = stages[currentIndex - 1];
                                        handleUpdateDealStage(deal.id, prevStage as any);
                                      }}
                                      className="text-xs text-gray-600 dark:text-gray-400"
                                    >
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                      </svg>
                                    </button>
                                  )}
                                  
                                  {stage !== 'closed-lost' && stage !== 'closed-won' && (
                                    <button
                                      onClick={() => {
                                        const stages = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed-won', 'closed-lost'];
                                        const currentIndex = stages.indexOf(stage as any);
                                        const nextStage = stages[currentIndex + 1];
                                        handleUpdateDealStage(deal.id, nextStage as any);
                                      }}
                                      className="text-xs text-gray-600 dark:text-gray-400"
                                    >
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                                
                                {onDeleteDeal && (
                                  <button
                                    onClick={() => onDeleteDeal(deal.id)}
                                    className="text-xs text-red-600 dark:text-red-400"
                                  >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* New Deal Modal */}
      {showNewDealModal && (
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
                
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer *
                  </label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={newDeal.customerId}
                    onChange={handleNewDealChange}
                    required
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="" disabled>Select a customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.company && `(${customer.company})`}
                      </option>
                    ))}
                  </select>
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
                  onClick={() => setShowNewDealModal(false)}
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
    </div>
  );
};

export default DealsList;