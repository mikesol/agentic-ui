import React from 'react';

/**
 * @component EmailSidebar
 * @description Sidebar for email client showing folders and navigation options
 * @domain communication, email, navigation
 * @usage Navigation sidebar for email applications showing folders and options
 * 
 * @example
 * // Basic usage
 * <EmailSidebar
 *   folders={[
 *     { id: 'inbox', name: 'Inbox', type: 'inbox', unreadCount: 3 },
 *     { id: 'sent', name: 'Sent', type: 'sent' }
 *   ]}
 *   activeFolder="inbox"
 *   onSelectFolder={(folderId) => setActiveFolder(folderId)}
 * />
 * 
 * @example
 * // With custom folders and compose button
 * <EmailSidebar
 *   folders={customFolders}
 *   activeFolder={currentFolder}
 *   onSelectFolder={handleSelectFolder}
 *   onComposeEmail={handleComposeEmail}
 *   collapsible={true}
 * />
 */
export interface EmailSidebarProps {
  /** Folders to display in sidebar */
  folders: Array<{
    id: string;
    name: string;
    icon?: string;
    unreadCount?: number;
    type?: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'starred' | 'custom';
  }>;
  
  /** Currently active folder ID */
  activeFolder: string;
  
  /** Handler for selecting a folder */
  onSelectFolder: (folderId: string) => void;
  
  /** Handler for compose email button */
  onComposeEmail?: () => void;
  
  /** Whether sidebar is collapsible */
  collapsible?: boolean;
  
  /** Whether sidebar is collapsed by default (only if collapsible) */
  defaultCollapsed?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Get folder icon based on folder type
 */
const getFolderIcon = (type?: string) => {
  switch (type) {
    case 'inbox':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
        </svg>
      );
    case 'sent':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      );
    case 'drafts':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      );
    case 'trash':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'spam':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'starred':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
          <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
        </svg>
      );
  }
};

/**
 * EmailSidebar Component
 */
export const EmailSidebar: React.FC<EmailSidebarProps> = ({
  folders,
  activeFolder,
  onSelectFolder,
  onComposeEmail,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  style = {}
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed && collapsible);
  
  return (
    <div 
      className={`h-full border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto ${
        isCollapsed ? 'w-16' : ''
      } ${className}`}
      style={style}
    >
      {/* Compose button (if provided) */}
      {onComposeEmail && (
        <div className="p-3">
          <button
            onClick={onComposeEmail}
            className="w-full py-2 px-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {!isCollapsed && <span className="ml-1">Compose</span>}
          </button>
        </div>
      )}
      
      {/* Folder list */}
      <div className="mt-2">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            className={`w-full flex items-center py-2 px-3 ${
              activeFolder === folder.id
                ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="flex-shrink-0 w-5 text-center">
              {folder.icon || getFolderIcon(folder.type)}
            </span>
            
            {!isCollapsed && (
              <>
                <span className="ml-3 truncate">{folder.name}</span>
                {folder.unreadCount ? (
                  <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {folder.unreadCount}
                  </span>
                ) : null}
              </>
            )}
            
            {isCollapsed && folder.unreadCount ? (
              <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
            ) : null}
          </button>
        ))}
      </div>
      
      {/* Collapse button (if collapsible) */}
      {collapsible && (
        <div className="mt-2 p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full p-2 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {isCollapsed ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {!isCollapsed && <span className="ml-2">Collapse</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailSidebar;