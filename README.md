# Savia - Smart DEX Wallet

Savia is a decentralized exchange (DEX) aggregator interface that allows users to get the best token swap rates across multiple liquidity sources using the OKX DEX API. With seamless MetaMask integration, users can easily connect their wallets, get quotes, and execute swaps.


## Features

- **Wallet Connection**: Connect with MetaMask to interact with the DEX
- **Swap Quotes**: Get real-time quotes for ETH → USDC swaps on Ethereum mainnet
- **Best Price Routing**: Automatically finds the best price across multiple DEXs
- **Clean Interface**: Simple, user-friendly interface for DeFi operations

## Upcoming Features

- [ ] Swap execution functionality
- [ ] Token selection dropdown
- [ ] Multi-chain support (Ethereum, BSC, Solana, etc.)
- [ ] Additional wallet support (WalletConnect, Phantom)
- [ ] Slippage tolerance settings
- [ ] Transaction history

## Technologies Used

- React (TypeScript)
- Material-UI (MUI) for UI components
- Ethers.js for blockchain interactions
- Axios for API requests
- OKX DEX Aggregator API

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Fatumayattani/savia.git
   cd savia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Configuration

The app is configured to work with Ethereum mainnet by default. To modify this:

1. Edit the chain ID in `src/App.tsx`
2. Update the token addresses as needed

## Usage

1. Click "Connect Wallet" to connect your MetaMask wallet
2. Enter the amount of ETH you want to swap
3. Click "Get Quote" to see the best available rate
4. (Coming soon) Execute the swap when ready

## API Reference

This project uses the [OKX DEX Aggregator API](https://www.okx.com/web3/dex-api). Key endpoints used:

- `GET /quote` - Get swap quotes
- (Future) `POST /swap/instruction` - Execute swaps

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact


## Acknowledgments

- OKX for their DEX Aggregator API
- MetaMask for wallet integration
- The Ethereum community for amazing developer tools