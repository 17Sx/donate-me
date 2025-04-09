import React, { useState } from 'react';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [detectedCurrency, setDetectedCurrency] = useState<string | null>(null);
  const [customLink, setCustomLink] = useState<string>('');

  const detectCurrency = (address: string) => {
    // Bitcoin
    if (address.match(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/)) {
      return 'BTC';
    }
    // Ethereum
    if (address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return 'ETH';
    }
    // Litecoin
    if (address.match(/^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/)) {
      return 'LTC';
    }
    // Solana
    if (address.match(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/)) {
      return 'SOL';
    }
    return null;
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setWalletAddress(address);
    const currency = detectCurrency(address);
    setDetectedCurrency(currency);
    
    if (currency) {
      const baseUrl = window.location.origin;
      setCustomLink(`${baseUrl}/donate/${currency}/${address}`);
    } else {
      setCustomLink('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(customLink);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Donate Me</h1>
        <div className="input-container">
          <input
            type="text"
            value={walletAddress}
            onChange={handleAddressChange}
            placeholder="Entrez votre adresse de wallet"
            className="wallet-input"
          />
        </div>
        
        {detectedCurrency && (
          <div className="result-container">
            <p>Devise détectée : {detectedCurrency}</p>
            <div className="link-container">
              <p>Votre lien de don :</p>
              <div className="link-box">
                <code>{customLink}</code>
                <button onClick={copyToClipboard} className="copy-button">
                  Copier
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App; 