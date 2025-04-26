import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Simple App component
const App = () => {
  return (
    <div className="container">
      <h1 className="title">ID Vault - Non-custodial Wallet</h1>
      <div className="grid">
        <div className="card">
          <h2>Welcome to ID Vault</h2>
          <p>A non-custodial wallet for Cosmos SDK + IBC based and EVM compatible blockchain</p>
          <p>This is a simplified version of the application to fix build issues.</p>
        </div>
      </div>
      <footer className="footer">
        <p>© {new Date().getFullYear()} ID Vault</p>
      </footer>
    </div>
  );
};

// Render the app
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);