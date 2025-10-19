import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  isTextarea?: boolean;
  rows?: number;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  className = '',
  isTextarea = false,
  rows = 4,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label 
        htmlFor={id} 
        className="block mb-1.5 font-ui-label text-neutral-700"
      >
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      
      {isTextarea ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`form-input ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''}`}
          required={required}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${error ? 'border-danger focus:border-danger focus:ring-danger/30' : ''}`}
          required={required}
        />
      )}
      
      {error && (
        <p className="mt-1.5 text-xs text-danger">{error}</p>
      )}
    </div>
  );
};