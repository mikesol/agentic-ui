import React, { ReactNode, useEffect, useRef } from 'react';

/**
 * @component Modal
 * @description A reusable modal dialog component with configurable header, body, and footer
 * @domain common, overlay, dialog
 * @usage Create consistent modal dialogs across applications
 * 
 * @example
 * // Basic usage
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to continue?</p>
 * </Modal>
 * 
 * @example
 * // With custom footer actions
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Edit Profile"
 *   footer={
 *     <>
 *       <Button onClick={handleClose} variant="secondary">Cancel</Button>
 *       <Button onClick={handleSave} variant="primary">Save</Button>
 *     </>
 *   }
 * >
 *   <ProfileForm />
 * </Modal>
 * 
 * @example
 * // With size and custom styling
 * <Modal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   title="Image Preview"
 *   size="lg"
 *   className="image-modal"
 * >
 *   <img src={imageUrl} alt="Preview" />
 * </Modal>
 */
export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  
  /** Function to close the modal */
  onClose: () => void;
  
  /** Modal title */
  title?: ReactNode;
  
  /** Modal content */
  children: ReactNode;
  
  /** Modal footer */
  footer?: ReactNode;
  
  /** Whether to close when clicking outside */
  closeOnOutsideClick?: boolean;
  
  /** Whether to show the close button in the header */
  showCloseButton?: boolean;
  
  /** Size of the modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /** Additional CSS classes for the modal */
  className?: string;
  
  /** Additional CSS classes for the backdrop */
  backdropClassName?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * Modal Component
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnOutsideClick = true,
  showCloseButton = true,
  size = 'md',
  className = '',
  backdropClassName = '',
  style = {}
}) => {
  // Reference to the modal content
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle Escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent scrolling the body when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Handle clicks outside the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }
  
  // Determine modal width based on size
  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return 'max-w-sm';
      case 'lg':
        return 'max-w-3xl';
      case 'xl':
        return 'max-w-5xl';
      case 'full':
        return 'max-w-full m-4';
      case 'md':
      default:
        return 'max-w-lg';
    }
  })();
  
  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${backdropClassName}`}
      onClick={handleBackdropClick}
      data-testid="modal-backdrop"
    >
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl max-h-[90vh] w-full ${sizeClasses} overflow-hidden flex flex-col ${className}`}
        style={style}
        onClick={e => e.stopPropagation()}
        data-testid="modal-content"
      >
        {/* Modal header */}
        {(title || showCloseButton) && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            {title && (
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                data-testid="modal-close-button"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Modal body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
        
        {/* Modal footer */}
        {footer && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;