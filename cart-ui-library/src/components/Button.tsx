import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 cursor-pointer';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-900 disabled:bg-gray-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400',
  };

  const sizeStyles = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};
