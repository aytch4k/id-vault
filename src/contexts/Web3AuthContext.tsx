import * as React from 'react';
const { createContext, useContext, useState, useEffect } = React;
type ReactNode = React.ReactNode;
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { ethers } from 'ethers';

// Define the context type
interface Web3AuthContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccounts: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (to: string, amount: string) => Promise<any>;
}

// Create the context with a default value
const Web3AuthContext = createContext<Web3AuthContextType>({
  web3auth: null,
  provider: null,
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  getAccounts: async () => [],
  getBalance: async () => '0',
  signMessage: async () => '',
  sendTransaction: async () => ({}),
});

// Custom hook to use the Web3Auth context
export const useWeb3Auth = () => useContext(Web3AuthContext);

// Provider component
export const Web3AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize Web3Auth
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        
        // Get client ID from environment variable
        const clientId = '123456789abcdef'; // Hardcoded for now to fix build issues
        
        // Create chain config
        const chainId = "0x1"; // Ethereum mainnet
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId,
          rpcTarget: 'https://rpc.ankr.com/eth',
        };

        // Create private key provider
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig }
        });
        
        // Create Web3Auth instance
        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          chainConfig,
          privateKeyProvider,
          uiConfig: {
            theme: {
              primary: "#00a8ff",
            },
            loginMethodsOrder: ['google', 'facebook', 'twitter', 'email_passwordless'],
          },
        });

        // Initialize
        await web3authInstance.initModal();
        
        // Set state
        setWeb3auth(web3authInstance);
        
        // Check if user is already logged in
        if (web3authInstance.provider) {
          setProvider(web3authInstance.provider);
          const user = await web3authInstance.getUserInfo();
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing Web3Auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Login function
  const login = async () => {
    if (!web3auth) {
      console.error('Web3Auth not initialized');
      return;
    }
    try {
      setIsLoading(true);
      const provider = await web3auth.connect();
      setProvider(provider);
      const user = await web3auth.getUserInfo();
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    if (!web3auth) {
      console.error('Web3Auth not initialized');
      return;
    }
    try {
      setIsLoading(true);
      await web3auth.logout();
      setProvider(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get accounts function
  const getAccounts = async (): Promise<string[]> => {
    if (!provider) {
      console.error('Provider not initialized');
      return [];
    }
    try {
      const accounts = await provider.request({ method: 'eth_accounts' });
      return accounts as string[];
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  };

  // Get balance function
  const getBalance = async (): Promise<string> => {
    if (!provider) {
      console.error('Provider not initialized');
      return '0';
    }
    try {
      const accounts = await getAccounts();
      if (accounts.length === 0) return '0';
      
      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      });
      
      return ethers.formatEther(balance as string);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  };

  // Sign message function
  const signMessage = async (message: string): Promise<string> => {
    if (!provider) {
      console.error('Provider not initialized');
      return '';
    }
    try {
      const accounts = await getAccounts();
      if (accounts.length === 0) throw new Error('No accounts found');
      
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, accounts[0]],
      });
      
      return signature as string;
    } catch (error) {
      console.error('Error signing message:', error);
      return '';
    }
  };

  // Send transaction function
  const sendTransaction = async (to: string, amount: string): Promise<any> => {
    if (!provider) {
      console.error('Provider not initialized');
      return {};
    }
    try {
      const accounts = await getAccounts();
      if (accounts.length === 0) throw new Error('No accounts found');
      
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to,
            value: ethers.parseEther(amount).toString(),
            gas: '0x76c0', // 30400
          },
        ],
      });
      
      return { txHash };
    } catch (error) {
      console.error('Error sending transaction:', error);
      return { error: (error as Error).message };
    }
  };

  // Context value
  const value = {
    web3auth,
    provider,
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    getAccounts,
    getBalance,
    signMessage,
    sendTransaction,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
};