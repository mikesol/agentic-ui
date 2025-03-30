import React, { useState, useRef, useEffect } from 'react';

/**
 * @component ChatInput
 * @description Rich input area for chat applications with support for text, emojis, and media uploads
 * @domain communication, social, messaging, input
 * @usage Input area for composing and sending messages in chat interfaces
 * 
 * @example
 * // Basic usage
 * <ChatInput
 *   onSendMessage={(text) => handleSendMessage(text)}
 * />
 * 
 * @example
 * // With media uploads and emoji picker
 * <ChatInput
 *   onSendMessage={handleSendMessage}
 *   mediaUploadHandler={handleMediaUpload}
 *   allowedMediaTypes={['image', 'video', 'document']}
 *   maxMediaSize={5 * 1024 * 1024}
 *   customEmojis={customEmojiSet}
 * />
 */
export interface ChatInputProps {
  /** Function to handle sending messages */
  onSendMessage: (text: string, media?: Array<{
    type: 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact';
    url?: string;
    file?: File;
    metadata?: Record<string, any>;
  }>) => void;
  
  /** Message to reply to (optional) */
  replyTo?: {
    id: string;
    text?: string;
    senderName?: string;
  };
  
  /** Function to cancel reply */
  onCancelReply?: () => void;
  
  /** Custom media upload handler */
  mediaUploadHandler?: (file: File) => Promise<{ url: string, metadata?: any }>;
  
  /** Allowed media types */
  allowedMediaTypes?: Array<'image' | 'video' | 'audio' | 'document' | 'location' | 'contact'>;
  
  /** Maximum media size in bytes */
  maxMediaSize?: number;
  
