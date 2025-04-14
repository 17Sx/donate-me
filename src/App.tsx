import React, { useState, useEffect } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import AsciiTitle from './components/AsciiTitle';
import ThemeIcon from './components/ThemeIcon';
import { QRCodeSVG } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [detectedCurrency, setDetectedCurrency] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isEthereumAddress, setIsEthereumAddress] = useState(false);
  const [selectedERC20Token, setSelectedERC20Token] = useState('eth');

  useEffect(() => {
    // Vérifier la préférence système au chargement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  useEffect(() => {
    // Appliquer le thème au body
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  const getCurrencyIcon = (currency: string | null) => {
    if (!currency) return null;
    try {
      // Vérifier d'abord dans le dossier des icônes disponibles
      const icon = require(`cryptocurrency-icons/svg/white/${currency}.svg`);
      return <img src={icon} alt={currency.toUpperCase()} className="currency-icon" />;
    } catch (e) {
      // Utiliser une icône générique ou alternative si l'icône n'est pas disponible
      console.warn(`Icon for ${currency} not found in cryptocurrency-icons package`);
      try {
        const genericIcon = require(`cryptocurrency-icons/svg/white/generic.svg`);
        return <img src={genericIcon} alt={currency.toUpperCase()} className="currency-icon" />;
      } catch (e) {
        return null;
      }
    }
  };

  const detectCurrency = (address: string) => {
    const trimmedAddress = address.trim();
    
    // Bitcoin (BTC)
    if (trimmedAddress.startsWith('1') || trimmedAddress.startsWith('3') || trimmedAddress.startsWith('bc1')) {
      return 'btc';
    } 
    // Sui (SUI)
    else if (trimmedAddress.startsWith('0x') && trimmedAddress.length === 66) {
      return 'sui';
    }
    // Ethereum (ETH) et tokens ERC-20/BEP-20
    else if (trimmedAddress.startsWith('0x') && trimmedAddress.length === 42) {
      setIsEthereumAddress(true);
      return selectedERC20Token; // Retourne le token sélectionné par l'utilisateur
    } 
    // Litecoin (LTC)
    else if (trimmedAddress.startsWith('L') || trimmedAddress.startsWith('M') || trimmedAddress.startsWith('ltc1')) {
      return 'ltc';
    } 
    // Solana (SOL)
    else if (trimmedAddress.startsWith('solana:') || (trimmedAddress.length === 44 && /^[1-9A-HJ-NP-Za-km-z]{44}$/.test(trimmedAddress))) {
      return 'sol';
    }
    // Monad (MONAD) - Assumant que les adresses commencent par 'monad:' ou 'mn1'
    else if (trimmedAddress.startsWith('monad:') || trimmedAddress.startsWith('mn1')) {
      return 'monad';
    }
    // Ripple (XRP)
    else if (trimmedAddress.startsWith('r') && trimmedAddress.length >= 25 && trimmedAddress.length <= 35) {
      return 'xrp';
    }
    // Binance Coin (BNB)
    else if (trimmedAddress.startsWith('bnb')) {
      return 'bnb';
    }
    // Cardano (ADA)
    else if (trimmedAddress.startsWith('addr1') || trimmedAddress.startsWith('DdzFF')) {
      return 'ada';
    }
    // Dogecoin (DOGE)
    else if (trimmedAddress.startsWith('D') && trimmedAddress.length >= 33 && trimmedAddress.length <= 34) {
      return 'doge';
    }
    // Polkadot (DOT)
    else if (trimmedAddress.startsWith('1') && trimmedAddress.length >= 45 && trimmedAddress.length <= 48) {
      return 'dot';
    }
    // Tron (TRX)
    else if (trimmedAddress.startsWith('T') && trimmedAddress.length === 34) {
      return 'trx';
    }
    // Bitcoin Cash (BCH)
    else if (trimmedAddress.startsWith('q') || trimmedAddress.startsWith('p') || trimmedAddress.startsWith('bitcoincash:')) {
      return 'bch';
    }
    // Monero (XMR)
    else if (trimmedAddress.startsWith('4') && trimmedAddress.length >= 95) {
      return 'xmr';
    }
    // Stellar (XLM)
    else if (trimmedAddress.startsWith('G') && trimmedAddress.length === 56) {
      return 'xlm';
    }
    // Avalanche (AVAX)
    else if (trimmedAddress.startsWith('X-avax')) {
      return 'avax';
    }
    // Cosmos (ATOM)
    else if (trimmedAddress.startsWith('cosmos')) {
      return 'atom';
    }
    // Chainlink (LINK) - utilise le format ETH
    // Uniswap (UNI) - utilise le format ETH
    // Aave (AAVE) - utilise le format ETH
    // Tous ces tokens utilisent des adresses Ethereum, donc détectés comme ETH
    
    return null;
  };

  // Fonction pour générer un hash court
  const generateShortHash = (address: string): string => {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      const char = address.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    // Utiliser base62 (0-9, a-z, A-Z) pour des identifiants plus courts
    const base62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    let num = Math.abs(hash);
    
    do {
      result = base62[num % 62] + result;
      num = Math.floor(num / 62);
    } while (num > 0);
    
    return result.substring(0, 6); // Limiter à 6 caractères
  };

  const validateAddress = (address: string) => {
    if (address.trim()) {
      const currency = detectCurrency(address.trim());
      setDetectedCurrency(currency || '');
      setIsValid(!!currency);

      if (currency) {
        const baseUrl = window.location.origin;
        const shortHash = generateShortHash(address.trim());
        setCustomLink(`${baseUrl}/d/${shortHash}`);
      } else {
        setCustomLink('');
      }
    } else {
      setDetectedCurrency('');
      setCustomLink('');
      setIsValid(false);
      setIsEthereumAddress(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setWalletAddress(address);
    validateAddress(address);
  };

  const handleTokenChange = (token: string) => {
    setSelectedERC20Token(token);
    if (walletAddress.trim()) {
      setDetectedCurrency(token);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(customLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sauvegarder l'adresse de support dans le localStorage
  useEffect(() => {
    const supportAddress = "7d7BUiFBM3BsMGHEt4nN25JSy9nYb5koqNF7EhuCVveh";
    const supportHash = "17Sx";
    localStorage.setItem(`address_${supportHash}`, supportAddress);
  }, []);

  // Check if we're on a donate page
  const isDonatePage = window.location.pathname.startsWith('/d/');
  const shortHash = isDonatePage ? window.location.pathname.split('/d/')[1] : '';
  const donateAddress = isDonatePage ? localStorage.getItem(`address_${shortHash}`) || '' : '';
  const donateCurrency = isDonatePage ? detectCurrency(donateAddress) : '';

  // Sauvegarder l'adresse dans le localStorage quand on génère un lien
  useEffect(() => {
    if (isValid && walletAddress.trim()) {
      const shortHash = generateShortHash(walletAddress.trim());
      localStorage.setItem(`address_${shortHash}`, walletAddress.trim());
    }
  }, [isValid, walletAddress]);

  if (isDonatePage) {
    return (
      <div className="App">
        <div className="particles-background">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <a href="/d/17Sx" className="support-link">wanna support?</a>
        <button 
          className="theme-toggle"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
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
        <footer className="App-footer">
          <p>Made with <span role="img" aria-label="love">❤️</span> by <a href="https://github.com/17Sx" target="_blank" rel="noopener noreferrer">17Sx</a></p>
        </footer>
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
      <a href="/d/17Sx" className="support-link">wanna support</a>
      <button 
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
              placeholder="Enter your wallet address"
              error={walletAddress !== '' ? !isValid : undefined}
              success={isValid}
            />
          </div>
          
          {isEthereumAddress && (
            <div className="token-selector">
              <p>Choose your token:</p>
              <div className="token-buttons">
                <Button
                  onClick={() => handleTokenChange('eth')}
                  variant={selectedERC20Token === 'eth' ? 'success' : 'primary'}
                >
                  ETH
                </Button>
                <Button
                  onClick={() => handleTokenChange('matic')}
                  variant={selectedERC20Token === 'matic' ? 'success' : 'primary'}
                >
                  MATIC
                </Button>
                <Button
                  onClick={() => handleTokenChange('bnb')}
                  variant={selectedERC20Token === 'bnb' ? 'success' : 'primary'}
                >
                  BNB
                </Button>
                <Button
                  onClick={() => handleTokenChange('base')}
                  variant={selectedERC20Token === 'base' ? 'success' : 'primary'}
                >
                  BASE
                </Button>
                <Button
                  onClick={() => handleTokenChange('usdt')}
                  variant={selectedERC20Token === 'usdt' ? 'success' : 'primary'}
                >
                  USDT
                </Button>
              </div>
            </div>
          )}
          
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
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
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
      <footer className="App-footer">
      <p>Made with <span role="img" aria-label="love">❤️</span> by <a href="https://github.com/17Sx" target="_blank" rel="noopener noreferrer">17Sx</a></p>
      </footer>
    </div>
  );
};

export default App; 