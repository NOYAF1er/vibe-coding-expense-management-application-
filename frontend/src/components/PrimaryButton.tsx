import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

/**
 * Reusable button component
 */
export function PrimaryButton({ 
  children, 
  onClick, 
  disabled = false,
  variant = 'primary'
}: PrimaryButtonProps) {
  const baseClasses = "w-full font-bold h-14 rounded-lg flex items-center justify-center transition-opacity hover:opacity-90";
  const variantClasses = variant === 'primary'
    ? "bg-primary text-white"
    : "bg-subtle-light dark:bg-subtle-dark text-text-light dark:text-text-dark";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}
