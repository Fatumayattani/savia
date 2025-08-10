# Savia 

Savia is a decentralized exchange (DEX) aggregator interface that allows users to get the best token swap rates across multiple liquidity sources using the OKX DEX API. With seamless MetaMask integration, users can easily connect their wallets, get quotes, and execute swaps.


## Features

- **Wallet Connection**: Connect with MetaMask to interact with the DEX
- **Swap Quotes**: Get real-time quotes for ETH → USDC swaps on Ethereum mainnet
- **Best Price Routing**: Automatically finds the best price across multiple DEXs
- **Clean Interface**: Simple, user-friendly interface for DeFi operations

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

3. Set up environment variables:
   Create a `.env` file in the root directory and add your OKX DEX API credentials:
   ```env
   REACT_APP_OKX_API_KEY=your_api_key_here
   REACT_APP_OKX_SECRET_KEY=your_secret_key_here
   REACT_APP_OKX_PASSPHRASE=your_passphrase_here
   ```
   

4. Start the development server:
   ```bash
   npm run start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### OKX DEX API Setup

To enable live trading functionality, you'll need to obtain API credentials from OKX:

1. **Create an OKX Account**: Visit [OKX.com](https://www.okx.com) and create an account
2. **Generate API Keys**: 
   - Go to your account settings
   - Navigate to API management
   - Create a new API key with the following settings:
     - **Permissions**: Read/Trade
     - **IP Restriction**: Add your server/development IP (optional but recommended)
     - **Passphrase**: Create a secure passphrase
3. **Configure Environment**: Add your credentials to the `.env` file as shown above

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_OKX_API_KEY` | Your OKX API key | Yes (for live trading) |
| `REACT_APP_OKX_SECRET_KEY` | Your OKX secret key | Yes (for live trading) |
| `REACT_APP_OKX_PASSPHRASE` | Your OKX API passphrase | Yes (for live trading) |

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