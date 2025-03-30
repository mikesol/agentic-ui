import React from 'react';

/**
 * @component ChatHeader
 * @description Header for a chat conversation, showing conversation/contact info
 * @domain communication, social, messaging, navigation
 * @usage Header for displaying conversation info and actions in chat interfaces
 * 
 * @example
 * // Basic usage
 * <ChatHeader 
 *   conversation={{ id: 'conv-1', name: 'John Doe', status: 'online' }}
 * />
 * 
 * @example
 * // With back button and menu
 * <ChatHeader 
 *   conversation={activeConversation}
 *   onBack={() => setActiveConversation(null)}
 *   actions={[
 *     { label: 'Call', icon: 'phone', onClick: handleCall },
 *     { label: 'Video', icon: 'video', onClick: handleVideoCall },
 *     { label: 'Info', icon: 'info', onClick: handleViewInfo }
 *   ]}
 * />
 */
export interface ChatHeaderProps {
  /** Conversation or contact information */
  conversation?: {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
    subtitle?: string;
  };
  
  /** Handler for back button click */
  onBack?: () => void;
  
  /** Actions to display in the header */
  actions?: Array<{
    label: string;
    icon?: string;
    onClick: () => void;
  }>;
  
  /** Custom renderer for status indicator */
  statusRenderer?: (status: string) => React.ReactNode;
  
  /** Whether typing indicator is active */
  isTyping?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * ChatHeader Component
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onBack,
  actions = [],
  statusRenderer,
  isTyping = false,
  className = '',
  style = {}
}) => {
  // Default status renderer
  const defaultStatusRenderer = (status: string) => {
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500'
    };
    
    return (
      <span className="flex items-center">
        <span className={`w-2 h-2 rounded-full mr-1 ${statusColors[status as keyof typeof statusColors] || 'bg-gray-400'}`}></span>
        <span className="capitalize text-xs">{status}</span>
      </span>
    );
  };
  
  return (
    <div 
      className={`flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
      style={style}
    >
      {onBack && (
        <button 
          onClick={onBack}
          className="p-1 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          aria-label="Back"
        >
          <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {conversation && (
        <>
          <div className="relative">
            {conversation.avatar ? (
              <img 
                src={conversation.avatar} 
                alt={conversation.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  {conversation.name.charAt(0)}
                </span>
              </div>
            )}
            
            {conversation.status && (
              <div className="absolute bottom-0 right-0">
                {statusRenderer 
                  ? statusRenderer(conversation.status)
                  : defaultStatusRenderer(conversation.status)
                }
              </div>
            )}
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{conversation.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isTyping 
                ? 'Typing...' 
                : conversation.subtitle || (conversation.status && statusRenderer 
                    ? null 
                    : conversation.status
                  )
              }
            </p>
          </div>
        </>
      )}
      
      <div className="flex ml-auto">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="p-2 ml-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            aria-label={action.label}
          >
            {action.icon ? (
              <span className="w-5 h-5 text-gray-500 dark:text-gray-400">
                {/* Icon would go here - using a placeholder */}
                {action.icon}
              </span>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">{action.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatHeader;