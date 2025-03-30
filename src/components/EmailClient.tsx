import React, { useState, useEffect } from 'react';
import { Avatar } from './Avatar';
// These imports are used by child components
// @ts-ignore - Used by child components
import { MediaAttachment } from './MediaAttachment';
import { EmailSidebar } from './EmailSidebar';
import { EmailList } from './EmailList';
import { EmailViewer } from './EmailViewer';
import { EmailComposer } from './EmailComposer';

/**
 * @component EmailClient
 * @description A complete email client application with inbox, folders, and composition features
 * @domain communication, email, productivity
 * @usage Email client interface with customizable styling, behavior, and API integration
 * 
 * @example
 * // Basic usage with default styling
 * <EmailClient 
 *   user={{ id: 'user-1', name: 'John Doe', email: 'john@example.com' }}
 *   onFetchEmails={() => api.getEmails()}
 *   onSendEmail={(email) => api.sendEmail(email)}
 * />
 * 
 * @example
 * // With custom handlers and theme
 * <EmailClient 
 *   user={currentUser}
 *   onFetchEmails={fetchEmails}
 *   onSendEmail={handleSendEmail}
 *   onDeleteEmail={handleDeleteEmail}
 *   onMarkAsRead={handleMarkAsRead}
 *   onMoveToFolder={handleMoveToFolder}
 *   theme="dark"
 *   folders={customFolders}
 * />
 */
export interface EmailClientProps {
  /** Current user information */
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  
  /** Folders to display in sidebar */
  folders?: Array<{
    id: string;
    name: string;
    icon?: string;
    unreadCount?: number;
    type?: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'starred' | 'custom';
  }>;
  
  /** Function to fetch emails for a folder */
  onFetchEmails: (folderId: string, options?: { 
    page?: number;
    limit?: number;
    search?: string;
  }) => Promise<Array<any>> | Array<any>;
  
  /** Function to fetch a single email by id */
  onFetchEmail?: (emailId: string) => Promise<any> | any;
  
  /** Function to send an email */
  onSendEmail: (email: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
    attachments?: Array<{
      name: string;
      type: string;
      size: number;
      content: File | string;
    }>;
    draft?: boolean;
  }) => Promise<void> | void;
  
  /** Function to delete an email */
  onDeleteEmail?: (emailId: string) => Promise<void> | void;
  
  /** Function to mark an email as read */
  onMarkAsRead?: (emailId: string, isRead: boolean) => Promise<void> | void;
  
  /** Function to mark an email as starred */
  onMarkAsStarred?: (emailId: string, isStarred: boolean) => Promise<void> | void;
  
  /** Function to move an email to a folder */
  onMoveToFolder?: (emailId: string, folderId: string) => Promise<void> | void;
  
  /** Function to search emails */
  onSearchEmails?: (query: string) => Promise<Array<any>> | Array<any>;
  
  /** Theme (optional) */
  theme?: 'light' | 'dark' | 'system' | string;
  
  /** Max attachment size in bytes */
  maxAttachmentSize?: number;
  
  /** Whether to allow multiple attachments */
  allowMultipleAttachments?: boolean;
  
  /** Labels for i18n */
  labels?: Record<string, string>;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * EmailClient Component
 */
export const EmailClient: React.FC<EmailClientProps> = (props) => {
  const {
    user,
    folders = [
      { id: 'inbox', name: 'Inbox', type: 'inbox', unreadCount: 4 },
      { id: 'starred', name: 'Starred', type: 'starred' },
      { id: 'sent', name: 'Sent', type: 'sent' },
      { id: 'drafts', name: 'Drafts', type: 'drafts', unreadCount: 2 },
      { id: 'trash', name: 'Trash', type: 'trash' },
      { id: 'spam', name: 'Spam', type: 'spam', unreadCount: 1 }
    ],
    onFetchEmails,
    onFetchEmail,
    onSendEmail,
    onDeleteEmail,
    onMarkAsRead,
    onMarkAsStarred,
    onMoveToFolder,
    onSearchEmails,
    theme = 'light',
    maxAttachmentSize = 10 * 1024 * 1024, // 10MB default
    allowMultipleAttachments = true,
    labels = {},
    className = '',
    style = {}
  } = props;
  
  // Application state
  const [activeFolder, setActiveFolder] = useState<string>(folders[0]?.id || 'inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [emails, setEmails] = useState<any[]>([]);
  const [currentEmail, setCurrentEmail] = useState<any | null>(null);
  const [isComposingEmail, setIsComposingEmail] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Load emails when folder changes
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const fetchedEmails = await onFetchEmails(activeFolder);
        setEmails(fetchedEmails);
        setSelectedEmailId(null);
        setCurrentEmail(null);
      } catch (error) {
        console.error('Failed to fetch emails:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmails();
  }, [activeFolder, onFetchEmails]);
  
  // Load single email when selectedEmailId changes
  useEffect(() => {
    if (!selectedEmailId) {
      setCurrentEmail(null);
      return;
    }
    
    const fetchEmail = async () => {
      try {
        if (onFetchEmail) {
          const email = await onFetchEmail(selectedEmailId);
          setCurrentEmail(email);
          
          // Mark as read if not already
          if (email && !email.isRead && onMarkAsRead) {
            onMarkAsRead(selectedEmailId, true);
          }
        } else {
          // Fall back to finding in the emails array
          const email = emails.find(e => e.id === selectedEmailId);
          setCurrentEmail(email);
          
          // Mark as read if not already
          if (email && !email.isRead && onMarkAsRead) {
            onMarkAsRead(selectedEmailId, true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch email:', error);
      }
    };
    
    fetchEmail();
  }, [selectedEmailId, emails, onFetchEmail, onMarkAsRead]);
  
  // Handle search
  useEffect(() => {
    if (!searchQuery) {
      // Reset to default emails for the folder
      const fetchEmails = async () => {
        try {
          const fetchedEmails = await onFetchEmails(activeFolder);
          setEmails(fetchedEmails);
        } catch (error) {
          console.error('Failed to fetch emails:', error);
        }
      };
      
      fetchEmails();
      return;
    }
    
    const performSearch = async () => {
      setIsLoading(true);
      try {
        if (onSearchEmails) {
          const results = await onSearchEmails(searchQuery);
          setEmails(results);
        } else {
          // Simple client-side search fallback
          const fetchedEmails = await onFetchEmails(activeFolder);
          const filteredEmails = fetchedEmails.filter(email => 
            email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            email.from?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.from?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.body?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setEmails(filteredEmails);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const debounce = setTimeout(() => {
      performSearch();
    }, 300);
    
    return () => clearTimeout(debounce);
  }, [searchQuery, activeFolder, onFetchEmails, onSearchEmails]);
  
  // Handle composing a new email
  const handleComposeEmail = () => {
    setIsComposingEmail(true);
    setReplyToEmail(null);
  };
  
  // Handle replying to an email
  const handleReplyEmail = (email: any) => {
    setIsComposingEmail(true);
    setReplyToEmail(email);
  };
  
  // Handle sending an email
  const handleSendEmail = async (emailData: any) => {
    try {
      await onSendEmail(emailData);
      setIsComposingEmail(false);
      setReplyToEmail(null);
      
      // Refresh sent folder if we're looking at it
      if (activeFolder === 'sent') {
        const fetchedEmails = await onFetchEmails('sent');
        setEmails(fetchedEmails);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };
  
  // Handle deleting an email
  const handleDeleteEmail = async (emailId: string) => {
    if (!onDeleteEmail) return;
    
    try {
      await onDeleteEmail(emailId);
      
      // Remove from local state
      setEmails(emails.filter(email => email.id !== emailId));
      
      // Clear selection if the deleted email was selected
      if (selectedEmailId === emailId) {
        setSelectedEmailId(null);
        setCurrentEmail(null);
      }
    } catch (error) {
      console.error('Failed to delete email:', error);
    }
  };
  
  // Handle moving an email to a folder
  const handleMoveToFolder = async (emailId: string, targetFolderId: string) => {
    if (!onMoveToFolder) return;
    
    try {
      await onMoveToFolder(emailId, targetFolderId);
      
      // Remove from local state if moving from current folder
      setEmails(emails.filter(email => email.id !== emailId));
      
      // Clear selection if the moved email was selected
      if (selectedEmailId === emailId) {
        setSelectedEmailId(null);
        setCurrentEmail(null);
      }
    } catch (error) {
      console.error('Failed to move email:', error);
    }
  };
  
  // Determine layout based on selection state
  const isEmailSelected = !!selectedEmailId;
  
  return (
    <div 
      className={`flex flex-col h-full w-full bg-white dark:bg-gray-800 ${theme === 'dark' ? 'dark' : ''} ${className}`}
      style={style}
    >
      {/* Email Composer (Modal) */}
      {isComposingEmail && (
        <EmailComposer
          user={user}
          onSend={handleSendEmail}
          onCancel={() => {
            setIsComposingEmail(false);
            setReplyToEmail(null);
          }}
          replyTo={replyToEmail}
          maxAttachmentSize={maxAttachmentSize}
          allowMultipleAttachments={allowMultipleAttachments}
          labels={labels}
        />
      )}
      
      {/* Email Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white mr-4">Email</h1>
          <button 
            onClick={handleComposeEmail}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Compose
          </button>
        </div>
        
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emails..."
              className="w-64 px-3 py-2 pl-9 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="relative">
            <Avatar
              name={user.name}
              src={user.avatar}
              size="sm"
              shape="circle"
              onClick={() => {}}
            />
          </div>
        </div>
      </div>
      
      {/* Email Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Email Sidebar */}
        <EmailSidebar
          folders={folders}
          activeFolder={activeFolder}
          onSelectFolder={setActiveFolder}
          onComposeEmail={handleComposeEmail}
          className={isEmailSelected ? 'hidden md:block w-48' : 'w-48'}
        />
        
        {/* Email List */}
        <EmailList
          emails={emails}
          isLoading={isLoading}
          selectedEmailId={selectedEmailId}
          onSelectEmail={setSelectedEmailId}
          onDeleteEmail={onDeleteEmail ? handleDeleteEmail : undefined}
          onMarkAsRead={onMarkAsRead}
          onMarkAsStarred={onMarkAsStarred}
          className={isEmailSelected ? 'hidden md:block w-1/3' : 'flex-1'}
        />
        
        {/* Email Viewer */}
        {isEmailSelected ? (
          <EmailViewer
            email={currentEmail}
            onReply={() => currentEmail && handleReplyEmail(currentEmail)}
            onDelete={onDeleteEmail ? () => currentEmail && handleDeleteEmail(currentEmail.id) : undefined}
            onMoveToFolder={onMoveToFolder ? (folderId) => currentEmail && handleMoveToFolder(currentEmail.id, folderId) : undefined}
            onMarkAsStarred={onMarkAsStarred ? (isStarred) => currentEmail && onMarkAsStarred(currentEmail.id, isStarred) : undefined}
            onBack={() => setSelectedEmailId(null)}
            folders={folders}
            className="flex-1"
          />
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center p-6">
              <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 2.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 11.798 5.555 8.835z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Select an email to view</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose an email from the list to read its contents</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailClient;