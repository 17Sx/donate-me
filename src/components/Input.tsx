import React from 'react';
import './Input.css';

export interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  success?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, error, success, className }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`wallet-input ${error ? 'error' : ''} ${success ? 'success' : ''} ${className || ''}`}
    />
  );
};

export default Input; 