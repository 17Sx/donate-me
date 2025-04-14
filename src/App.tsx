import React, { useState, useEffect } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import { QRCodeSVG } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faPlus, faTrash, faArrowRight, faTimes, faExclamationTriangle, faLink, faWallet, faShield } from '@fortawesome/free-solid-svg-icons';
import { supabase } from './lib/supabase';
import './App.css';

interface Wallet {
  address: string;
  currency: string;
  verified?: boolean;
}

// Type pour Phantom Window
interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      isConnected: boolean;
      on?: (event: string, callback: () => void) => void;
      off?: (event: string, callback: () => void) => void;
    }
  }
}

declare const window: PhantomWindow;

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [customLink, setCustomLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [customSlug, setCustomSlug] = useState('');
  const [isCreatingCustomLink, setIsCreatingCustomLink] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState<string | null>(null);
  const [isCheckingWallet, setIsCheckingWallet] = useState(false);
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);
  const [verifiedWallet, setVerifiedWallet] = useState<string | null>(null);
  
  // Example wallets for demo
  const exampleWallets: Wallet[] = [
    { address: '7d7BUiFBM3BsMGHEt4nN25JSy9nYb5koqNF7EhuCVveh', currency: 'sol', verified: true },
    { address: 'bc1pr7x9k4artm0ejslkg2zfw4u4dhseeg0nl496f8gjazpfsskelfhsxl7ytj', currency: 'btc' }
  ];

  // Vérifier si Phantom est disponible
  useEffect(() => {
    const checkPhantomAvailability = () => {
      const isPhantomInstalled = window.phantom?.solana !== undefined;
      
      if (isPhantomInstalled && window.phantom?.solana) {
        // Utiliser une approche plus sûre avec TypeScript
        const provider = window.phantom.solana;
        
        // Essayons d'écouter les événements de manière sécurisée
        try {
          // @ts-ignore - Les méthodes on/off existent bien mais ne sont pas dans les types
          provider.on('connect', () => {
            setIsPhantomConnected(true);
          });
          
          // @ts-ignore - Les méthodes on/off existent bien mais ne sont pas dans les types  
          provider.on('disconnect', () => {
            setIsPhantomConnected(false);
            setVerifiedWallet(null);
          });
        } catch (error) {
          console.error('Erreur lors de la configuration des événements Phantom:', error);
        }
        
        // Check si déjà connecté
        if (provider.isConnected) {
          setIsPhantomConnected(true);
        }
      }
    };
    
    checkPhantomAvailability();
  }, []);

  // Check Supabase connection on component mount
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        // Simple test query to check if Supabase is connected
        const { error } = await supabase.from('custom_links').select('slug').limit(1);
        
        if (error && error.message.includes('connection')) {
          console.error('Supabase connection error:', error);
          setIsSupabaseConnected(false);
          setErrorMessage('Unable to connect to the database. Custom link creation is disabled.');
        }
      } catch (err) {
        console.error('Error checking Supabase connection:', err);
        setIsSupabaseConnected(false);
        setErrorMessage('Unable to connect to the database. Custom link creation is disabled.');
      }
    };
    
    checkSupabaseConnection();
  }, []);

  // Check if slug is available when it changes
  useEffect(() => {
    const checkSlugAvailability = async () => {
      if (!customSlug || customSlug.length < 3 || !isSupabaseConnected) {
        setIsSlugAvailable(null);
        return;
      }
      
      setIsCheckingSlug(true);
      
      try {
        const { data, error } = await supabase
          .from('custom_links')
          .select('slug')
          .eq('slug', customSlug)
          .maybeSingle();
          
        if (error) {
          console.error('Error checking slug:', error);
          setIsSlugAvailable(null);
        } else {
          setIsSlugAvailable(data === null);
        }
      } catch (err) {
        console.error('Error checking slug availability:', err);
        setIsSlugAvailable(null);
      } finally {
        setIsCheckingSlug(false);
      }
    };
    
    // Debounce the check to avoid too many requests
    const timeoutId = setTimeout(checkSlugAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [customSlug, isSupabaseConnected]);

  const getCurrencyIcon = (currency: string | null) => {
    if (!currency) return null;
    try {
      const icon = require(`cryptocurrency-icons/svg/white/${currency}.svg`);
      return <img src={icon} alt={currency.toUpperCase()} className="currency-icon" />;
    } catch (e) {
      console.warn(`Icon for ${currency} not found in cryptocurrency-icons package`);
      try {
        const genericIcon = require(`cryptocurrency-icons/svg/white/generic.svg`);
        return <img src={genericIcon} alt={currency.toUpperCase()} className="currency-icon" />;
      } catch (e) {
        return null;
      }
    }
  };

  const encodeAddress = (address: string): string => {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      const char = address.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 6);
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(e.target.value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDonatePage = window.location.pathname.startsWith('/d/');
  const shortHash = isDonatePage ? window.location.pathname.split('/d/')[1] : '';
  
  const shortAddresses: { [key: string]: string } = {
    'sx': '7d7BUiFBM3BsMGHEt4nN25JSy9nYb5koqNF7EhuCVveh', 
    'kratos': 'FDF8qQD8dsxw3Q1yyC3LMqzLCYD24krup4GPb1t2igkk', 
  };

  const donateAddress = isDonatePage 
    ? shortAddresses[shortHash.toLowerCase()] || '' 
    : '';
  
  // Vérifier si un wallet existe déjà dans la base
  const checkWalletExists = async (address: string): Promise<boolean> => {
    if (!isSupabaseConnected) return false;
    
    try {
      setIsCheckingWallet(true);
      
      const { data, error } = await supabase
        .from('custom_links')
        .select('slug')
        .contains('wallets', [{ address }]);
        
      if (error) {
        console.error('Error checking wallet:', error);
        return false;
      }
      
      return data && data.length > 0;
    } catch (err) {
      console.error('Error checking if wallet exists:', err);
      return false;
    } finally {
      setIsCheckingWallet(false);
    }
  };
  
  // Connecter avec Phantom
  const connectWithPhantom = async () => {
    try {
      if (!window.phantom?.solana) {
        setErrorMessage("Phantom wallet n'est pas installé. Veuillez l'installer pour continuer.");
        return;
      }
      
      const response = await window.phantom.solana.connect();
      const publicKey = response.publicKey.toString();
      setVerifiedWallet(publicKey);
      setWalletAddress(publicKey);
      
      return publicKey;
    } catch (error) {
      console.error('Erreur lors de la connexion à Phantom:', error);
      setErrorMessage("Impossible de se connecter à Phantom wallet.");
      return null;
    }
  };
  
  // Vérification humain vs bot
  const verifyHumanUser = (): boolean => {
    // Vérifier le temps écoulé depuis la dernière création
    const lastCreation = localStorage.getItem('last_link_creation');
    const now = Date.now();
    
    if (lastCreation && (now - parseInt(lastCreation)) < 300000) { // 5 minutes
      setErrorMessage("Veuillez attendre 5 minutes avant de créer un nouveau lien.");
      return false;
    }
    
    // Vérifier la complexité du slug
    if (!/[a-zA-Z]/.test(customSlug) || !/[0-9]/.test(customSlug)) {
      setErrorMessage("Le slug doit contenir au moins une lettre et un chiffre.");
      return false;
    }
    
    return true;
  };
    
  const addWallet = async () => {
    if (walletAddress.trim()) {
      setErrorMessage(null);
      
      // Vérifier si ce wallet est déjà utilisé
      const exists = await checkWalletExists(walletAddress.trim());
      
      if (exists) {
        setErrorMessage("Cette adresse de wallet est déjà utilisée dans un autre lien.");
        return;
      }
      
      // Default to ETH if we can't determine the currency
      let walletCurrency = 'eth';
      
      // Very basic currency detection based on address pattern
      if (walletAddress.match(/^[1-9A-HJ-NP-Za-km-z]{44}$/)) {
        walletCurrency = 'sol';
      } else if (walletAddress.startsWith('bc1') || walletAddress.startsWith('1') || walletAddress.startsWith('3')) {
        walletCurrency = 'btc';
      }
      
      // Vérifier si le wallet est vérifié
      const isVerified = verifiedWallet === walletAddress.trim();
      
      setWallets([...wallets, { 
        address: walletAddress.trim(), 
        currency: walletCurrency,
        verified: isVerified
      }]);
      
      setWalletAddress('');
    }
  };

  const removeWallet = (index: number) => {
    setWallets(wallets.filter((_, i) => i !== index));
  };

  const createCustomLink = async () => {
    // Clear any previous messages
    setErrorMessage(null);
    setCreationSuccess(null);
    
    if (!isSupabaseConnected) {
      setErrorMessage("Database connection is unavailable. Custom link creation is disabled.");
      return;
    }
    
    if (!customSlug) {
      setErrorMessage("Please enter a custom slug for your link.");
      return;
    }
    
    if (customSlug.length < 3) {
      setErrorMessage("Slug must be at least 3 characters long.");
      return;
    }
    
    if (wallets.length === 0) {
      setErrorMessage("Please add at least one wallet address.");
      return;
    }
    
    if (isSlugAvailable === false) {
      setErrorMessage("This slug is already taken. Please choose another one.");
      return;
    }
    
    // Vérifications anti-bot et sécurité
    if (!verifyHumanUser()) {
      return;
    }
    
    // Vérifier qu'au moins un wallet est vérifié
    const hasVerifiedWallet = wallets.some(wallet => wallet.verified);
    
    if (!hasVerifiedWallet) {
      setErrorMessage("Veuillez vérifier au moins un wallet avec Phantom pour continuer.");
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('custom_links')
        .insert([
          {
            slug: customSlug,
            wallets: wallets,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Supabase error:', error);
        
        if (error.code === '42P01') {
          setErrorMessage("The 'custom_links' table doesn't exist. Please create it in your Supabase project.");
        } else if (error.code === '23505') {
          setErrorMessage("This slug is already taken. Please choose another one.");
        } else if (error.message && error.message.includes("Failed to fetch")) {
          setErrorMessage("Connection to database failed. Please check your internet connection.");
        } else {
          setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`);
        }
        return;
      }

      // Enregistrer le timestamp de création
      localStorage.setItem('last_link_creation', Date.now().toString());
      
      const newLink = `${window.location.origin}/c/${customSlug}`;
      setCustomLink(newLink);
      setCreationSuccess(newLink);
      
      setTimeout(() => {
        setWallets([]);
        setCustomSlug('');
      }, 5000);
      
    } catch (error: any) {
      console.error('Error creating custom link:', error);
      setErrorMessage(`Connection error: ${error.message || "Unknown error"}. Please try again later.`);
    }
  };

  const isCustomPage = window.location.pathname.startsWith('/c/');
  const customSlugFromUrl = isCustomPage ? window.location.pathname.split('/c/')[1] : '';

  useEffect(() => {
    const fetchCustomLink = async () => {
      if (isCustomPage && customSlugFromUrl) {
        try {
          const { data, error } = await supabase
            .from('custom_links')
            .select('wallets')
            .eq('slug', customSlugFromUrl)
            .single();

          if (error) {
            console.error('Error fetching custom link:', error);
            return;
          }
          
          if (data && data.wallets) {
            setWallets(data.wallets);
          }
        } catch (error) {
          console.error('Error fetching custom link:', error);
        }
      }
    };

    fetchCustomLink();
  }, [isCustomPage, customSlugFromUrl]);

  if (isDonatePage) {
    return (
      <div className="App">
        <div className="grid-background">
          <div className="grid-overlay"></div>
        </div>
        <div className="particles-background">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <a href="/d/sx" className="support-link">wanna support?</a>
        <header className="App-header">
          <div className="result-container success">
            <div className="currency-header">
              <p>Wallet Address:</p>
              {getCurrencyIcon('sol')}
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
                {getCurrencyIcon('sol')}
                <span>SOL</span>
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

  if (isCustomPage && wallets.length > 0) {
    return (
      <div className="App">
        <div className="grid-background">
          <div className="grid-overlay"></div>
        </div>
        <div className="particles-background">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>
        <a href="/d/sx" className="support-link">wanna support?</a>
        <header className="App-header">
          <div className="wallets-container">
            {wallets.map((wallet, index) => (
              <div key={index} className="wallet-card">
                <div className="currency-header">
                  <p>Wallet Address:</p>
                  {getCurrencyIcon(wallet.currency)}
                  {wallet.verified && (
                    <span className="verified-badge" title="Verified wallet">
                      <FontAwesomeIcon icon={faShield} />
                    </span>
                  )}
                </div>
                <div className="link-box">
                  <code>{wallet.address}</code>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(wallet.address);
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
                  <QRCodeSVG value={wallet.address} size={200} />
                  <div className="qr-code-currency">
                    {getCurrencyIcon(wallet.currency)}
                    <span>{wallet.currency?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
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
      <div className="grid-background">
        <div className="grid-overlay"></div>
      </div>
      <div className="particles-background">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>
      <a href="/d/sx" className="support-link">wanna support?</a>
      
      {isCreatingCustomLink ? (
        <div className="create-link-page">
          <button 
            className="back-to-home"
            onClick={() => setIsCreatingCustomLink(false)}
            title="Back to home"
          >
            <FontAwesomeIcon icon={faArrowRight} rotation={180} />
          </button>
          
          {creationSuccess ? (
            <div className="success-container">
              <div className="success-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <h2>Link Created Successfully!</h2>
              <p>Your custom donation link is ready to share:</p>
              
              <div className="created-link-box">
                <code>{creationSuccess}</code>
                <Button
                  onClick={() => copyToClipboard(creationSuccess)}
                  variant={copied ? 'success' : 'primary'}
                  className={copied ? 'copied' : ''}
                >
                  <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                </Button>
              </div>
              
              <div className="qr-container">
                <QRCodeSVG value={creationSuccess} size={150} />
              </div>
              
              <div className="success-actions">
                <Button onClick={() => {
                  setCreationSuccess(null);
                  setWallets([]);
                  setCustomSlug('');
                }} variant="secondary">
                  Create Another Link
                </Button>
                <Button onClick={() => window.open(creationSuccess, '_blank')} variant="primary" className="glow-button">
                  View My Link
                </Button>
              </div>
            </div>
          ) : (
            <div className="custom-link-creator">
              <h2>Create Your Custom Donation Link</h2>
              
              {errorMessage && (
                <div className="error-message">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
                  <p>{errorMessage}</p>
                  {!isSupabaseConnected && (
                    <p className="error-help">You can still use the application to generate shortened links.</p>
                  )}
                </div>
              )}
              
              <div className="creator-steps">
                <div className="creator-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Choose your custom slug</h3>
                    <div className="input-group slug-input-group">
                      <div className="slug-prefix">
                        <span>{window.location.origin}/c/</span>
                      </div>
                      <Input
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        placeholder="my-wallets (ex: my-wallet-123)"
                        className={
                          isSlugAvailable === true ? 'slug-available' :
                          isSlugAvailable === false ? 'slug-unavailable' : ''
                        }
                      />
                      {isCheckingSlug && (
                        <div className="slug-checking">Checking...</div>
                      )}
                      {!isCheckingSlug && isSlugAvailable === true && customSlug.length >= 3 && (
                        <div className="slug-status available">
                          <FontAwesomeIcon icon={faCheck} /> Available
                        </div>
                      )}
                      {!isCheckingSlug && isSlugAvailable === false && (
                        <div className="slug-status unavailable">
                          <FontAwesomeIcon icon={faTimes} /> Already taken
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="creator-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Add wallet addresses</h3>
                    <div className="verification-section">
                      <Button 
                        onClick={connectWithPhantom}
                        variant="primary"
                        className="verify-wallet-button"
                        disabled={isPhantomConnected && !!verifiedWallet}
                      >
                        <FontAwesomeIcon icon={faWallet} /> {isPhantomConnected ? 'Phantom connecté' : 'Connecter Phantom'}
                      </Button>
                      
                      {verifiedWallet && (
                        <div className="verified-wallet-info">
                          <FontAwesomeIcon icon={faShield} className="verified-icon" />
                          <span>Wallet vérifié: {verifiedWallet.slice(0, 6)}...{verifiedWallet.slice(-4)}</span>
                        </div>
                      )}
                    </div>
                    
                    {wallets.length > 0 && (
                      <div className="wallets-list">
                        {wallets.map((wallet, index) => (
                          <div key={index} className="wallet-item">
                            <div className="wallet-info">
                              <span className="currency-tag">{wallet.currency.toUpperCase()}</span>
                              <span className="wallet-address">{wallet.address}</span>
                              {wallet.verified && (
                                <span className="verified-tag">Vérifié</span>
                              )}
                            </div>
                            <Button
                              onClick={() => removeWallet(index)}
                              variant="danger"
                              className="remove-wallet-btn"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="add-wallet-form">
                      <div className="input-group">
                        <Input
                          value={walletAddress}
                          onChange={handleAddressChange}
                          placeholder="Enter wallet address to add"
                        />
                      </div>
                      {walletAddress.trim() && (
                        <Button 
                          onClick={addWallet} 
                          variant="success" 
                          className="pulse-button"
                          disabled={isCheckingWallet}
                        >
                          <FontAwesomeIcon icon={isCheckingWallet ? faCheck : faPlus} /> 
                          {isCheckingWallet ? 'Vérification...' : 'Add Wallet'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="creator-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Create your link</h3>
                    <p className="step-description">
                      Au moins un wallet doit être vérifié via Phantom. Les liens sont limités à une création par 5 minutes.
                    </p>
                    
                    <Button 
                      onClick={createCustomLink} 
                      variant="primary" 
                      className="create-link-button glow-button"
                      disabled={
                        !isSupabaseConnected || 
                        wallets.length === 0 || 
                        !customSlug || 
                        customSlug.length < 3 || 
                        isSlugAvailable === false ||
                        !wallets.some(wallet => wallet.verified)
                      }
                    >
                      <FontAwesomeIcon icon={faLink} /> Create Custom Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="landing-page">
          <div className="hero-section">
            <div className="hero-badge">Crypto Donations Made Simple</div>
            <h1>Donate Me</h1>
            <p className="subtitle">Simplify crypto donations with shareable links</p>
            
            <div className="features">
              <div className="feature-card">
                <div className="feature-icon">✓</div>
                <h3>Short Links</h3>
                <p>Create easily shareable links</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✓</div>
                <h3>Multi-wallets</h3>
                <p>Add multiple wallets to a single link</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✓</div>
                <h3>QR Codes</h3>
                <p>Easy donation with QR codes for each address</p>
              </div>
            </div>
            
            <div className="cta-buttons">
              <Button 
                onClick={() => setIsCreatingCustomLink(true)}
                variant="primary"
                className="cta-button glow-button"
              >
                Create My Link
              </Button>
              <Button 
                onClick={() => setShowExample(!showExample)}
                variant="secondary"
                className="cta-button shine-button"
              >
                See Example
              </Button>
            </div>
          </div>
          
          {showExample && (
            <div className="example-section">
              <button 
                className="example-close-btn"
                onClick={() => setShowExample(false)}
                title="Close example"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h2>Example Donation Page</h2>
              <div className="example-container">
                <div className="wallets-container">
                  {exampleWallets.map((wallet, index) => (
                    <div key={index} className="wallet-card">
                      <div className="currency-header">
                        <p>Wallet Address:</p>
                        {getCurrencyIcon(wallet.currency)}
                        {wallet.verified && (
                          <span className="verified-badge" title="Verified wallet">
                            <FontAwesomeIcon icon={faShield} />
                          </span>
                        )}
                      </div>
                      <div className="link-box">
                        <code>{wallet.address}</code>
                        <Button
                          onClick={() => copyToClipboard(wallet.address)}
                          variant={copied ? 'success' : 'primary'}
                          className={copied ? 'copied' : ''}
                        >
                          <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                        </Button>
                      </div>
                      <div className="qr-code-container">
                        <p className="qr-code-label">Scan to donate</p>
                        <QRCodeSVG value={wallet.address} size={200} />
                        <div className="qr-code-currency">
                          {getCurrencyIcon(wallet.currency)}
                          <span>{wallet.currency.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      <footer className="App-footer">
        <p>Made with <span role="img" aria-label="love">❤️</span> by <a href="https://github.com/17Sx" target="_blank" rel="noopener noreferrer">17Sx</a></p>
      </footer>
    </div>
  );
};

export default App; 