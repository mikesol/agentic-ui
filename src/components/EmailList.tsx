import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { Badge } from './common/Badge';
import { Card } from './common/Card';
import { SearchBar } from './common/SearchBar';

/**
 * @component EmailList
 * @description Displays a list of emails with sorting and filtering options
 * @domain communication, email, list
 * @usage List view for displaying email messages in an email client
 * 
 * @example
 * // Basic usage
 * <EmailList
 *   emails={emailData}
 *   onSelectEmail={(emailId) => handleSelectEmail(emailId)}
 * />
 * 
 * @example
 * // With selection and actions
 * <EmailList
 *   emails={emails}
 *   selectedEmailId={currentEmailId}
 *   onSelectEmail={handleSelectEmail}
 *   onDeleteEmail={handleDeleteEmail}
 *   onMarkAsRead={handleMarkAsRead}
 *   onMarkAsStarred={handleMarkAsStarred}
 * />
 */
export interface EmailListProps {
  /** Array of email objects */
  emails: Array<{
    id: string;
    subject: string;
    snippet?: string;
    from: {
      name: string;
      email: string;
      avatar?: string;
    };
    to: Array<{
      name: string;
      email: string;
    }>;
    timestamp: string | number | Date;
    isRead?: boolean;
    isStarred?: boolean;
    hasAttachments?: boolean;
    labels?: string[];
    folder?: string;
  }>;
  
  /** ID of the selected email */
  selectedEmailId?: string | null;
  
  /** Whether the list is loading */
  isLoading?: boolean;
  
  /** Handler for selecting an email */
  onSelectEmail: (emailId: string) => void;
  
  /** Handler for deleting an email */
  onDeleteEmail?: (emailId: string) => void;
  
  /** Handler for marking an email as read/unread */
  onMarkAsRead?: (emailId: string, isRead: boolean) => void;
  
  /** Handler for marking an email as starred/unstarred */
  onMarkAsStarred?: (emailId: string, isStarred: boolean) => void;
  
  /** Sort field */
  sortBy?: 'date' | 'sender' | 'subject';
  
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  
  /** Filter to only show unread emails */
  filterUnread?: boolean;
  
  /** Time format for displaying timestamps */
  timeFormat?: 'relative' | '12h' | '24h';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * EmailList Component
 */
export const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmailId,
  isLoading = false,
  onSelectEmail,
  onDeleteEmail,
  onMarkAsRead,
  onMarkAsStarred,
  // sortBy = 'date', - unused, keeping for API compatibility
  // sortDirection = 'desc', - unused, keeping for API compatibility
  filterUnread = false,
  timeFormat = 'relative',
  className = '',
  style = {}
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter emails if needed
  const filteredEmails = emails.filter(email => {
    // Apply unread filter if enabled
    if (filterUnread && email.isRead) {
      return false;
    }
    
    // Apply search filter if there's a query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(query) ||
        email.from.name.toLowerCase().includes(query) ||
        email.from.email.toLowerCase().includes(query) ||
        (email.snippet && email.snippet.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Format timestamp based on specified format
  const formatTimestamp = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (timeFormat === 'relative') {
      if (diffMs < 60 * 1000) {
        return 'Just now';
      } else if (diffMs < 60 * 60 * 1000) {
        const mins = Math.floor(diffMs / (60 * 1000));
        return `${mins}m ago`;
      } else if (diffMs < 24 * 60 * 60 * 1000) {
        const hours = Math.floor(diffMs / (60 * 60 * 1000));
        return `${hours}h ago`;
      } else if (diffDays < 7) {
        return date.toLocaleDateString(undefined, { weekday: 'short' });
      } else {
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
    } else if (timeFormat === '24h') {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
  };
  
  // Get snippet text with proper truncation
  const getSnippet = (snippet?: string): string => {
    if (!snippet) return '';
    return snippet.length > 100 ? snippet.substring(0, 100) + '...' : snippet;
  };
  
  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };
  
  return (
    <Card 
      variant="flat"
      padding="none"
      className={`h-full flex flex-col ${className}`}
      style={style}
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            {filterUnread ? 'Unread' : 'All Messages'}
          </h2>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {filteredEmails.length} {filteredEmails.length === 1 ? 'message' : 'messages'}
          </div>
        </div>
      }
    >
      {/* Search bar */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search emails..."
          size="sm"
          instantSearch
        />
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center items-center p-4 text-gray-500 dark:text-gray-400">
          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      )}
      
      {/* Empty state */}
      {!isLoading && filteredEmails.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No messages</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {searchQuery ? 'No emails matching your search' : 'Your inbox is empty'}
          </p>
        </div>
      )}
      
      {/* Email list */}
      {!isLoading && filteredEmails.length > 0 && (
        <div className="overflow-y-auto flex-1">
          {filteredEmails.map((email) => (
            <button
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              className={`w-full text-left p-3 border-b border-gray-200 dark:border-gray-700 focus:outline-none ${
                selectedEmailId === email.id
                  ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              } ${
                !email.isRead
                  ? 'bg-white dark:bg-gray-800 font-medium'
                  : 'bg-gray-50 dark:bg-gray-900'
              }`}
            >
              <div className="flex items-start">
                {/* Avatar */}
                <div className="mr-3">
                  <Avatar
                    name={email.from.name}
                    src={email.from.avatar}
                    size="sm"
                  />
                </div>
                
                {/* Email content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 truncate font-medium text-gray-800 dark:text-white">
                      {email.from.name}
                    </div>
                    <div className={`ml-2 text-xs whitespace-nowrap ${
                      email.isRead
                        ? 'text-gray-500 dark:text-gray-400'
                        : 'text-gray-700 dark:text-gray-300 font-medium'
                    }`}>
                      {formatTimestamp(email.timestamp)}
                    </div>
                  </div>
                  
                  <div className={`text-sm truncate mb-1 ${
                    email.isRead
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900 dark:text-gray-100 font-medium'
                  }`}>
                    {email.subject}
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {getSnippet(email.snippet)}
                  </div>
                </div>
              </div>
              
              {/* Email actions and indicators */}
              <div className="flex items-center mt-2">
                {/* Star indicator/button */}
                {onMarkAsStarred && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsStarred(email.id, !email.isStarred);
                    }}
                    className="mr-2 text-gray-400 hover:text-yellow-400 focus:outline-none"
                  >
                    {email.isStarred ? (
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    )}
                  </button>
                )}
                
                {/* Attachment indicator */}
                {email.hasAttachments && (
                  <div className="mr-2 text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                
                {/* Labels */}
                {email.labels && email.labels.length > 0 && (
                  <div className="flex space-x-1 mr-2">
                    {email.labels.slice(0, 2).map((label, index) => (
                      <Badge 
                        key={index} 
                        variant="primary" 
                        size="sm"
                      >
                        {label}
                      </Badge>
                    ))}
                    {email.labels.length > 2 && (
                      <Badge 
                        variant="neutral" 
                        size="sm"
                      >
                        +{email.labels.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="ml-auto flex space-x-1 opacity-0 group-hover:opacity-100">
                  {/* Mark as read/unread button */}
                  {onMarkAsRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead(email.id, !email.isRead);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                      aria-label={email.isRead ? 'Mark as unread' : 'Mark as read'}
                    >
                      {email.isRead ? (
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )}
                  
                  {/* Delete button */}
                  {onDeleteEmail && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEmail(email.id);
                      }}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                      aria-label="Delete"
                    >
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
};

export default EmailList;