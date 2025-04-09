import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'danger';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  return (
    <button
      className={`custom-button ${variant} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="button-content">{children}</span>
      <span className="button-glow" />
    </button>
  );
};

export default Button; 