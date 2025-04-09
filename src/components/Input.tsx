import React from 'react';
import './Input.css';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  success?: boolean;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder, error, success }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`wallet-input ${error ? 'error' : ''} ${success ? 'success' : ''}`}
    />
  );
};

export default Input; 