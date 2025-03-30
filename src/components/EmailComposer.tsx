import React, { useState, useRef, useEffect } from 'react';
import { MediaAttachment } from './MediaAttachment';

/**
 * @component EmailComposer
 * @description Modal interface for composing and sending emails
 * @domain communication, email, composition
 * @usage Interface for creating new emails or replying to existing ones
 * 
 * @example
 * // Basic usage
 * <EmailComposer
 *   user={currentUser}
 *   onSend={(email) => handleSendEmail(email)}
 *   onCancel={() => setShowComposer(false)}
 * />
 * 
 * @example
 * // Replying to an email
 * <EmailComposer
 *   user={currentUser}
 *   replyTo={selectedEmail}
 *   onSend={handleSendEmail}
 *   onCancel={handleCancelCompose}
 *   maxAttachmentSize={10 * 1024 * 1024}
 * />
 */
export interface EmailComposerProps {
  /** Current user information */
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  
  /** Email to reply to (optional) */
  replyTo?: {
    id: string;
    subject: string;
    from: {
      name: string;
      email: string;
    };
    body?: string;
  } | null;
  
  /** Handler for sending the email */
  onSend: (email: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    attachments: Array<{
      name: string;
      type: string;
      size: number;
      content: File;
    }>;
  }) => void;
  
  /** Handler for canceling composition */
  onCancel: () => void;
  
  /** Maximum attachment size in bytes */
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
 * Helper function to parse email addresses
 */
const parseEmailAddresses = (input: string): string[] => {
  if (!input) return [];
  
  // Split by commas
  return input
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);
};

/**
 * Helper function to validate email address format
 */
const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * EmailComposer Component
 */
