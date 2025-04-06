# ID Vault

A non-custodial wallet for a custom blockchain that is Cosmos SDK + IBC based and EVM compatible.

## Features

- Web3Auth integration for social login and key management
- WalletConnect support for connecting to external wallets
- Support for Cosmos SDK + IBC based chains
- EVM compatibility
- Secure transaction signing
- Balance checking
- Message signing

## Technologies Used

- React with TypeScript
- Vite for fast development and building
- Web3Auth for authentication and wallet functionality
- WalletConnect for connecting to external wallets
- Ethers.js for Ethereum interactions
- CosmJS for Cosmos interactions

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Docker and Docker Compose (for containerized setup)

## Installation

### Option 1: Standard Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/id-vault.git
cd id-vault
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
VITE_WEB3AUTH_CLIENT_SECRET=your_web3auth_client_secret
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Option 2: Docker Installation (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/id-vault.git
cd id-vault
```

2. Create a `.env` file in the root directory with the following variables:
```
VITE_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
VITE_WEB3AUTH_CLIENT_SECRET=your_web3auth_client_secret
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

3. Run using the provided scripts:

For Linux/macOS:
```bash
chmod +x run-docker.sh
./run-docker.sh
```

For Windows:
```bash
run-docker.bat
```

Alternatively, you can use Docker Compose directly:
```bash
docker-compose up --build
```

### Running the Application

If using standard installation:
```bash
npm run dev
```

If using Docker:
```bash
docker-compose up
```

The application will be available at http://localhost:5173

## Usage

1. **Web3Auth Login**: Use social logins (Google, Facebook, etc.) or email to create and access your wallet.
2. **WalletConnect**: Connect to external wallets like MetaMask, Trust Wallet, etc.
3. **Cosmos Functionality**: Interact with Cosmos SDK based chains.
4. **EVM Compatibility**: Interact with EVM compatible chains.

## Project Structure

- `src/`: Source code for the application
  - `components/`: React components for the wallet interface
  - `contexts/`: Context providers for Web3Auth and WalletConnect
- `public/`: Static assets

## Security Considerations

- This wallet is non-custodial, meaning users control their private keys
- Web3Auth provides key management through social logins
- Always verify transaction details before signing
- Use secure and updated browsers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Web3Auth team for their authentication framework
- WalletConnect team for their protocol
- Cosmos SDK and IBC for interoperability