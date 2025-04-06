import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SignClient from '@walletconnect/sign-client';
import { Web3Modal } from '@walletconnect/modal';
import { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';

// Define the context type
interface WalletConnectContextType {
  signClient: SignClient | null;
  session: SessionTypes.Struct | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (to: string, amount: string) => Promise<any>;
}

// Create the context with a default value
const WalletConnectContext = createContext<WalletConnectContextType>({
  signClient: null,
  session: null,
  isConnecting: false,
  isConnected: false,
  connect: async () => {},
  disconnect: async () => {},
  signMessage: async () => '',
  sendTransaction: async () => ({}),
});

// Custom hook to use the WalletConnect context
export const useWalletConnect = () => useContext(WalletConnectContext);

// Provider component
export const WalletConnectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);

  // Initialize WalletConnect
  useEffect(() => {
    const init = async () => {
      try {
        // Create SignClient
        const client = await SignClient.init({
          projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '', // WalletConnect project ID
          metadata: {
            name: 'ID Vault',
            description: 'Non-custodial wallet for Cosmos SDK + IBC based and EVM compatible blockchain',
            url: 'https://id-vault.example.com',
            icons: ['https://example.com/logo.png'],
          },
        });

        // Create Web3Modal
        const modal = new Web3Modal({
          projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '', // WalletConnect project ID
          themeMode: 'dark',
          themeColor: 'green',
          walletConnectVersion: 2,
        });

        setSignClient(client);
        setWeb3Modal(modal);

        // Subscribe to session events
        client.on('session_delete', () => {
          setSession(null);
          setIsConnected(false);
        });

        // Check if there's an active session
        const lastKeyIndex = client.session.getAll().length - 1;
        if (lastKeyIndex >= 0) {
          const lastSession = client.session.getAll()[lastKeyIndex];
          setSession(lastSession);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error initializing WalletConnect:', error);
      }
    };

    init();
  }, []);

  // Connect function
  const connect = async () => {
    if (!signClient || !web3Modal) {
      console.error('WalletConnect not initialized');
      return;
    }

    try {
      setIsConnecting(true);

      // Define required namespaces
      const requiredNamespaces = {
        eip155: {
          methods: [
            'eth_sendTransaction',
            'eth_signTransaction',
            'eth_sign',
            'personal_sign',
            'eth_signTypedData',
          ],
          chains: ['eip155:1'], // Ethereum mainnet
          events: ['chainChanged', 'accountsChanged'],
        },
        cosmos: {
          methods: [
            'cosmos_signDirect',
            'cosmos_signAmino',
          ],
          chains: ['cosmos:cosmoshub-4'], // Cosmos Hub
          events: ['chainChanged', 'accountsChanged'],
        },
      };

      // Create connection
      const { uri, approval } = await signClient.connect({
        requiredNamespaces,
      });

      // Open modal if URI is available
      if (uri) {
        web3Modal.openModal({ uri });
        const session = await approval();
        setSession(session);
        setIsConnected(true);
        web3Modal.closeModal();
      }
    } catch (error) {
      console.error('Error connecting with WalletConnect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect function
  const disconnect = async () => {
    if (!signClient || !session) {
      console.error('WalletConnect not initialized or no active session');
      return;
    }

    try {
      await signClient.disconnect({
        topic: session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
      
      setSession(null);
      setIsConnected(false);
    } catch (error) {
      console.error('Error disconnecting from WalletConnect:', error);
    }
  };

  // Sign message function
  const signMessage = async (message: string): Promise<string> => {
    if (!signClient || !session) {
      console.error('WalletConnect not initialized or no active session');
      return '';
    }

    try {
      // Get Ethereum accounts
      const ethAccounts = session.namespaces.eip155?.accounts[0]?.split(':')[2];
      if (!ethAccounts) throw new Error('No Ethereum accounts found');

      // Sign message
      const result = await signClient.request({
        topic: session.topic,
        chainId: 'eip155:1',
        request: {
          method: 'personal_sign',
          params: [message, ethAccounts],
        },
      });

      return result as string;
    } catch (error) {
      console.error('Error signing message with WalletConnect:', error);
      return '';
    }
  };

  // Send transaction function
  const sendTransaction = async (to: string, amount: string): Promise<any> => {
    if (!signClient || !session) {
      console.error('WalletConnect not initialized or no active session');
      return {};
    }

    try {
      // Get Ethereum accounts
      const ethNamespace = session.namespaces.eip155;
      if (!ethNamespace) throw new Error('No Ethereum namespace found');
      
      const ethAccount = ethNamespace.accounts[0].split(':')[2];
      if (!ethAccount) throw new Error('No Ethereum account found');

      // Convert amount to wei (assuming amount is in ETH)
      const amountInWei = BigInt(parseFloat(amount) * 10**18).toString(16);

      // Send transaction
      const result = await signClient.request({
        topic: session.topic,
        chainId: 'eip155:1',
        request: {
          method: 'eth_sendTransaction',
          params: [
            {
              from: ethAccount,
              to,
              value: `0x${amountInWei}`,
              gas: '0x76c0', // 30400
            },
          ],
        },
      });

      return { txHash: result };
    } catch (error) {
      console.error('Error sending transaction with WalletConnect:', error);
      return { error: (error as Error).message };
    }
  };

  // Context value
  const value = {
    signClient,
    session,
    isConnecting,
    isConnected,
    connect,
    disconnect,
    signMessage,
    sendTransaction,
  };

  return (
    <WalletConnectContext.Provider value={value}>
      {children}
    </WalletConnectContext.Provider>
  );
};