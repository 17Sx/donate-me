import React from 'react';
import './CryptoLogo.css';

interface CryptoLogoProps {
  currency: string;
  size?: 'small' | 'medium' | 'large';
}

const CryptoLogo: React.FC<CryptoLogoProps> = ({ currency, size = 'medium' }) => {
  const getLogo = () => {
    switch (currency.toUpperCase()) {
      case 'BTC':
        return (
          <svg viewBox="0 0 24 24" className={`crypto-logo ${size}`}>
            <path fill="#F7931A" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            <path fill="#F7931A" d="M12 4.5c-4.136 0-7.5 3.364-7.5 7.5s3.364 7.5 7.5 7.5 7.5-3.364 7.5-7.5-3.364-7.5-7.5-7.5zm0 13.5c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z"/>
            <path fill="#F7931A" d="M12 7.5c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.015-4.5-4.5-4.5z"/>
          </svg>
        );
      case 'ETH':
        return (
          <svg viewBox="0 0 24 24" className={`crypto-logo ${size}`}>
            <path fill="#627EEA" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            <path fill="#627EEA" d="M12 4.5l-6 9 6 3.5 6-3.5-6-9z"/>
            <path fill="#627EEA" d="M12 17l-6-3.5 6 9 6-9-6 3.5z"/>
          </svg>
        );
      case 'LTC':
        return (
          <svg viewBox="0 0 24 24" className={`crypto-logo ${size}`}>
            <path fill="#345D9D" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            <path fill="#345D9D" d="M7 7l3 12 2-8 2 8 3-12-10 0z"/>
          </svg>
        );
      case 'SOL':
        return (
          <svg viewBox="0 0 24 24" className={`crypto-logo ${size}`}>
            <path fill="#00FFA3" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22c-5.523 0-10-4.477-10-10S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            <path fill="#00FFA3" d="M7 7l5 5-5 5 2 2 5-5 5 5 2-2-5-5 5-5-2-2-5 5-5-5-2 2z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return <div className="crypto-logo-container">{getLogo()}</div>;
};

export default CryptoLogo; 