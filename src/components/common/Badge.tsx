import React, { ReactNode } from 'react';

/**
 * @component Badge
 * @description A flexible badge component for status indicators, labels, and counts
 * @domain common, display, indicator
 * @usage Display status, categories, counts, or labels consistently across applications
 * 
 * @example
 * // Basic usage with predefined variant
 * <Badge variant="success">Completed</Badge>
 * 
 * @example
 * // Custom color with dot indicator
 * <Badge color="indigo" showDot>Custom Status</Badge>
 * 
 * @example
 * // Numeric badge
 * <Badge variant="danger" rounded="full">5</Badge>
 */
export interface BadgeProps {
  /** Badge content */
  children: ReactNode;
  
  /** Predefined color variants */
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'primary' | 'secondary' | 'neutral';
  
  /** Custom color (overrides variant) */
  color?: string;
  
  /** Size of the badge */
  size?: 'sm' | 'md' | 'lg';
  
  /** Shape of the badge corners */
  rounded?: 'default' | 'full' | 'none';
  
  /** Whether to show status dot indicator */
  showDot?: boolean;
  
  /** Whether the badge is outlined instead of filled */
  outlined?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
  
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Badge Component
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  color,
  size = 'md',
  rounded = 'default',
  showDot = false,
  outlined = false,
  className = '',
  style = {},
  onClick
}) => {
  // Define color styles based on variant
  const getColorStyles = () => {
    if (color) {
      // Use custom color if provided
      return outlined
        ? `border border-${color}-500 text-${color}-700 dark:text-${color}-400 bg-transparent`
        : `bg-${color}-100 text-${color}-800 dark:bg-${color}-800 dark:text-${color}-100`;
    }
    
    // Use predefined variants
    switch (variant) {
      case 'info':
        return outlined
          ? 'border border-blue-500 text-blue-700 dark:text-blue-400 bg-transparent'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'success':
        return outlined
          ? 'border border-green-500 text-green-700 dark:text-green-400 bg-transparent'
          : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'warning':
        return outlined
          ? 'border border-yellow-500 text-yellow-700 dark:text-yellow-400 bg-transparent'
          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'danger':
        return outlined
          ? 'border border-red-500 text-red-700 dark:text-red-400 bg-transparent'
          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      case 'primary':
        return outlined
          ? 'border border-blue-500 text-blue-700 dark:text-blue-400 bg-transparent'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'secondary':
        return outlined
          ? 'border border-purple-500 text-purple-700 dark:text-purple-400 bg-transparent'
          : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'neutral':
      default:
        return outlined
          ? 'border border-gray-500 text-gray-700 dark:text-gray-400 bg-transparent'
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };
  
  // Size classes
  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return 'text-xs px-1.5 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1.5';
      case 'md':
      default:
        return 'text-xs px-2.5 py-1';
    }
  })();
  
  // Rounded classes
  const roundedClasses = (() => {
    switch (rounded) {
      case 'full':
        return 'rounded-full';
      case 'none':
        return '';
      case 'default':
      default:
        return 'rounded';
    }
  })();
  
  // Status dot styles
  const dotStyles = showDot 
    ? 'flex items-center' 
    : '';
  
  // Create variant-based background color for the dot
  const getDotColor = () => {
    if (color) {
      return `bg-${color}-500`;
    }
    
    switch (variant) {
      case 'info':
        return 'bg-blue-500';
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      case 'primary':
        return 'bg-blue-500';
      case 'secondary':
        return 'bg-purple-500';
      case 'neutral':
      default:
        return 'bg-gray-500';
    }
  };
  
  // Combine all classes
  const badgeClasses = `inline-flex font-medium ${getColorStyles()} ${sizeClasses} ${roundedClasses} ${dotStyles} ${onClick ? 'cursor-pointer' : ''} ${className}`;
  
  return (
    <span className={badgeClasses} style={style} onClick={onClick}>
      {showDot && (
        <span className={`w-1.5 h-1.5 ${getDotColor()} rounded-full mr-1.5`} />
      )}
      {children}
    </span>
  );
};

export default Badge;