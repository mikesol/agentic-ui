import React, { useState, useEffect, useRef } from 'react';
import { ChatConversation } from './ChatConversation';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';

/**
 * @component RichMediaChatApplication
 * @description A complete rich media chat application supporting text, images, videos, audio, files, and more.
 * @domain communication, social, messaging
 * @usage Complete chat interface with customizable styling, behavior, and API integration
 * 
 * @example
 * // Basic usage with default styling
 * <RichMediaChatApplication 
 *   user={{ id: 'user-1', name: 'John Doe', avatar: '/avatar.jpg' }}
 *   contacts={contacts}
 *   onSendMessage={(message) => api.sendMessage(message)}
 *   onFetchMessages={() => api.getMessages()}
 * />
 * 
 * @example
 * // Custom styling and behavior
 * <RichMediaChatApplication 
 *   user={currentUser}
 *   contacts={contacts}
 *   onSendMessage={handleSendMessage}
 *   onFetchMessages={fetchMessages}
 *   onDeleteMessage={handleDeleteMessage}
 *   onEditMessage={handleEditMessage}
 *   theme="dark"
 *   customEmojis={myCustomEmojis}
 *   mediaUploadHandler={customUploadHandler}
 *   allowedMediaTypes={['image', 'video', 'audio', 'document']}
 *   maxMediaSize={10 * 1024 * 1024} // 10MB
 * />
 */
export interface RichMediaChatApplicationProps {
  /** Current user information */
  user: {
    id: string;
    name: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
  };
  
  /** List of contacts or conversations */
  contacts?: Array<{
    id: string;
    name: string;
    avatar?: string;
    lastMessage?: string;
    unreadCount?: number;
    status?: 'online' | 'offline' | 'away';
  }>;
  
  /** Current active conversation ID */
  activeConversationId?: string;
  
  /** Function to handle sending messages */
  onSendMessage: (message: {
    text?: string;
    media?: Array<{
      type: 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';
      url?: string;
      file?: File;
      metadata?: Record<string, any>;
    }>;
    replyTo?: string;
  }) => Promise<void> | void;
  
  /** Function to fetch messages for a conversation */
  onFetchMessages: (conversationId: string, options?: { 
    limit?: number;
    before?: string;
  }) => Promise<Array<any>> | Array<any>;
  
  /** Function to handle editing messages (optional) */
  onEditMessage?: (messageId: string, newContent: {
    text?: string;
    media?: Array<any>;
  }) => Promise<void> | void;
  
  /** Function to handle deleting messages (optional) */
  onDeleteMessage?: (messageId: string) => Promise<void> | void;
  
  /** Function to handle message reactions (optional) */
  onReactToMessage?: (messageId: string, reaction: string) => Promise<void> | void;
  
  /** Custom media upload handler (optional) */
  mediaUploadHandler?: (file: File) => Promise<{ url: string, metadata?: any }>;
  
  /** Allowed media types (optional) */
  allowedMediaTypes?: Array<'image' | 'video' | 'audio' | 'document' | 'location' | 'contact'>;
  
  /** Maximum media size in bytes (optional) */
  maxMediaSize?: number;
  
  /** Theme (optional) */
  theme?: 'light' | 'dark' | 'system' | string;
  
  /** Custom emoji set (optional) */
  customEmojis?: Record<string, string>;
  
  /** Text for labels and buttons (for i18n) */
  labels?: {
    sendButton?: string;
    attachmentButton?: string;
    emojiButton?: string;
    placeholder?: string;
    [key: string]: string | undefined;
  };
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * RichMediaChatApplication Component
 */
export const RichMediaChatApplication: React.FC<RichMediaChatApplicationProps> = ({
  user,
  contacts = [],
  activeConversationId,
  onSendMessage,
  onFetchMessages,
  onEditMessage,
  onDeleteMessage,
  onReactToMessage,
  mediaUploadHandler,
  allowedMediaTypes = ['image', 'video', 'audio', 'document'],
  maxMediaSize = 5 * 1024 * 1024, // 5MB default
  theme = 'light',
  customEmojis = {},
  labels = {
    sendButton: 'Send',
    attachmentButton: 'Attach',
    emojiButton: 'Emoji',
    placeholder: 'Type a message...'
  },
  className = '',
  style = {}
}) => {
  // State for messages in the current conversation
  const [messages, setMessages] = useState<any[]>([]);
  
  // State for the currently selected conversation
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(
    activeConversationId || (contacts.length > 0 ? contacts[0].id : undefined)
  );
  
  // Ref for conversation container to scroll to bottom
  const conversationRef = useRef<HTMLDivElement>(null);
  
  // Load messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      const loadMessages = async () => {
        const fetchedMessages = await onFetchMessages(currentConversationId);
        setMessages(fetchedMessages);
      };
      
      loadMessages();
    }
  }, [currentConversationId, onFetchMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = async (text: string, media: Array<any> = []) => {
    try {
      await onSendMessage({ text, media });
      
      // Reload messages after sending
      if (currentConversationId) {
        const updatedMessages = await onFetchMessages(currentConversationId);
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };
  
  // Handle selecting a conversation - currently unused, for future features
  // const handleSelectConversation = async (conversationId: string) => {
  //   setCurrentConversationId(conversationId);
  // };
  
  return (
    <div 
      className={`flex flex-col h-full w-full bg-white dark:bg-gray-800 ${theme === 'dark' ? 'dark' : ''} ${className}`}
      style={style}
    >
      <ChatHeader 
        conversation={contacts.find(c => c.id === currentConversationId)}
        onBack={contacts.length > 1 ? () => setCurrentConversationId(undefined) : undefined}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {contacts.length > 1 && !currentConversationId && (
          <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700">
            {/* Contact/conversation list would go here */}
          </div>
        )}
        
        <div className="flex-1 flex flex-col">
          <ChatConversation
            ref={conversationRef}
            messages={messages}
            currentUser={user}
            onDeleteMessage={onDeleteMessage}
            onEditMessage={onEditMessage}
            onReactToMessage={onReactToMessage}
          />
          
          <ChatInput
            onSendMessage={handleSendMessage}
            mediaUploadHandler={mediaUploadHandler}
            allowedMediaTypes={allowedMediaTypes}
            maxMediaSize={maxMediaSize}
            customEmojis={customEmojis}
            labels={labels}
          />
        </div>
      </div>
    </div>
  );
};

export default RichMediaChatApplication;