  /** Custom emoji set */
  customEmojis?: Record<string, string>;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether to enable auto-focus */
  autoFocus?: boolean;
  
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
 * Commonly used emoji groups
 */
const EMOJI_GROUPS = {
  smiley: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🙂', '🙃', '😉', '😊'],
  hand: ['👍', '👎', '👏', '🙌', '👌', '✌️', '🤞', '🤝', '🤲', '👐'],
  heart: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '❣️', '💕', '💓'],
  animals: ['🐶', '🐱', '🦊', '🐻', '🐼', '🦁', '🐮', '🐷', '🐸', '🐵'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑'],
  activity: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🎯', '🎮'],
  travel: ['✈️', '🚗', '🚕', '🚌', '🚎', '🏍️', '🚲', '🚂', '🚆', '🚢']
};

/**
 * ChatInput Component
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  replyTo,
  onCancelReply,
  mediaUploadHandler,
  allowedMediaTypes = ['image', 'video', 'audio', 'document'],
  maxMediaSize = 5 * 1024 * 1024, // 5MB default
  customEmojis = {},
  placeholder = 'Type a message...',
  autoFocus = false,
  labels = {
    sendButton: 'Send',
    attachmentButton: 'Attach',
    emojiButton: 'Emoji',
    placeholder: 'Type a message...'
  },
  className = '',
  style = {}
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [media, setMedia] = useState<Array<{
    id: string;
    file: File;
    type: string;
    previewUrl?: string;
    url?: string;
    uploadProgress?: number;
    uploadError?: string;
  }>>([]);
  const [currentEmojiGroup, setCurrentEmojiGroup] = useState('smiley');
  
  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Auto-resize textarea
  const autoResize = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };
  
  // Handle text input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    autoResize();
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  // Open file selector
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Filter files by allowed types and size
    const validFiles = files.filter(file => {
      // Check file type
      const fileType = file.type.split('/')[0]; // e.g., "image/jpeg" -> "image"
      const isAllowedType = allowedMediaTypes.some(type => {
        if (type === 'document') {
          return !['image', 'video', 'audio'].includes(fileType);
        }
        return fileType === type;
      });
      
      // Check file size
      const isAllowedSize = file.size <= maxMediaSize;
      
      return isAllowedType && isAllowedSize;
    });
    
    // Add valid files to media state
    const newMedia = validFiles.map(file => {
      const id = Math.random().toString(36).substr(2, 9);
      const fileType = file.type.split('/')[0];
      const mediaItem: any = { id, file, type: fileType };
      
      // Create preview URL for images and videos
      if (['image', 'video'].includes(fileType)) {
        mediaItem.previewUrl = URL.createObjectURL(file);
      }
      
      return mediaItem;
    });
    
    setMedia([...media, ...newMedia]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Upload files if media upload handler is provided
    if (mediaUploadHandler) {
      newMedia.forEach(async (item) => {
        try {
          // Update progress (would be implemented with real upload progress in a real app)
          setMedia(prev => prev.map(m => 
            m.id === item.id ? { ...m, uploadProgress: 50 } : m
          ));
          
          // Upload file
          const result = await mediaUploadHandler(item.file);
          
          // Update media item with upload result
          setMedia(prev => prev.map(m => 
            m.id === item.id ? { 
              ...m, 
              url: result.url, 
              metadata: result.metadata,
              uploadProgress: 100 
            } : m
          ));
        } catch (error) {
          // Handle upload error
          setMedia(prev => prev.map(m => 
            m.id === item.id ? { 
              ...m, 
              uploadError: 'Upload failed', 
              uploadProgress: undefined 
            } : m
          ));
        }
      });
    }
  };
  
  // Remove media item
  const removeMediaItem = (id: string) => {
    setMedia(prev => {
      const item = prev.find(m => m.id === id);
      
      // Revoke object URL if it exists
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      
      return prev.filter(m => m.id !== id);
    });
  };
  
  // Handle emoji selection
  const handleEmojiSelect = (emoji: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      
      const newMessage = message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      
      // Focus back on input and set cursor position after emoji
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const newCursorPos = start + emoji.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 10);
    } else {
      setMessage(message + emoji);
    }
    
    setIsEmojiPickerOpen(false);
  };
  
  // Send message
  const sendMessage = () => {
    if (message.trim() === '' && media.length === 0) return;
    
    const mediaItems = media.map(item => ({
      type: item.type as 'image' | 'video' | 'audio' | 'document',
      url: item.url,
      file: !item.url ? item.file : undefined, // Include file only if URL is not available
      metadata: {}
    }));
    
    onSendMessage(message, mediaItems);
    setMessage('');
    setMedia([]);
    
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };
  
  return (
    <div 
      className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 ${className}`}
      style={style}
    >
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-start mb-2 p-2 rounded bg-gray-100 dark:bg-gray-700">
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Replying to {replyTo.senderName || 'message'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {replyTo.text || 'Media message'}
            </div>
          </div>
          {onCancelReply && (
            <button 
              onClick={onCancelReply}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Media preview */}
      {media.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {media.map(item => (
            <div 
              key={item.id}
              className="relative rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Preview for images */}
              {item.type === 'image' && item.previewUrl && (
                <div className="w-20 h-20">
                  <img 
                    src={item.previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Preview for videos */}
              {item.type === 'video' && item.previewUrl && (
                <div className="w-20 h-20 bg-black">
                  <video 
                    src={item.previewUrl}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Preview for audio */}
              {item.type === 'audio' && (
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Preview for documents */}
              {item.type !== 'image' && item.type !== 'video' && item.type !== 'audio' && (
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center p-1">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  <div className="text-xs text-center mt-1 truncate w-full">
                    {item.file.name.split('.').pop()?.toUpperCase()}
                  </div>
                </div>
              )}
              
              {/* Upload progress indicator */}
              {item.uploadProgress !== undefined && item.uploadProgress < 100 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin" />
                </div>
              )}
              
              {/* Upload error indicator */}
              {item.uploadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-30">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Remove button */}
              <button 
                className="absolute top-0 right-0 p-1 bg-black bg-opacity-50 text-white rounded-bl-md"
                onClick={() => removeMediaItem(item.id)}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="relative flex items-end">
        {/* Textarea */}
        <div className="flex-1 mr-2">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={labels.placeholder || placeholder}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            style={{ minHeight: '45px', maxHeight: '120px' }}
            rows={1}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex">
          {/* Attachment button */}
          {allowedMediaTypes.length > 0 && (
            <button 
              onClick={openFileSelector}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 mr-1"
              title={labels.attachmentButton || 'Attach file'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelection}
                className="hidden"
                accept={allowedMediaTypes.map(type => {
                  switch (type) {
                    case 'image': return 'image/*';
                    case 'video': return 'video/*';
                    case 'audio': return 'audio/*';
                    case 'document': return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
                    default: return '';
                  }
                }).join(',')}
              />
            </button>
          )}
          
          {/* Emoji button */}
          <button 
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 mr-1"
            title={labels.emojiButton || 'Add emoji'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Send button */}
          <button 
            onClick={sendMessage}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
            title={labels.sendButton || 'Send message'}
            disabled={message.trim() === '' && media.length === 0}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Emoji picker */}
      {isEmojiPickerOpen && (
        <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          {/* Emoji group tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            {Object.keys(EMOJI_GROUPS).map((group) => (
              <button
                key={group}
                onClick={() => setCurrentEmojiGroup(group)}
                className={`p-1 mx-1 rounded ${
                  currentEmojiGroup === group 
                    ? 'bg-blue-100 dark:bg-blue-800 text-blue-500 dark:text-blue-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {EMOJI_GROUPS[group as keyof typeof EMOJI_GROUPS][0]}
              </button>
            ))}
          </div>
          
          {/* Emoji grid */}
          <div className="grid grid-cols-6 gap-1">
            {EMOJI_GROUPS[currentEmojiGroup as keyof typeof EMOJI_GROUPS].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {emoji}
              </button>
            ))}
            
            {/* Custom emojis */}
            {currentEmojiGroup === 'smiley' && Object.entries(customEmojis).map(([key, emoji]) => (
              <button
                key={key}
                onClick={() => handleEmojiSelect(emoji)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;