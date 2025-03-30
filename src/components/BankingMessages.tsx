import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { MediaAttachment } from './MediaAttachment';

/**
 * @component BankingMessages
 * @description Display and manage banking messages/notifications with sending capability
 * @domain finance, banking, communication, messaging
 * @usage Banking message center for viewing messages from the bank and sending inquiries
 * 
 * @example
 * // Basic usage
 * <BankingMessages
 *   messages={bankMessages}
 *   user={currentUser}
 *   onSendMessage={handleSendMessage}
 * />
 * 
 * @example
 * // With custom handlers
 * <BankingMessages
 *   messages={messages}
 *   user={user}
 *   onSendMessage={handleSendMessage}
 *   onDeleteMessage={handleDeleteMessage}
 *   onMarkAsRead={handleMarkAsRead}
 * />
 */
export interface BankingMessagesProps {
  /** Bank messages */
  messages: Array<{
    id: string;
    subject: string;
    body: string;
    date: string | Date;
    isRead: boolean;
    attachments?: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
      size: number;
    }>;
    sender: 'bank' | 'user';
  }>;
  
  /** Current user information */
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  
  /** Function to send a message to the bank */
  onSendMessage: (message: {
    subject: string;
    body: string;
    attachments?: File[];
  }) => Promise<void> | void;
  
  /** Function to delete a message */
  onDeleteMessage?: (messageId: string) => Promise<void> | void;
  
  /** Function to mark a message as read */
  onMarkAsRead?: (messageId: string, isRead: boolean) => Promise<void> | void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Format date to readable format
 */
