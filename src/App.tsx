import React, { useState, useEffect } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import AsciiTitle from './components/AsciiTitle';
import ThemeIcon from './components/ThemeIcon';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [detectedCurrency, setDetectedCurrency] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Vérifier la préférence système au chargement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Appliquer le thème au body
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  const detectCurrency = (address: string) => {
    const trimmedAddress = address.trim();
    if (trimmedAddress.startsWith('1') || trimmedAddress.startsWith('3') || trimmedAddress.startsWith('bc1')) {
      return 'btc';
    } else if (trimmedAddress.startsWith('0x')) {
      return 'eth';
    } else if (trimmedAddress.startsWith('L') || trimmedAddress.startsWith('M')) {
      return 'ltc';
    } else if (trimmedAddress.startsWith('solana:') || trimmedAddress.length === 44) {
      return 'sol';
    }
    return null;
  };

  const validateAddress = (address: string) => {
    if (address.trim()) {
      const currency = detectCurrency(address.trim());
      setDetectedCurrency(currency || '');
      setIsValid(!!currency);

      if (currency) {
        const baseUrl = window.location.origin;
        setCustomLink(`${baseUrl}/donate/${encodeURIComponent(address.trim())}`);
      } else {
        setCustomLink('');
      }
    } else {
      setDetectedCurrency('');
      setCustomLink('');
      setIsValid(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setWalletAddress(address);
    validateAddress(address);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(customLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if we're on a donate page
  const isDonatePage = window.location.pathname.startsWith('/donate/');
  const donateAddress = isDonatePage ? decodeURIComponent(window.location.pathname.split('/donate/')[1]) : '';
  const donateCurrency = isDonatePage ? detectCurrency(donateAddress) : '';

  const getCurrencyIcon = (currency: string | null) => {
    if (!currency) return null;
    try {
      const icon = require(`cryptocurrency-icons/svg/white/${currency}.svg`);
      return <img src={icon} alt={currency.toUpperCase()} className="currency-icon" />;
    } catch (e) {
      return null;
    }
  };

  if (isDonatePage) {
    return (
      <div className="App">
        <div className="particles-background">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <button 
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          <ThemeIcon isDarkMode={isDarkMode} />
        </button>
        <header className="App-header">
          <AsciiTitle />
          <div className="result-container success">
            <div className="currency-header">
              <p>Wallet Address:</p>
              {getCurrencyIcon(donateCurrency)}
            </div>
            <div className="link-box">
              <code>{donateAddress}</code>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(donateAddress);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                variant={copied ? 'success' : 'primary'}
                className={copied ? 'copied' : ''}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="qr-code-container">
              <p className="qr-code-label">Scan to donate</p>
              <QRCodeSVG value={donateAddress} size={200} />
              <div className="qr-code-currency">
                {getCurrencyIcon(donateCurrency)}
                <span>{donateCurrency?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="particles-background">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      <button 
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
      >
        <ThemeIcon isDarkMode={isDarkMode} />
      </button>
      <header className="App-header">
        <AsciiTitle />
        <div className="wallet-container">
          <div className="input-group">
            <Input
              value={walletAddress}
              onChange={handleAddressChange}
              placeholder="Entrez votre adresse de portefeuille"
              error={walletAddress !== '' ? !isValid : undefined}
              success={isValid}
            />
          </div>
          
          {isValid && customLink && (
            <div className="result-container success">
              <div className="currency-header">
                <p>Detected Currency:</p>
                {getCurrencyIcon(detectedCurrency)}
              </div>
              <div className="link-container">
                <p>Your donation link:</p>
                <div className="link-box">
                  <code>{customLink}</code>
                  <Button
                    onClick={copyToClipboard}
                    variant={copied ? 'success' : 'primary'}
                    className={copied ? 'copied' : ''}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
              <div className="qr-code-container">
                <p className="qr-code-label">Scan to donate</p>
                <QRCodeSVG value={customLink} size={200} />
                <div className="qr-code-currency">
                  {getCurrencyIcon(detectedCurrency)}
                  <span>{detectedCurrency.toUpperCase()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default App; 