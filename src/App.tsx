import React from 'react';
import './App.css';
import WalletInterface from './components/WalletInterface';

// Main App component
function App() {
  return (
    <div className="container">
      <h1 className="title">
        ID Vault - Non-custodial Wallet
      </h1>
      
      {/* Main content */}
      <div className="grid">
        <WalletInterface />
      </div>
      
      <footer className="footer">
        <p>© {new Date().getFullYear()} ID Vault - Non-custodial wallet for Cosmos SDK + IBC based and EVM compatible blockchain</p>
      </footer>
    </div>
  );
}

export default App;