export const EmailComposer: React.FC<EmailComposerProps> = ({
  user,
  replyTo,
  onSend,
  onCancel,
  maxAttachmentSize = 10 * 1024 * 1024, // 10MB default
  allowMultipleAttachments = true,
  className = '',
  style = {}
}) => {
  // Email composition state
  const [to, setTo] = useState<string>('');
  const [cc, setCc] = useState<string>('');
  const [bcc, setBcc] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [attachments, setAttachments] = useState<Array<{
    id: string;
    file: File;
    progress?: number;
    error?: string;
  }>>([]);
  
  // UI state
  const [showCc, setShowCc] = useState<boolean>(false);
  const [showBcc, setShowBcc] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize composer state for reply
  useEffect(() => {
    if (replyTo) {
      setTo(replyTo.from.email);
      setSubject(replyTo.subject.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`);
      
      if (replyTo.body) {
        const replyBody = `
<br/><br/>
<div style="padding-left: 1rem; border-left: 2px solid #e5e7eb;">
  <p>On ${new Date().toLocaleString()}, ${replyTo.from.name} wrote:</p>
  ${replyTo.body}
</div>
`;
        setBody(replyBody);
      }
      
      // Focus on the body for replies
      // Focus happens after render, we can't focus yet
    } else {
      // Focus on the "to" field for new emails
      toInputRef.current?.focus();
    }
  }, [replyTo]);
  
  // Handle attachment selection
  const handleAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    
    // Validate file sizes
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= maxAttachmentSize;
      if (!isValidSize) {
        const sizeMB = maxAttachmentSize / (1024 * 1024);
        alert(`File ${file.name} exceeds the maximum size limit of ${sizeMB} MB.`);
      }
      return isValidSize;
    });
    
    // Check if multiple attachments are allowed
    if (!allowMultipleAttachments && attachments.length + validFiles.length > 1) {
      alert('Only one attachment is allowed.');
      return;
    }
    
    // Add valid files to attachments
    const newAttachments = validFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 11),
      file
    }));
    
    setAttachments([...attachments, ...newAttachments]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle removing an attachment
  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    // Validate "to" field
    const toEmails = parseEmailAddresses(to);
    if (toEmails.length === 0) {
      newErrors.to = 'Please specify at least one recipient';
    } else {
      const invalidEmails = toEmails.filter(email => !isValidEmail(email));
      if (invalidEmails.length > 0) {
        newErrors.to = `Invalid email${invalidEmails.length > 1 ? 's' : ''}: ${invalidEmails.join(', ')}`;
      }
    }
    
    // Validate cc emails if provided
    if (cc) {
      const ccEmails = parseEmailAddresses(cc);
      const invalidCcEmails = ccEmails.filter(email => !isValidEmail(email));
      if (invalidCcEmails.length > 0) {
        newErrors.cc = `Invalid email${invalidCcEmails.length > 1 ? 's' : ''}: ${invalidCcEmails.join(', ')}`;
      }
    }
    
    // Validate bcc emails if provided
    if (bcc) {
      const bccEmails = parseEmailAddresses(bcc);
      const invalidBccEmails = bccEmails.filter(email => !isValidEmail(email));
      if (invalidBccEmails.length > 0) {
        newErrors.bcc = `Invalid email${invalidBccEmails.length > 1 ? 's' : ''}: ${invalidBccEmails.join(', ')}`;
      }
    }
    
    // Validate subject
    if (!subject.trim()) {
      newErrors.subject = 'Please provide a subject';
    }
    
    // Update errors state
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    // Prepare the email data
    setIsSubmitting(true);
    
    const emailData = {
      to: parseEmailAddresses(to),
      cc: parseEmailAddresses(cc),
      bcc: parseEmailAddresses(bcc),
      subject,
      body,
      attachments: attachments.map(attachment => ({
        name: attachment.file.name,
        type: attachment.file.type,
        size: attachment.file.size,
        content: attachment.file
      }))
    };
    
    // Send the email
    try {
      onSend(emailData);
    } catch (error) {
      console.error('Error sending email:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${className}`}
      style={style}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            {replyTo ? 'Reply' : 'New Message'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Email form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {/* From field (non-editable) */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">From</label>
              <div className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200">
                {user.name} &lt;{user.email}&gt;
              </div>
            </div>
            
            {/* To field */}
            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="email-to" className="block text-sm text-gray-700 dark:text-gray-300">
                  To
                </label>
                {!showCc && (
                  <button
                    type="button"
                    onClick={() => setShowCc(true)}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
                  >
                    Cc
                  </button>
                )}
                {!showBcc && (
                  <button
                    type="button"
                    onClick={() => setShowBcc(true)}
                    className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 ml-2"
                  >
                    Bcc
                  </button>
                )}
              </div>
              <input
                ref={toInputRef}
                id="email-to"
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="email@example.com, another@example.com"
                className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${
                  errors.to ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.to && (
                <p className="mt-1 text-sm text-red-500">{errors.to}</p>
              )}
            </div>
            
            {/* Cc field */}
            {showCc && (
              <div>
                <label htmlFor="email-cc" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Cc
                </label>
                <input
                  id="email-cc"
                  type="text"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  placeholder="email@example.com, another@example.com"
                  className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${
                    errors.cc ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.cc && (
                  <p className="mt-1 text-sm text-red-500">{errors.cc}</p>
                )}
              </div>
            )}
            
            {/* Bcc field */}
            {showBcc && (
              <div>
                <label htmlFor="email-bcc" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Bcc
                </label>
                <input
                  id="email-bcc"
                  type="text"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  placeholder="email@example.com, another@example.com"
                  className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${
                    errors.bcc ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                {errors.bcc && (
                  <p className="mt-1 text-sm text-red-500">{errors.bcc}</p>
                )}
              </div>
            )}
            
            {/* Subject field */}
            <div>
              <label htmlFor="email-subject" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Subject
              </label>
              <input
                id="email-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                className={`w-full px-3 py-2 bg-white dark:bg-gray-700 border ${
                  errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
              )}
            </div>
            
            {/* Message body */}
            <div>
              <label htmlFor="email-body" className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                id="email-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Compose your message"
                rows={10}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* Attachments */}
            {attachments.length > 0 && (
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Attachments
                </label>
                <div className="space-y-2">
                  {attachments.map(attachment => (
                    <div
                      key={attachment.id}
                      className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
                    >
                      <MediaAttachment
                        media={{
                          type: attachment.file.type.startsWith('image/') ? 'image' :
                                 attachment.file.type.startsWith('video/') ? 'video' :
                                 attachment.file.type.startsWith('audio/') ? 'audio' : 'document',
                          url: URL.createObjectURL(attachment.file),
                          filename: attachment.file.name,
                          filesize: attachment.file.size
                        }}
                        displayStyle="icon"
                        className="flex-1"
                      />
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
        
        {/* Footer with actions */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple={allowMultipleAttachments}
              onChange={handleAttachmentSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
              Attach
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Discard
            </button>
            
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailComposer;