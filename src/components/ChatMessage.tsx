import React, { useState } from 'react';
import { MediaRenderer } from './MediaRenderer';

/**
 * @component ChatMessage
 * @description Individual message component for chat applications
 * @domain communication, social, messaging
 * @usage Display an individual chat message with text, media, reactions, and interactive options
 * 
 * @example
 * // Basic usage
 * <ChatMessage
 *   message={{
 *     id: 'msg-1',
 *     senderId: 'user-1',
 *     senderName: 'John Doe',
 *     text: 'Hello world!',
 *     timestamp: new Date()
 *   }}
 *   isCurrentUser={true}
 * />
 * 
 * @example
 * // Rich media message with reactions
 * <ChatMessage
 *   message={{
 *     id: 'msg-2',
 *     senderId: 'user-2',
 *     senderName: 'Jane Smith',
 *     text: 'Check out this photo!',
 *     media: [{ 
 *       type: 'image', 
 *       url: 'https://example.com/image.jpg',
 *       dimensions: { width: 800, height: 600 } 
 *     }],
 *     timestamp: new Date(),
 *     reactions: { '👍': ['user-1'], '❤️': ['user-3'] }
 *   }}
 *   isCurrentUser={false}
 *   onReact={handleReaction}
 *   onDelete={handleDelete}
 *   onEdit={handleEdit}
 * />
 */
export interface ChatMessageProps {
  /** Message object */
  message: {
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
  };
  
  /** Whether the message is from the current user */
  isCurrentUser: boolean;
  
  /** Function to handle message deletion */
  onDelete?: () => void;
  
  /** Function to handle message editing */
  onEdit?: (newText: string) => void;
  
  /** Function to handle adding a reaction */
  onReact?: (reaction: string) => void;
  
  /** Whether the message is part of a group */
  isGrouped?: boolean;
  
  /** Whether to show the sender's avatar */
  showAvatar?: boolean;
  
  /** Function to format the timestamp */
  timestampFormatter?: (timestamp: string | number | Date) => string;
  
  /** Available reactions */
  availableReactions?: string[];
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * ChatMessage Component
 */
export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  onDelete,
  onEdit,
  onReact,
  isGrouped = false,
  showAvatar = true,
  timestampFormatter = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  availableReactions = ['👍', '❤️', '😂', '😮', '😢', '👏'],
  className = '',
  style = {}
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text || '');
  const [showReactions, setShowReactions] = useState(false);
  
  // Handle sending edited message
  const handleSaveEdit = () => {
    if (onEdit && editedText !== message.text) {
      onEdit(editedText);
    }
    setIsEditing(false);
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditedText(message.text || '');
    setIsEditing(false);
  };
  
  // Handle adding a reaction
  const handleReact = (reaction: string) => {
    if (onReact) {
      onReact(reaction);
    }
    setShowReactions(false);
  };
  
  // Calculate total reactions - currently unused, keeping for future features
  // const totalReactions = message.reactions 
  //   ? Object.values(message.reactions).reduce((sum, users) => sum + users.length, 0) 
  //   : 0;
  
  return (
    <div 
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 ${isGrouped ? 'mt-1' : 'mt-4'} ${className}`}
      style={style}
    >
      {/* Avatar (only show if not grouped or showAvatar is true) */}
      {!isCurrentUser && showAvatar && (
        <div className="flex-shrink-0 mr-2">
          {message.senderAvatar ? (
            <img 
              src={message.senderAvatar} 
              alt={message.senderName || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {(message.senderName || 'U').charAt(0)}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Message content */}
      <div className={`flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {/* Sender name (only show if not grouped) */}
        {!isCurrentUser && !isGrouped && message.senderName && (
          <span className="text-xs text-gray-500 mb-1">{message.senderName}</span>
        )}
        
        {/* Reply preview */}
        {message.replyTo && (
          <div className={`rounded-lg p-2 mb-1 text-xs max-w-full overflow-hidden ${
            isCurrentUser ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-600'
          }`}>
            <div className="font-medium">{message.replyTo.senderName || 'User'}</div>
            <div className="truncate">{message.replyTo.text || 'Media message'}</div>
          </div>
        )}
        
        {/* Message bubble */}
        <div className={`rounded-lg p-3 ${
          message.isDeleted 
            ? 'bg-gray-100 text-gray-500 italic'
            : isCurrentUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'
        }`}>
          {/* Edited message input */}
          {isEditing ? (
            <div className="flex flex-col">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="p-2 rounded border border-gray-300 text-gray-800 mb-2 min-h-[60px]"
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={handleCancelEdit}
                  className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit}
                  className="px-2 py-1 text-xs rounded bg-blue-500 text-white"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Message text */}
              {message.isDeleted ? (
                <span>This message was deleted</span>
              ) : (
                <>
                  {message.text && (
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  )}
                  
                  {/* Media content */}
                  {message.media && message.media.length > 0 && (
                    <div className={`${message.text ? 'mt-2' : ''}`}>
                      <MediaRenderer media={message.media} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
        
        {/* Message metadata row */}
        <div className="flex items-center mt-1 text-xs text-gray-500">
          {/* Timestamp */}
          <span>{timestampFormatter(message.timestamp)}</span>
          
          {/* Edited indicator */}
          {message.isEdited && !message.isDeleted && (
            <span className="ml-1">(edited)</span>
          )}
          
          {/* Message status (for current user's messages) */}
          {isCurrentUser && message.status && !message.isDeleted && (
            <span className="ml-2 capitalize">{message.status}</span>
          )}
        </div>
        
        {/* Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex flex-wrap mt-1 gap-1">
            {Object.entries(message.reactions).map(([reaction, users]) => (
              <div 
                key={reaction}
                className="bg-gray-100 rounded-full px-2 py-0.5 text-xs flex items-center"
              >
                <span>{reaction}</span>
                <span className="ml-1 text-gray-600">{users.length}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Message actions */}
        {!message.isDeleted && !isEditing && (
          <div className="relative">
            {/* Action buttons */}
            <div className="absolute top-0 right-0 -mt-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Reply button */}
              <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </button>
              
              {/* React button */}
              {onReact && (
                <div className="relative">
                  <button 
                    onClick={() => setShowReactions(!showReactions)}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  {/* Reaction picker */}
                  {showReactions && (
                    <div className="absolute bottom-8 bg-white rounded-full shadow-lg p-1 flex z-10">
                      {availableReactions.map((reaction) => (
                        <button
                          key={reaction}
                          onClick={() => handleReact(reaction)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full"
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Edit button (only for current user) */}
              {isCurrentUser && onEdit && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              {/* Delete button (only for current user) */}
              {isCurrentUser && onDelete && (
                <button 
                  onClick={onDelete}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;