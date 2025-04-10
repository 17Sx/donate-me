# Donate Me 🪙

<p align="center">
  <img src="https://raw.githubusercontent.com/17Sx/donate-me/main/public/favicon.ico" alt="Donate Me Logo" width="200"/>
</p>

A beautiful, modern crypto donation page generator that lets you easily create shareable links for receiving cryptocurrency donations.

## 🚀 Features

- **Multi-Currency Support**: Automatically detects and supports numerous cryptocurrencies including:

  - Bitcoin (BTC)
  - Ethereum (ETH)
  - Solana (SOL)
  - Litecoin (LTC)
  - Sui (SUI)
  - Monad (MONAD)
  - Ripple (XRP)
  - Binance Coin (BNB)
  - Cardano (ADA)
  - Dogecoin (DOGE)
  - Polkadot (DOT)
  - Tron (TRX)
  - Bitcoin Cash (BCH)
  - Monero (XMR)
  - Stellar (XLM)
  - And more...

- **ERC-20 Token Support**: For Ethereum addresses, select from various token networks:

  - Ethereum (ETH)
  - Polygon (MATIC)
  - Binance Smart Chain (BNB)
  - Base
  - USDT

- **Dynamic QR Codes**: Automatically generated for easy mobile payments

- **Shareable Links**: Create custom donation links to share with your audience

- **Dark/Light Mode**: Automatically adapts to user preferences with manual toggle option

- **Responsive Design**: Works beautifully on all devices

- **Dynamic Page Title**: Engaging typing animation in browser tab

## 🛠️ Technologies

- React
- TypeScript
- FontAwesome Icons
- QR Code Generation
- Cryptocurrency Icon Pack

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/17Sx/donate-me.git
   cd donate-me
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```bash
   npm start
   # or
   yarn start
   ```

4. The application will open in your browser at `http://localhost:3000`

## 🌐 Deployment

The application is configured to work with Vercel out of the box:

1. Create a Vercel account if you don't have one
2. Link your GitHub repository
3. Click Deploy

## 📝 Usage

1. **Creating a Donation Page**:

   - Enter your cryptocurrency wallet address in the input field
   - The system will automatically detect the cryptocurrency type
   - For Ethereum addresses, select your preferred token type
   - Copy the generated donation link or share the QR code

2. **Receiving Donations**:
   - Share your link with potential donors
   - When they visit your link, they'll see your wallet address and a QR code
   - They can easily copy your address or scan the QR code with their crypto wallet

## 💼 Use Cases

- Content creators accepting crypto tips
- Charity fundraising in cryptocurrency
- Personal donation pages
- Project funding
- Digital art sales

## 🔄 API Reference

### Currency Detection Patterns

The application uses prefix and pattern detection to identify cryptocurrency types:

```javascript
// Bitcoin (BTC)
if (trimmedAddress.startsWith('1') || trimmedAddress.startsWith('3') || trimmedAddress.startsWith('bc1'))

// Ethereum (ETH)
else if (trimmedAddress.startsWith('0x') && trimmedAddress.length === 42)

// Sui (SUI)
else if (trimmedAddress.startsWith('0x') && trimmedAddress.length === 66)

// Solana (SOL)
else if (trimmedAddress.startsWith('solana:') || (trimmedAddress.length === 44 && /^[1-9A-HJ-NP-Za-km-z]{44}$/.test(trimmedAddress)))
```

## 🎯 Future Features

- [ ] Multiple wallet addresses per donation page
- [ ] Custom donation amount suggestions
- [ ] Analytics for donation tracking
- [ ] Custom themes and branding options
- [ ] Wallet connection for direct donations
- [ ] Donation history and notifications

## 🔒 Security

- This application runs entirely client-side
- No private keys or sensitive information is ever stored
- Only public wallet addresses are used

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Made with ❤️ by [17Sx](https://github.com/17Sx)
- Icon library from [cryptocurrency-icons](https://github.com/spothq/cryptocurrency-icons)
- QR code generation using [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- Font Awesome for beautiful icons

---

<p align="center">
  <a href="https://github.com/17Sx/donate-me/issues">Report Bug</a> •
  <a href="https://github.com/17Sx/donate-me/issues">Request Feature</a>
</p>
