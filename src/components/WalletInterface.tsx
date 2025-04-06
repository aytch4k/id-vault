import React, { useState, useEffect } from 'react';
import { useWeb3Auth } from '../contexts/Web3AuthContext';
import { useWalletConnect } from '../contexts/WalletConnectContext';

// Define tab types
type TabType = 'web3auth' | 'walletconnect' | 'cosmos' | 'evm';

const WalletInterface: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<TabType>('web3auth');
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Get context hooks
  const web3auth = useWeb3Auth();
  const walletConnect = useWalletConnect();

  // Determine which provider is active
  const isWeb3AuthActive = activeTab === 'web3auth' && web3auth.isAuthenticated;
  const isWalletConnectActive = activeTab === 'walletconnect' && walletConnect.isConnected;
  const isAnyWalletActive = isWeb3AuthActive || isWalletConnectActive;

  // Effect to update address and balance when wallet changes
  useEffect(() => {
    const updateWalletInfo = async () => {
      try {
        setError('');
        
        if (isWeb3AuthActive) {
          const accounts = await web3auth.getAccounts();
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            const balance = await web3auth.getBalance();
            setBalance(balance);
          }
        } else if (isWalletConnectActive && walletConnect.session) {
          // For WalletConnect, get the address from the session
          const ethNamespace = walletConnect.session.namespaces.eip155;
          if (ethNamespace) {
            const ethAccount = ethNamespace.accounts[0].split(':')[2];
            setAddress(ethAccount);
            // Note: WalletConnect doesn't provide a direct way to get balance
            // You would need to use a provider like ethers.js with an RPC endpoint
            setBalance('Balance not available');
          }
        }
      } catch (err) {
        console.error('Error updating wallet info:', err);
        setError('Failed to update wallet information');
      }
    };

    if (isAnyWalletActive) {
      updateWalletInfo();
    } else {
      setAddress('');
      setBalance('0');
    }
  }, [isWeb3AuthActive, isWalletConnectActive, web3auth, walletConnect]);

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      setError('');
      
      if (activeTab === 'web3auth') {
        await web3auth.login();
      } else if (activeTab === 'walletconnect') {
        await walletConnect.connect();
      }
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect wallet');
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      setError('');
      
      if (isWeb3AuthActive) {
        await web3auth.logout();
      } else if (isWalletConnectActive) {
        await walletConnect.disconnect();
      }
      
      setAddress('');
      setBalance('0');
      setSignature('');
      setTxHash('');
    } catch (err) {
      console.error('Disconnection error:', err);
      setError('Failed to disconnect wallet');
    }
  };

  // Handle message signing
  const handleSignMessage = async () => {
    if (!message) {
      setError('Please enter a message to sign');
      return;
    }

    try {
      setError('');
      setSignature('');
      
      let sig = '';
      if (isWeb3AuthActive) {
        sig = await web3auth.signMessage(message);
      } else if (isWalletConnectActive) {
        sig = await walletConnect.signMessage(message);
      }
      
      setSignature(sig);
    } catch (err) {
      console.error('Signing error:', err);
      setError('Failed to sign message');
    }
  };

  // Handle transaction sending
  const handleSendTransaction = async () => {
    if (!recipient) {
      setError('Please enter a recipient address');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setError('');
      setTxHash('');
      
      let result;
      if (isWeb3AuthActive) {
        result = await web3auth.sendTransaction(recipient, amount);
      } else if (isWalletConnectActive) {
        result = await walletConnect.sendTransaction(recipient, amount);
      }
      
      if (result.error) {
        setError(result.error);
      } else if (result.txHash) {
        setTxHash(result.txHash as string);
        setRecipient('');
        setAmount('');
      }
    } catch (err) {
      console.error('Transaction error:', err);
      setError('Failed to send transaction');
    }
  };

  return (
    <div className="wallet-interface">
      {/* Tabs */}
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'web3auth' ? 'active' : ''}`}
          onClick={() => setActiveTab('web3auth')}
        >
          Web3Auth
        </div>
        <div 
          className={`tab ${activeTab === 'walletconnect' ? 'active' : ''}`}
          onClick={() => setActiveTab('walletconnect')}
        >
          WalletConnect
        </div>
        <div 
          className={`tab ${activeTab === 'cosmos' ? 'active' : ''}`}
          onClick={() => setActiveTab('cosmos')}
        >
          Cosmos
        </div>
        <div 
          className={`tab ${activeTab === 'evm' ? 'active' : ''}`}
          onClick={() => setActiveTab('evm')}
        >
          EVM
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Web3Auth Tab */}
        {activeTab === 'web3auth' && (
          <div className="wallet-section">
            <h2>Web3Auth Wallet</h2>
            {web3auth.isAuthenticated ? (
              <>
                <p>Connected with: {web3auth.user?.email || 'Unknown'}</p>
                <button onClick={handleDisconnect}>Disconnect</button>
              </>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={web3auth.isLoading}
              >
                {web3auth.isLoading ? 'Connecting...' : 'Connect with Web3Auth'}
              </button>
            )}
          </div>
        )}

        {/* WalletConnect Tab */}
        {activeTab === 'walletconnect' && (
          <div className="wallet-section">
            <h2>WalletConnect</h2>
            {walletConnect.isConnected ? (
              <>
                <p>Connected with WalletConnect</p>
                <button onClick={handleDisconnect}>Disconnect</button>
              </>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={walletConnect.isConnecting}
              >
                {walletConnect.isConnecting ? 'Connecting...' : 'Connect with WalletConnect'}
              </button>
            )}
          </div>
        )}

        {/* Cosmos Tab */}
        {activeTab === 'cosmos' && (
          <div className="wallet-section">
            <h2>Cosmos Wallet</h2>
            <p>Cosmos SDK + IBC functionality coming soon</p>
            {/* Placeholder for Cosmos-specific functionality */}
          </div>
        )}

        {/* EVM Tab */}
        {activeTab === 'evm' && (
          <div className="wallet-section">
            <h2>EVM Wallet</h2>
            <p>EVM compatibility functionality coming soon</p>
            {/* Placeholder for EVM-specific functionality */}
          </div>
        )}

        {/* Wallet Info (shown when connected) */}
        {isAnyWalletActive && (
          <>
            <div className="wallet-section">
              <h2>Wallet Information</h2>
              <div>
                <h3>Address</h3>
                <div className="wallet-address">{address}</div>
              </div>
              <div className="balance-info">
                <div className="balance-card">
                  <h3>Balance</h3>
                  <p>{balance} ETH</p>
                </div>
              </div>
            </div>

            <div className="wallet-section">
              <h2>Sign Message</h2>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <input
                  type="text"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message to sign"
                />
              </div>
              <button onClick={handleSignMessage}>Sign Message</button>
              
              {signature && (
                <div className="result-section">
                  <h3>Signature</h3>
                  <div className="wallet-address">{signature}</div>
                </div>
              )}
            </div>

            <div className="wallet-section">
              <h2>Send Transaction</h2>
              <div className="transaction-form">
                <div className="form-group">
                  <label htmlFor="recipient">Recipient Address</label>
                  <input
                    type="text"
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter recipient address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount (ETH)</label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="0"
                    step="0.001"
                  />
                </div>
                <button onClick={handleSendTransaction}>Send Transaction</button>
                
                {txHash && (
                  <div className="result-section">
                    <h3>Transaction Hash</h3>
                    <div className="wallet-address">{txHash}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Error display */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletInterface;