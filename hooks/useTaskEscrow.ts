import { useState, useEffect, useCallback } from 'react';
import { 
  createTaskEscrowService, 
  TaskEscrowService, 
  ContractTask, 
  TaskStatus,
  formatXDC,
  getTaskStatusText,
  isWalletConnected,
  connectWallet
} from '@/lib/web3/taskEscrow';

interface UseTaskEscrowReturn {
  // State
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  currentAccount: string | null;
  
  // Contract interactions
  postTask: (freelancerAddress: string, rewardAmount: string) => Promise<{ taskId: number; txHash: string } | null>;
  completeTask: (taskId: number) => Promise<string | null>;
  cancelTask: (taskId: number) => Promise<string | null>;
  getTask: (taskId: number) => Promise<ContractTask | null>;
  
  // Wallet functions
  connect: () => Promise<void>;
  disconnect: () => void;
  
  // Utility functions
  formatReward: (wei: bigint) => string;
  getStatusText: (status: TaskStatus) => string;
}

export const useTaskEscrow = (contractAddress?: string): UseTaskEscrowReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [service, setService] = useState<TaskEscrowService | null>(null);

  // Initialize service when contract address is provided
  useEffect(() => {
    if (contractAddress) {
      const taskEscrowService = createTaskEscrowService(contractAddress);
      setService(taskEscrowService);
    }
  }, [contractAddress]);

  // Check wallet connection on mount
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkConnection = async () => {
    try {
      const connected = await isWalletConnected();
      setIsConnected(connected);
      
      if (connected && typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
        }
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
      setIsConnected(false);
      setCurrentAccount(null);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setCurrentAccount(null);
    } else {
      setIsConnected(true);
      setCurrentAccount(accounts[0]);
    }
    setError(null);
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes to ensure proper state
    window.location.reload();
  };

  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const address = await connectWallet();
      setCurrentAccount(address);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message);
      setIsConnected(false);
      setCurrentAccount(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setCurrentAccount(null);
    setError(null);
  }, []);

  const postTask = useCallback(async (
    freelancerAddress: string, 
    rewardAmount: string
  ): Promise<{ taskId: number; txHash: string } | null> => {
    if (!service) {
      setError('Contract service not initialized');
      return null;
    }

    if (!isConnected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await service.postTask(freelancerAddress, rewardAmount);
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service, isConnected]);

  const completeTask = useCallback(async (taskId: number): Promise<string | null> => {
    if (!service) {
      setError('Contract service not initialized');
      return null;
    }

    if (!isConnected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const txHash = await service.completeTask(taskId);
      return txHash;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service, isConnected]);

  const cancelTask = useCallback(async (taskId: number): Promise<string | null> => {
    if (!service) {
      setError('Contract service not initialized');
      return null;
    }

    if (!isConnected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const txHash = await service.cancelTask(taskId);
      return txHash;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service, isConnected]);

  const getTask = useCallback(async (taskId: number): Promise<ContractTask | null> => {
    if (!service) {
      setError('Contract service not initialized');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const task = await service.getTask(taskId);
      return task;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const formatReward = useCallback((wei: bigint): string => {
    return formatXDC(wei);
  }, []);

  const getStatusText = useCallback((status: TaskStatus): string => {
    return getTaskStatusText(status);
  }, []);

  return {
    // State
    isConnected,
    isLoading,
    error,
    currentAccount,
    
    // Contract interactions
    postTask,
    completeTask,
    cancelTask,
    getTask,
    
    // Wallet functions
    connect,
    disconnect,
    
    // Utility functions
    formatReward,
    getStatusText,
  };
}; 