import React, { forwardRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatDayDivider } from './ChatDayDivider';

/**
 * @component ChatConversation
 * @description Container for displaying a conversation thread with messages
 * @domain communication, social, messaging
 * @usage Scrollable container for displaying chat messages with grouping and visual formatting
 * 
 * @example
 * // Basic usage
 * <ChatConversation
 *   messages={conversationMessages}
 *   currentUser={currentUser}
 * />
 * 
 * @example
 * // With message interactions
 * <ChatConversation
 *   messages={messages}
 *   currentUser={user}
 *   onDeleteMessage={handleDelete}
 *   onEditMessage={handleEdit}
 *   onReactToMessage={handleReaction}
 *   groupSimilarMessages={true}
 *   showAvatarsInGroup={false}
 * />
 */
export interface ChatConversationProps {
  /** Array of message objects */
  messages: Array<{
    id: string;
    senderId: string;
    senderName?: string;
    senderAvatar?: string;
    text?: string;
    media?: Array<{
      type: 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';
      url: string;
      thumbnailUrl?: string;
      filename?: string;
      filesize?: number;
      duration?: number;
      dimensions?: { width: number; height: number };
      metadata?: Record<string, any>;
    }>;
    timestamp: string | number | Date;
    status?: 'sent' | 'delivered' | 'read' | 'failed';
    reactions?: Record<string, string[]>;
    replyTo?: {
      id: string;
      text?: string;
      senderName?: string;
    };
    isEdited?: boolean;
    isDeleted?: boolean;
  }>;
  
  /** Current user information */
  currentUser: {
    id: string;
    name?: string;
    avatar?: string;
  };
  
  /** Function to handle message deletion */
  onDeleteMessage?: (messageId: string) => void;
  
  /** Function to handle message editing */
  onEditMessage?: (messageId: string, newContent: { text?: string, media?: Array<any> }) => void;
  
  /** Function to handle message reactions */
  onReactToMessage?: (messageId: string, reaction: string) => void;
  
  /** Whether to group consecutive messages from the same sender */
  groupSimilarMessages?: boolean;
  
  /** Whether to show avatars in grouped messages */
  showAvatarsInGroup?: boolean;
  
  /** Time window in minutes for grouping messages */
  groupTimeWindow?: number;
  
  /** Whether to show day dividers between messages from different days */
  showDayDividers?: boolean;
  
  /** Custom formatter for message timestamps */
  timestampFormatter?: (timestamp: string | number | Date) => string;
  
  /** Custom renderer for system messages */
  systemMessageRenderer?: (message: any) => React.ReactNode;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * ChatConversation Component
 */
export const ChatConversation = forwardRef<HTMLDivElement, ChatConversationProps>(({
  messages,
  currentUser,
  onDeleteMessage,
  onEditMessage,
  onReactToMessage,
  groupSimilarMessages = true,
  showAvatarsInGroup = false,
  groupTimeWindow = 5, // minutes
  showDayDividers = true,
  timestampFormatter,
  // systemMessageRenderer, - unused, keeping for API compatibility
  className = '',
  style = {}
}, ref) => {
  // Default timestamp formatter
  const defaultTimestampFormatter = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Group messages by day if showDayDividers is true
  const messagesByDay: Record<string, typeof messages> = {};
  
  if (showDayDividers) {
    messages.forEach(message => {
      const date = new Date(message.timestamp);
      const day = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!messagesByDay[day]) {
        messagesByDay[day] = [];
      }
      
      messagesByDay[day].push(message);
    });
  }
  
  // Function to determine if a message should be grouped with the previous one
  const shouldGroupWithPrevious = (message: any, prevMessage: any): boolean => {
    if (!groupSimilarMessages || !prevMessage) return false;
    
    // Messages must be from the same sender
    if (message.senderId !== prevMessage.senderId) return false;
    
    // Messages must be within the groupTimeWindow
    const messageTime = new Date(message.timestamp).getTime();
    const prevMessageTime = new Date(prevMessage.timestamp).getTime();
    const timeDiff = (messageTime - prevMessageTime) / (1000 * 60); // convert to minutes
    
    return timeDiff <= groupTimeWindow;
  };
  
  return (
    <div 
      ref={ref}
      className={`flex-1 p-4 overflow-y-auto ${className}`}
      style={style}
    >
      {showDayDividers ? (
        // Render messages grouped by day with dividers
        Object.entries(messagesByDay).map(([day, dayMessages]) => (
          <div key={day}>
            <ChatDayDivider date={new Date(day)} />
            
            {dayMessages.map((message, messageIndex) => {
              const prevMessage = messageIndex > 0 ? dayMessages[messageIndex - 1] : null;
              const isGrouped = shouldGroupWithPrevious(message, prevMessage);
              
              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isCurrentUser={message.senderId === currentUser.id}
                  onDelete={onDeleteMessage ? () => onDeleteMessage(message.id) : undefined}
                  onEdit={onEditMessage ? (newText) => onEditMessage(message.id, { text: newText }) : undefined}
                  onReact={onReactToMessage ? (reaction) => onReactToMessage(message.id, reaction) : undefined}
                  isGrouped={isGrouped}
                  showAvatar={!isGrouped || showAvatarsInGroup}
                  timestampFormatter={timestampFormatter || defaultTimestampFormatter}
                />
              );
            })}
          </div>
        ))
      ) : (
        // Render messages without day dividers
        messages.map((message, index) => {
          const prevMessage = index > 0 ? messages[index - 1] : null;
          const isGrouped = shouldGroupWithPrevious(message, prevMessage);
          
          return (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUser.id}
              onDelete={onDeleteMessage ? () => onDeleteMessage(message.id) : undefined}
              onEdit={onEditMessage ? (newText) => onEditMessage(message.id, { text: newText }) : undefined}
              onReact={onReactToMessage ? (reaction) => onReactToMessage(message.id, reaction) : undefined}
              isGrouped={isGrouped}
              showAvatar={!isGrouped || showAvatarsInGroup}
              timestampFormatter={timestampFormatter || defaultTimestampFormatter}
            />
          );
        })
      )}
    </div>
  );
});

ChatConversation.displayName = 'ChatConversation';

export default ChatConversation;