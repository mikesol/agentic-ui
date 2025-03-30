import React, { ReactNode } from 'react';

/**
 * @component FormField
 * @description A flexible form field component with label, validation, and various input types
 * @domain common, form, input
 * @usage Create consistent form fields across applications with built-in validation
 * 
 * @example
 * // Basic text input
 * <FormField
 *   label="Name"
 *   name="name"
 *   type="text"
 *   value={name}
 *   onChange={handleChange}
 *   required
 * />
 * 
 * @example
 * // Select field with options
 * <FormField
 *   label="Status"
 *   name="status"
 *   type="select"
 *   value={status}
 *   onChange={handleChange}
 *   options={[
 *     { value: 'active', label: 'Active' },
 *     { value: 'inactive', label: 'Inactive' }
 *   ]}
 * />
 * 
 * @example
 * // With validation error
 * <FormField
 *   label="Email"
 *   name="email"
 *   type="email"
 *   value={email}
 *   onChange={handleChange}
 *   error="Please enter a valid email address"
 * />
 */
export interface FormFieldProps {
  /** Field label */
  label: string;
  
  /** Field name attribute */
  name: string;
  
  /** Input type */
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
  
  /** Field value */
  value: string | number | boolean;
  
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  
  /** Options for select, radio group */
  options?: Array<{ value: string | number; label: string }>;
  
  /** Placeholder text */
  placeholder?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Whether the field is disabled */
  disabled?: boolean;
  
  /** Validation error message */
  error?: string;
  
  /** Helper text below the field */
  helperText?: string;
  
  /** Number of rows for textarea */
  rows?: number;
  
  /** Custom icon to display */
  icon?: ReactNode;
  
  /** Maximum length of input */
  maxLength?: number;
  
  /** Minimum length of input */
  minLength?: number;
  
  /** Field size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional CSS classes */
  className?: string;
  
  /** Label CSS classes */
  labelClassName?: string;
  
  /** Input CSS classes */
  inputClassName?: string;
  
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * FormField Component
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  options = [],
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  rows = 3,
  icon,
  maxLength,
  minLength,
  size = 'md',
  className = '',
  labelClassName = '',
  inputClassName = '',
  style = {}
}) => {
  // Generate a unique ID for the input
  const id = `field-${name}`;
  
  // Determine sizes based on size prop
  const sizeClasses = (() => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1.5 px-2';
      case 'lg':
        return 'text-base py-3 px-4';
      case 'md':
      default:
        return 'text-sm py-2 px-3';
    }
  })();
  
  // Base input classes
  const baseInputClasses = `
    w-full 
    border 
    rounded-md 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:border-blue-500 
    ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'} 
    ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} 
    ${sizeClasses}
    dark:text-white
  `;
  
  // Render the appropriate input type
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={id}
            name={name}
            value={value as string}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            minLength={minLength}
            className={`${baseInputClasses} ${inputClassName}`}
          />
        );
        
      case 'select':
        return (
          <select
            id={id}
            name={name}
            value={value as string}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`${baseInputClasses} ${inputClassName}`}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              id={id}
              name={name}
              type="checkbox"
              checked={Boolean(value)}
              onChange={onChange}
              required={required}
              disabled={disabled}
              className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 ${inputClassName}`}
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-900 dark:text-white">
              {label}
            </label>
          </div>
        );
        
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  id={`${id}-${option.value}`}
                  name={name}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  required={required}
                  disabled={disabled}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 ${inputClassName}`}
                />
                <label htmlFor={`${id}-${option.value}`} className="ml-2 block text-sm text-gray-900 dark:text-white">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className="relative">
            {icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
              </div>
            )}
            <input
              id={id}
              name={name}
              type={type}
              value={value as string}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              disabled={disabled}
              maxLength={maxLength}
              minLength={minLength}
              className={`${baseInputClasses} ${icon ? 'pl-10' : ''} ${inputClassName}`}
            />
          </div>
        );
    }
  };
  
  return (
    <div className={`mb-4 ${className}`} style={style}>
      {/* Don't show label for checkbox since it's beside the input */}
      {type !== 'checkbox' && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : ''} ${labelClassName}`}
        >
          {label}
        </label>
      )}
      
      {renderInput()}
      
      {/* Error and helper text */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;