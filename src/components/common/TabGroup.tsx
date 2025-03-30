import React, { ReactNode } from 'react';

/**
 * @component TabGroup
 * @description A flexible tabbed interface component with various styles and layouts
 * @domain common, navigation, tabs
 * @usage Create consistent tabbed interfaces across applications
 * 
 * @example
 * // Basic usage
 * <TabGroup
 *   tabs={[
 *     { id: 'tab1', label: 'Tab 1' },
 *     { id: 'tab2', label: 'Tab 2' },
 *   ]}
 *   activeTab="tab1"
 *   onChange={setActiveTab}
 * />
 * 
 * @example
 * // With icons and badges
 * <TabGroup
 *   tabs={[
 *     { id: 'tab1', label: 'Messages', icon: <MessageIcon />, badge: 5 },
 *     { id: 'tab2', label: 'Notifications', icon: <BellIcon />, badge: 2 },
 *   ]}
 *   activeTab="tab1"
 *   onChange={setActiveTab}
 *   variant="pills"
 * />
 * 
 * @example
 * // With tab content
 * <TabGroup
 *   tabs={[
 *     { id: 'tab1', label: 'Details' },
 *     { id: 'tab2', label: 'Reviews' },
 *   ]}
 *   activeTab={activeTab}
 *   onChange={setActiveTab}
 *   renderContent={(tabId) => (
 *     tabId === 'tab1' ? <DetailsContent /> : <ReviewsContent />
 *   )}
 * />
 */

export interface Tab {
  /** Unique tab identifier */
  id: string;
  
  /** Tab display label */
  label: ReactNode;
  
  /** Optional icon */
  icon?: ReactNode;
  
  /** Optional badge count */
  badge?: number;
  
  /** Whether tab is disabled */
  disabled?: boolean;
}

export interface TabGroupProps {
  /** Array of tab definitions */
  tabs: Tab[];
  
  /** ID of the currently active tab */
  activeTab: string;
  
  /** Change handler when a tab is selected */
  onChange: (tabId: string) => void;
  
  /** Optional render function for tab content */
  renderContent?: (tabId: string) => ReactNode;
  
  /** Orientation of the tabs */
  orientation?: 'horizontal' | 'vertical';
  
  /** Visual style of the tabs */
  variant?: 'underline' | 'pills' | 'buttons' | 'bordered';
  
  /** Size of the tabs */
  size?: 'sm' | 'md' | 'lg';
  
  /** Whether to stretch tabs to full width */
  fullWidth?: boolean;
  
  /** Whether to center tabs */
  centered?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional CSS classes for the tab buttons */
  tabClassName?: string;
  
  /** Additional CSS classes for the content area */
  contentClassName?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
  
  /** Additional inline styles for the tab buttons */
  tabStyle?: React.CSSProperties;
  
  /** Additional inline styles for the content area */
  contentStyle?: React.CSSProperties;
}

/**
 * TabGroup Component
 */
export const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  activeTab,
  onChange,
  renderContent,
  orientation = 'horizontal',
  variant = 'underline',
  size = 'md',
  fullWidth = false,
  centered = false,
  className = '',
  tabClassName = '',
  contentClassName = '',
  style = {},
  tabStyle = {},
  contentStyle = {}
}) => {
  // Get base container classes based on orientation
  const containerClasses = orientation === 'horizontal'
    ? 'flex flex-col'
    : 'flex flex-row';
  
  // Get tab list classes based on orientation and layout options
  const tabListClasses = (() => {
    const orientationClasses = orientation === 'horizontal'
      ? 'flex flex-row overflow-x-auto'
      : 'flex flex-col';
    
    const layoutClasses = [];
    
    if (orientation === 'horizontal') {
      if (fullWidth) {
        layoutClasses.push('w-full');
      }
      
      if (centered) {
        layoutClasses.push('justify-center');
      }
    }
    
    return [orientationClasses, ...layoutClasses].join(' ');
  })();
  
  // Get individual tab classes based on variant, size, and active state
  const getTabClasses = (isActive: boolean, isDisabled: boolean) => {
    // Base classes for all tabs
    const baseClasses = 'flex items-center focus:outline-none transition-colors duration-200';
    
    // Size classes
    const sizeClasses = (() => {
      switch (size) {
        case 'sm':
          return 'px-2 py-1 text-xs';
        case 'lg':
          return 'px-4 py-3 text-base';
        case 'md':
        default:
          return 'px-3 py-2 text-sm';
      }
    })();
    
    // Variant and state classes
    const variantClasses = (() => {
      const tabClasses = [];
      
      if (isDisabled) {
        tabClasses.push('opacity-50 cursor-not-allowed');
      } else {
        tabClasses.push('cursor-pointer');
      }
      
      switch (variant) {
        case 'pills':
          tabClasses.push('rounded-full');
          if (isActive) {
            tabClasses.push('bg-blue-600 text-white');
          } else {
            tabClasses.push('text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700');
          }
          break;
          
        case 'buttons':
          tabClasses.push('rounded-md border');
          if (isActive) {
            tabClasses.push('bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700');
          } else {
            tabClasses.push('bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700');
          }
          break;
          
        case 'bordered':
          tabClasses.push('border-t border-l border-r rounded-t-md -mb-px');
          if (isActive) {
            tabClasses.push('border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400');
          } else {
            tabClasses.push('border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200');
          }
          break;
          
        case 'underline':
        default:
          if (isActive) {
            tabClasses.push('text-blue-700 dark:text-blue-400 border-b-2 border-blue-500 dark:border-blue-400 font-medium');
          } else {
            tabClasses.push('text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 border-b-2 border-transparent');
          }
          break;
      }
      
      return tabClasses.join(' ');
    })();
    
    // Combine all classes
    return [baseClasses, sizeClasses, variantClasses, tabClassName].filter(Boolean).join(' ');
  };
  
  // Border class for the tabs container
  const borderClass = variant === 'underline'
    ? 'border-b border-gray-200 dark:border-gray-700'
    : '';
  
  return (
    <div className={`${containerClasses} ${className}`} style={style}>
      {/* Tab list */}
      <div className={`${tabListClasses} ${borderClass}`} role="tablist">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const isDisabled = !!tab.disabled;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              disabled={isDisabled}
              onClick={() => !isDisabled && onChange(tab.id)}
              className={getTabClasses(isActive, isDisabled)}
              style={tabStyle}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      
      {/* Content area if renderContent is provided */}
      {renderContent && (
        <div 
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          id={`panel-${activeTab}`}
          className={`mt-4 ${contentClassName}`}
          style={contentStyle}
        >
          {renderContent(activeTab)}
        </div>
      )}
    </div>
  );
};

export default TabGroup;