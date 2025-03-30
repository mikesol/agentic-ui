import React from 'react';

/**
 * @component ChatDayDivider
 * @description Displays a date separator between messages from different days
 * @domain communication, social, messaging, display
 * @usage Visual separator to group chat messages by date
 * 
 * @example
 * // Basic usage
 * <ChatDayDivider date={new Date()} />
 * 
 * @example
 * // With custom formatter
 * <ChatDayDivider 
 *   date={new Date('2023-05-15')}
 *   formatter={(date) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
 * />
 */
export interface ChatDayDividerProps {
  /** Date to display */
  date: Date;
  
  /** Custom date formatter */
  formatter?: (date: Date) => string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * ChatDayDivider Component
 */
export const ChatDayDivider: React.FC<ChatDayDividerProps> = ({
  date,
  formatter,
  className = '',
  style = {}
}) => {
  // Default date formatter
  const defaultFormatter = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return 'Today';
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      // Format: Monday, May 15
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  const formattedDate = formatter ? formatter(date) : defaultFormatter(date);
  
  return (
    <div 
      className={`flex items-center my-4 ${className}`}
      style={style}
    >
      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
      <div className="mx-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
        {formattedDate}
      </div>
      <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
    </div>
  );
};

export default ChatDayDivider;