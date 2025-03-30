import React, { useState, useEffect, useRef } from 'react';

/**
 * @component SearchBar
 * @description A flexible search input component with configurable appearance and behavior
 * @domain common, input, search
 * @usage Implement consistent search functionality across applications
 * 
 * @example
 * // Basic usage
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   onSearch={handleSearch}
 * />
 * 
 * @example
 * // With instant search and placeholder
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Search products..."
 *   instantSearch
 * />
 * 
 * @example
 * // With filter button
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   onSearch={handleSearch}
 *   showFilterButton
 *   onFilterClick={handleShowFilters}
 * />
 */
export interface SearchBarProps {
  /** Current search value */
  value: string;
  
  /** Change handler for the search input */
  onChange: (value: string) => void;
  
  /** Function to call when search is submitted */
  onSearch?: (value: string) => void;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether to trigger search on each keystroke */
  instantSearch?: boolean;
  
  /** Delay in milliseconds for debouncing instant search */
  debounceTime?: number;
  
  /** Whether to show a clear button */
  showClearButton?: boolean;
  
  /** Whether to show a filter button */
  showFilterButton?: boolean;
  
  /** Click handler for the filter button */
  onFilterClick?: () => void;
  
  /** Size of the search bar */
  size?: 'sm' | 'md' | 'lg';
  
  /** Appearance variant */
  variant?: 'default' | 'outline' | 'filled';
  
  /** Shape of the input */
  rounded?: 'default' | 'full' | 'none';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
  
  /** Form submission handler */
  onSubmit?: (e: React.FormEvent) => void;
}

/**
 * SearchBar Component
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  instantSearch = false,
  debounceTime = 300,
  showClearButton = true,
  showFilterButton = false,
  onFilterClick,
  size = 'md',
  variant = 'default',
  rounded = 'default',
  className = '',
  style = {},
  onSubmit
}) => {
  // Ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounce timer for instant search
  const timerRef = useRef<NodeJS.Timeout>();
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // If instant search is enabled, debounce the search
    if (instantSearch && onSearch) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      timerRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceTime);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
    if (onSubmit) {
      onSubmit(e);
    }
  };
  
  // Handle clear button click
  const handleClear = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (instantSearch && onSearch) {
      onSearch('');
    }
  };
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  // Determine size classes
  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return 'h-8 text-xs';
      case 'lg':
        return 'h-12 text-base';
      case 'md':
      default:
        return 'h-10 text-sm';
    }
  })();
  
  // Determine variant classes
  const variantClasses = (() => {
    switch (variant) {
      case 'outline':
        return 'bg-transparent border border-gray-300 dark:border-gray-600';
      case 'filled':
        return 'bg-gray-100 dark:bg-gray-700 border border-transparent';
      case 'default':
      default:
        return 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600';
    }
  })();
  
  // Determine rounded classes
  const roundedClasses = (() => {
    switch (rounded) {
      case 'full':
        return 'rounded-full';
      case 'none':
        return 'rounded-none';
      case 'default':
      default:
        return 'rounded-lg';
    }
  })();
  
  // Calculate padding based on presence of buttons
  const paddingClasses = `pl-10 ${showClearButton || showFilterButton ? 'pr-10' : 'pr-4'}`;
  
  // Combine all classes
  const inputClasses = `w-full ${sizeClasses} ${variantClasses} ${roundedClasses} ${paddingClasses} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white`;
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative ${className}`} 
      style={style}
    >
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg 
          className="h-5 w-5 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
      </div>
      
      {/* Input field */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClasses}
        aria-label="Search"
      />
      
      {/* Clear button */}
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Clear search"
        >
          <svg 
            className="h-5 w-5 text-gray-400 hover:text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      )}
      
      {/* Filter button */}
      {showFilterButton && !value && (
        <button
          type="button"
          onClick={onFilterClick}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label="Show filters"
        >
          <svg 
            className="h-5 w-5 text-gray-400 hover:text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
            />
          </svg>
        </button>
      )}
    </form>
  );
};

export default SearchBar;