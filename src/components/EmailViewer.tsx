import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { MediaAttachment } from './MediaAttachment';

/**
 * @component EmailViewer
 * @description Displays the content of a selected email with actions
 * @domain communication, email, content
 * @usage Detailed view for displaying and interacting with email content
 * 
 * @example
 * // Basic usage
 * <EmailViewer
 *   email={selectedEmail}
 *   onReply={() => handleReply(selectedEmail)}
 * />
 * 
 * @example
 * // With all actions
 * <EmailViewer
 *   email={email}
 *   onReply={handleReply}
 *   onDelete={handleDelete}
 *   onForward={handleForward}
 *   onMoveToFolder={handleMove}
 *   onMarkAsStarred={handleStar}
 *   folders={availableFolders}
 * />
 */
export interface EmailViewerProps {
  /** Email object to display */
  email: {
    id: string;
    subject: string;
    body: string;
    from: {
      name: string;
      email: string;
      avatar?: string;
    };
    to: Array<{
      name: string;
      email: string;
    }>;
    cc?: Array<{
      name: string;
      email: string;
    }>;
    bcc?: Array<{
      name: string;
      email: string;
    }>;
    timestamp: string | number | Date;
    attachments?: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
      previewUrl?: string;
    }>;
    isRead?: boolean;
    isStarred?: boolean;
    folder?: string;
    labels?: string[];
  } | null;
  
  /** Handler for replying to the email */
  onReply?: () => void;
  
  /** Handler for forwarding the email */
  onForward?: () => void;
  
  /** Handler for deleting the email */
  onDelete?: () => void;
  
  /** Handler for marking the email as starred/unstarred */
  onMarkAsStarred?: (isStarred: boolean) => void;
  
  /** Handler for moving the email to a folder */
  onMoveToFolder?: (folderId: string) => void;
  
  /** Available folders for moving emails */
  folders?: Array<{
    id: string;
    name: string;
    type?: string;
  }>;
  
  /** Handler for going back (mobile view) */
  onBack?: () => void;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * EmailViewer Component
 */
export const EmailViewer: React.FC<EmailViewerProps> = ({
  email,
  onReply,
  onForward,
  onDelete,
  onMarkAsStarred,
  onMoveToFolder,
  folders = [],
  onBack,
  className = '',
  style = {}
}) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  
  // Early return for no email
  if (!email) {
    return (
      <div 
        className={`h-full bg-white dark:bg-gray-800 flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-center p-6">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No email selected</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select an email to view its contents</p>
        </div>
      </div>
    );
  }
  
  // Format date
  const formatDate = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Format recipients (to, cc, bcc)
  const formatRecipients = (recipients?: Array<{ name: string; email: string }>): string => {
    if (!recipients || recipients.length === 0) return '';
    
    return recipients.map(r => r.name ? `${r.name} <${r.email}>` : r.email).join(', ');
  };
  
  return (
    <div 
      className={`h-full bg-white dark:bg-gray-800 flex flex-col ${className}`}
      style={style}
    >
      {/* Email header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Top actions row with back button */}
        <div className="flex items-center mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 md:hidden"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          
          <h1 className="text-xl font-bold text-gray-800 dark:text-white flex-1 truncate">
            {email.subject}
          </h1>
          
          {/* Email actions */}
          <div className="flex space-x-2">
            {/* Star button */}
            {onMarkAsStarred && (
              <button
                onClick={() => onMarkAsStarred(!email.isStarred)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label={email.isStarred ? 'Unstar' : 'Star'}
              >
                {email.isStarred ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                )}
              </button>
            )}
            
            {/* Delete button */}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Delete"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            {/* Move to folder button */}
            {onMoveToFolder && folders.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowMoveMenu(!showMoveMenu)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label="Move to folder"
                >
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                </button>
                
                {showMoveMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                    <div className="py-1">
                      {folders.map(folder => (
                        <button
                          key={folder.id}
                          onClick={() => {
                            onMoveToFolder(folder.id);
                            setShowMoveMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {folder.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Sender info */}
        <div className="flex items-center mb-4">
          <Avatar
            name={email.from.name}
            src={email.from.avatar}
            size="md"
            className="mr-3"
          />
          
          <div className="flex-1">
            <div className="flex items-baseline">
              <h2 className="text-base font-medium text-gray-900 dark:text-white mr-2">
                {email.from.name}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {`<${email.from.email}>`}
              </span>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatDate(email.timestamp)}
            </div>
          </div>
        </div>
        
        {/* Recipients */}
        <div className="space-y-1 text-sm">
          <div className="text-gray-700 dark:text-gray-300">
            <span className="inline-block w-8 text-gray-500 dark:text-gray-400">To:</span>
            <span>{formatRecipients(email.to)}</span>
          </div>
          
          {email.cc && email.cc.length > 0 && (
            <div className="text-gray-700 dark:text-gray-300">
              <span className="inline-block w-8 text-gray-500 dark:text-gray-400">Cc:</span>
              <span>{formatRecipients(email.cc)}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Email labels (if any) */}
      {email.labels && email.labels.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700">
          {email.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
            >
              {label}
            </span>
          ))}
        </div>
      )}
      
      {/* Email body */}
      <div className="p-4 flex-1 overflow-y-auto">
        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      </div>
      
      {/* Attachments */}
      {email.attachments && email.attachments.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attachments ({email.attachments.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {email.attachments.map(attachment => (
              <MediaAttachment
                key={attachment.id}
                media={{
                  type: attachment.type.startsWith('image/') ? 'image' :
                         attachment.type.startsWith('video/') ? 'video' :
                         attachment.type.startsWith('audio/') ? 'audio' : 'document',
                  url: attachment.url,
                  thumbnailUrl: attachment.previewUrl,
                  filename: attachment.name,
                  filesize: attachment.size
                }}
                displayStyle="compact"
                showDownloadButton
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Email actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          {onReply && (
            <button
              onClick={onReply}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Reply
            </button>
          )}
          
          {onForward && (
            <button
              onClick={onForward}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Forward
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailViewer;