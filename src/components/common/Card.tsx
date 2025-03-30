import React, { ReactNode } from 'react';

/**
 * @component Card
 * @description A flexible card component with optional header, footer, and various styling options
 * @domain common, layout, container
 * @usage Container for grouped content with consistent styling across applications
 * 
 * @example
 * // Basic usage
 * <Card>
 *   <p>Card content</p>
 * </Card>
 * 
 * @example
 * // With header and footer
 * <Card
 *   header={<h3>Card Title</h3>}
 *   footer={<Button>Action</Button>}
 * >
 *   <p>Card content</p>
 * </Card>
 * 
 * @example
 * // With custom styling
 * <Card
 *   variant="outline"
 *   padding="lg"
 *   className="my-custom-class"
 * >
 *   <p>Card content</p>
 * </Card>
 */
export interface CardProps {
  /** Card content */
  children: ReactNode;
  
  /** Optional card header */
  header?: ReactNode;
  
  /** Optional card footer */
  footer?: ReactNode;
  
  /** Card variant */
  variant?: 'default' | 'outline' | 'flat';
  
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  
  /** Whether to add hover effect */
  hoverable?: boolean;
  
  /** Whether the card is selected */
  selected?: boolean;
  
  /** Whether the card contains an interactive element */
  interactive?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
  
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * Card Component
 */
export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  selected = false,
  interactive = false,
  className = '',
  style = {},
  onClick
}) => {
  // Determine base styles based on variant
  const baseStyles = (() => {
    switch (variant) {
      case 'outline':
        return 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
      case 'flat':
        return 'bg-gray-50 dark:bg-gray-800';
      case 'default':
      default:
        return 'bg-white dark:bg-gray-800 shadow';
    }
  })();
  
  // Determine padding based on size
  const paddingStyles = (() => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return header || footer ? '' : 'p-2';
      case 'lg':
        return header || footer ? '' : 'p-6';
      case 'md':
      default:
        return header || footer ? '' : 'p-4';
    }
  })();
  
  // Additional styles
  const additionalStyles = [
    'rounded-lg',
    hoverable ? 'transition hover:shadow-md hover:-translate-y-1' : '',
    selected ? 'ring-2 ring-blue-500 dark:ring-blue-400' : '',
    interactive ? 'cursor-pointer' : '',
    onClick ? 'cursor-pointer' : ''
  ].filter(Boolean).join(' ');
  
  // Header padding
  const headerPadding = (() => {
    switch (padding) {
      case 'none':
        return 'px-0 py-0';
      case 'sm':
        return 'px-2 py-2';
      case 'lg':
        return 'px-6 py-4';
      case 'md':
      default:
        return 'px-4 py-3';
    }
  })();
  
  // Body padding
  const bodyPadding = (() => {
    if (padding === 'none') return '';
    
    if (header && footer) {
      switch (padding) {
        case 'sm':
          return 'px-2 py-2';
        case 'lg':
          return 'px-6 py-6';
        case 'md':
        default:
          return 'px-4 py-4';
      }
    } else if (header || footer) {
      switch (padding) {
        case 'sm':
          return 'px-2 py-2';
        case 'lg':
          return 'px-6 py-6';
        case 'md':
        default:
          return 'px-4 py-4';
      }
    } else {
      return '';
    }
  })();
  
  // Footer padding
  const footerPadding = (() => {
    switch (padding) {
      case 'none':
        return 'px-0 py-0';
      case 'sm':
        return 'px-2 py-2';
      case 'lg':
        return 'px-6 py-4';
      case 'md':
      default:
        return 'px-4 py-3';
    }
  })();
  
  return (
    <div 
      className={`${baseStyles} ${paddingStyles} ${additionalStyles} ${className}`}
      style={style}
      onClick={onClick}
    >
      {header && (
        <div className={`${headerPadding} border-b border-gray-200 dark:border-gray-700 font-medium`}>
          {header}
        </div>
      )}
      
      {(header || footer) ? (
        <div className={bodyPadding}>
          {children}
        </div>
      ) : children}
      
      {footer && (
        <div className={`${footerPadding} border-t border-gray-200 dark:border-gray-700`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;