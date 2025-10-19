import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  fullWidth = false,
}) => {
  const baseClasses = variant === 'primary' 
    ? 'btn-primary' 
    : 'btn-secondary';
  
  const sizeClasses = {
    sm: 'text-sm py-1 px-3',
    md: 'py-2 px-4',
    lg: 'text-lg py-3 px-6',
  }[size];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${sizeClasses} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.12, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.button>
  );
};