const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } else if (diffDays === 1) {
    return `Yesterday at ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'long' });
  } else {
    return d.toLocaleDateString([], { day: 'numeric', month: 'short', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  }
};

/**
 * BankingMessages Component
 */
export const BankingMessages: React.FC<BankingMessagesProps> = ({
  messages,
  user,
  onSendMessage,
  onDeleteMessage,
  onMarkAsRead,
  className = '',
  style = {}
}) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isComposingMessage, setIsComposingMessage] = useState(false);
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageBody, setNewMessageBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Sort messages by date (newest first)
  const sortedMessages = [...messages].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // Get selected message
  const selectedMessage = selectedMessageId 
    ? messages.find(m => m.id === selectedMessageId) 
    : null;
  
  // Handle selecting a message
  const handleSelectMessage = (messageId: string) => {
    setSelectedMessageId(messageId);
    
    // Mark as read if not already read
    const message = messages.find(m => m.id === messageId);
    if (message && !message.isRead && onMarkAsRead) {
      onMarkAsRead(messageId, true);
    }
  };
  
  // Handle deleting a message
  const handleDeleteMessage = (messageId: string) => {
    if (onDeleteMessage) {
      onDeleteMessage(messageId);
      if (selectedMessageId === messageId) {
        setSelectedMessageId(null);
      }
    }
  };
  
  // Handle composing a new message
  const handleComposeMessage = () => {
    setIsComposingMessage(true);
    setSelectedMessageId(null);
    setNewMessageSubject('');
    setNewMessageBody('');
    setAttachments([]);
  };
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessageSubject.trim()) {
      setErrorMessage('Please enter a subject');
      return;
    }
    
    if (!newMessageBody.trim()) {
      setErrorMessage('Please enter a message');
      return;
    }
    
    try {
      await onSendMessage({
        subject: newMessageSubject,
        body: newMessageBody,
        attachments: attachments.length > 0 ? attachments : undefined
      });
      
      setIsComposingMessage(false);
      setNewMessageSubject('');
      setNewMessageBody('');
      setAttachments([]);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage('Failed to send message. Please try again.');
    }
  };
  
  // Handle cancel composing
  const handleCancelCompose = () => {
    setIsComposingMessage(false);
    setErrorMessage(null);
  };
  
  // Handle file attachment
  const handleAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
      
      // Reset file input
      e.target.value = '';
    }
  };
  
  // Handle removing an attachment
  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  
  // Render message list view
  const renderMessageList = () => (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Messages</h2>
        <button
          onClick={handleComposeMessage}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Message
        </button>
      </div>
      
      {sortedMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">No messages in your inbox</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedMessages.map(message => (
              <li 
                key={message.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition ${
                  selectedMessageId === message.id ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''
                } ${!message.isRead ? 'font-semibold' : ''}`}
                onClick={() => handleSelectMessage(message.id)}
              >
                <div className="flex items-center mb-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${!message.isRead ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {message.sender === 'bank' ? 'Bank' : 'You'}
                  </span>
                  <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(message.date)}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {message.subject}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-1">
                  {message.body.replace(/<[^>]*>/g, '')}
                </p>
                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex items-center mt-1">
                    <svg className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.attachments.length} {message.attachments.length === 1 ? 'attachment' : 'attachments'}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
  
  // Render message detail view
  const renderMessageDetail = () => {
    if (!selectedMessage) return null;
    
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center mb-4">
          <button
            onClick={() => setSelectedMessageId(null)}
            className="mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex-1 truncate">
            {selectedMessage.subject}
          </h2>
          {onDeleteMessage && (
            <button
              onClick={() => handleDeleteMessage(selectedMessage.id)}
              className="ml-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <Avatar
              name={selectedMessage.sender === 'bank' ? 'Bank' : user.name}
              src={selectedMessage.sender === 'user' ? user.avatar : undefined}
              size="sm"
              className="mr-3"
            />
            <div>
              <div className="font-medium text-sm">
                {selectedMessage.sender === 'bank' ? 'Bank' : user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(selectedMessage.date)}
              </div>
            </div>
          </div>
          
          <div 
            className="prose dark:prose-invert max-w-none mb-6 text-sm"
            dangerouslySetInnerHTML={{ __html: selectedMessage.body }}
          />
          
          {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                Attachments
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedMessage.attachments.map(attachment => (
                  <MediaAttachment
                    key={attachment.id}
                    media={{
                      type: attachment.type.startsWith('image/') ? 'image' :
                             attachment.type.startsWith('video/') ? 'video' :
                             attachment.type.startsWith('audio/') ? 'audio' : 'document',
                      url: attachment.url,
                      filename: attachment.name,
                      filesize: attachment.size
                    }}
                    displayStyle="compact"
                    showDownloadButton={true}
                  />
                ))}
              </div>
            </div>
          )}
          
          {selectedMessage.sender === 'bank' && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsComposingMessage(true);
                  setSelectedMessageId(null);
                  setNewMessageSubject(`Re: ${selectedMessage.subject}`);
                  setNewMessageBody('');
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render compose message form
  const renderComposeMessage = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <button
          onClick={handleCancelCompose}
          className="mr-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          New Message
        </h2>
      </div>
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-300 rounded-md">
          {errorMessage}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={newMessageSubject}
              onChange={(e) => setNewMessageSubject(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter subject"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={newMessageBody}
              onChange={(e) => setNewMessageBody(e.target.value)}
              rows={10}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Type your message here..."
            />
          </div>
          
          {/* Attachments */}
          {attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Attachments
              </label>
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md"
                  >
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    <span className="flex-1 truncate text-sm text-gray-800 dark:text-white">
                      {file.name}
                    </span>
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="ml-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            <div>
              <input
                type="file"
                id="file-attachment"
                className="hidden"
                multiple
                onChange={handleAttachFile}
              />
              <label
                htmlFor="file-attachment"
                className="cursor-pointer inline-flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                Attach Files
              </label>
            </div>
            
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Determine which view to render
  const renderContent = () => {
    if (isComposingMessage) {
      return renderComposeMessage();
    } else if (selectedMessageId) {
      return renderMessageDetail();
    } else {
      return renderMessageList();
    }
  };
  
  return (
    <div 
      className={`h-full ${className}`}
      style={style}
    >
      {renderContent()}
    </div>
  );
};

export default BankingMessages;