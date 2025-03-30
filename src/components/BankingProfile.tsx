import React, { useState } from 'react';
import { Avatar } from './Avatar';

/**
 * @component BankingProfile
 * @description Profile management interface for banking applications
 * @domain finance, banking, profile, user
 * @usage User profile management in banking and financial applications
 * 
 * @example
 * // Basic usage
 * <BankingProfile
 *   user={currentUser}
 *   onUpdateProfile={handleUpdateProfile}
 * />
 * 
 * @example
 * // Read-only mode
 * <BankingProfile
 *   user={currentUser}
 *   readonly={true}
 * />
 */
export interface BankingProfileProps {
  /** User information */
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    address?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
  };
  
  /** Function to update profile information */
  onUpdateProfile?: (profileData: Partial<BankingProfileProps['user']>) => Promise<void> | void;
  
  /** Whether the profile is read-only */
  readonly?: boolean;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * BankingProfile Component
 */
export const BankingProfile: React.FC<BankingProfileProps> = ({
  user,
  onUpdateProfile,
  readonly = false,
  className = '',
  style = {}
}) => {
  // Local form state
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    notifications: {
      email: user.notifications?.email ?? true,
      push: user.notifications?.push ?? true,
      sms: user.notifications?.sms ?? false
    }
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Track if the form has been modified
  const isFormModified = 
    formData.name !== user.name ||
    formData.email !== user.email ||
    formData.phone !== (user.phone || '') ||
    formData.address !== (user.address || '') ||
    formData.notifications.email !== (user.notifications?.email ?? true) ||
    formData.notifications.push !== (user.notifications?.push ?? true) ||
    formData.notifications.sms !== (user.notifications?.sms ?? false);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle notification toggle
  const handleNotificationToggle = (type: 'email' | 'push' | 'sms') => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!onUpdateProfile || readonly) return;
    
    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Valid email is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onUpdateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        notifications: {
          email: formData.notifications.email,
          push: formData.notifications.push,
          sms: formData.notifications.sms
        }
      });
      
      setSuccessMessage('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div 
      className={`${className}`}
      style={style}
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Profile
      </h2>
      
      {/* Profile header with avatar */}
      <div className="flex flex-col sm:flex-row items-center mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="mb-4 sm:mb-0 sm:mr-6">
          <Avatar
            name={user.name}
            src={user.avatar}
            size="xl"
          />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {user.email}
          </p>
          {user.phone && (
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {user.phone}
            </p>
          )}
        </div>
      </div>
      
      {/* Success/Error messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 dark:bg-opacity-20 text-green-700 dark:text-green-300 rounded-md">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}
      
      {/* Profile form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Personal Information Section */}
          <div className="pb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={readonly || isSubmitting}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={readonly || isSubmitting}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-500"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={readonly || isSubmitting}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-500"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                disabled={readonly || isSubmitting}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:dark:bg-gray-800 disabled:text-gray-500"
              />
            </div>
          </div>
          
          {/* Notification Preferences */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Notification Preferences
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications-email"
                  checked={formData.notifications.email}
                  onChange={() => handleNotificationToggle('email')}
                  disabled={readonly || isSubmitting}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-60"
                />
                <label htmlFor="notifications-email" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Email Notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications-push"
                  checked={formData.notifications.push}
                  onChange={() => handleNotificationToggle('push')}
                  disabled={readonly || isSubmitting}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-60"
                />
                <label htmlFor="notifications-push" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Push Notifications
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications-sms"
                  checked={formData.notifications.sms}
                  onChange={() => handleNotificationToggle('sms')}
                  disabled={readonly || isSubmitting}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-60"
                />
                <label htmlFor="notifications-sms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  SMS Notifications
                </label>
              </div>
            </div>
          </div>
          
          {/* Security Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Security
            </h3>
            
            <div className="space-y-3">
              <button
                type="button"
                disabled={readonly}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Change Password
              </button>
              
              <button
                type="button"
                disabled={readonly}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Two-Factor Authentication
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          {!readonly && onUpdateProfile && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
              <button
                type="submit"
                disabled={!isFormModified || isSubmitting}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  !isFormModified || isSubmitting
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default BankingProfile;