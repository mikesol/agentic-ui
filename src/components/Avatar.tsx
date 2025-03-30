import React from 'react';

/**
 * @component Avatar
 * @description Displays a user avatar with optional status indicator
 * @domain common, user, profile, communication
 * @usage Display user avatars with customizable appearance and optional status indicators
 * 
 * @example
 * // Basic usage
 * <Avatar
 *   name="John Doe"
 *   src="https://example.com/avatar.jpg"
 * />
 * 
 * @example
 * // With status indicator and custom size
 * <Avatar
 *   name="Jane Smith"
 *   src="https://example.com/jane.jpg"
 *   status="online"
 *   size="lg"
 *   showStatusIndicator={true}
 * />
 */
export interface AvatarProps {
  /** User name (used for fallback and alt text) */
  name: string;
  
  /** Image source URL */
  src?: string;
  
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  
  /** User status */
  status?: 'online' | 'offline' | 'away' | 'busy' | 'invisible' | string;
  
  /** Whether to show status indicator */
  showStatusIndicator?: boolean;
  
  /** Status indicator position */
  statusIndicatorPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  
  /** Shape of the avatar */
  shape?: 'circle' | 'square' | 'rounded';
  
  /** Custom text color for fallback */
  textColor?: string;
  
  /** Custom background color for fallback */
  backgroundColor?: string;
  
  /** Custom status colors by status */
  statusColors?: Record<string, string>;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
  
  /** Click handler */
  onClick?: () => void;
}

/**
 * Avatar Component
 */
export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  status,
  showStatusIndicator = false,
  statusIndicatorPosition = 'bottom-right',
  shape = 'circle',
  textColor,
  backgroundColor,
  statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    invisible: 'bg-gray-300'
  },
  className = '',
  style = {},
  onClick
}) => {
  // Extract initials from name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  // Determine size classes
  const sizeClasses = {
    xs: {
      container: 'w-6 h-6',
      text: 'text-xs',
      indicator: 'w-1.5 h-1.5'
    },
    sm: {
      container: 'w-8 h-8',
      text: 'text-sm',
      indicator: 'w-2 h-2'
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-base',
      indicator: 'w-2.5 h-2.5'
    },
    lg: {
      container: 'w-12 h-12',
      text: 'text-lg',
      indicator: 'w-3 h-3'
    },
    xl: {
      container: 'w-16 h-16',
      text: 'text-xl',
      indicator: 'w-3.5 h-3.5'
    }
  };
  
  // Determine shape classes
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-md'
  };
  
  // Determine position classes for status indicator
  const positionClasses = {
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0'
  };
  
  // Get size values
  const sizeValue = typeof size === 'string' ? sizeClasses[size as keyof typeof sizeClasses] : null;
  const containerSize = sizeValue ? sizeValue.container : '';
  const textSize = sizeValue ? sizeValue.text : '';
  const indicatorSize = sizeValue ? sizeValue.indicator : '';
  
  // Custom size if number is provided
  const customSizeStyle = typeof size === 'number' ? { width: size, height: size } : {};
  
  // Custom avatar style
  const avatarStyle = {
    ...customSizeStyle,
    ...style,
    ...(backgroundColor && !src ? { backgroundColor } : {}),
    ...(textColor && !src ? { color: textColor } : {})
  };
  
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${containerSize} ${shapeClasses[shape]} ${className}`} 
      style={avatarStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {src ? (
        <img 
          src={src} 
          alt={`${name}'s avatar`} 
          className={`object-cover w-full h-full ${shapeClasses[shape]}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.style.display = 'none';
            const fallbackEl = e.currentTarget.nextElementSibling as HTMLElement;
          if (fallbackEl) fallbackEl.style.display = 'flex';
          }}
        />
      ) : null}
      
      <div 
        className={`absolute inset-0 flex items-center justify-center ${shapeClasses[shape]} ${
          backgroundColor ? '' : 'bg-gray-300 dark:bg-gray-600'
        } ${textColor ? '' : 'text-gray-700 dark:text-gray-200'} ${textSize}`}
        style={{ display: src ? 'none' : 'flex' }}
      >
        {initials}
      </div>
      
      {showStatusIndicator && status && (
        <span 
          className={`absolute ${positionClasses[statusIndicatorPosition]} ${indicatorSize} ${
            statusColors[status] || 'bg-gray-400'
          } ${shapeClasses.circle} border-2 border-white dark:border-gray-800`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;