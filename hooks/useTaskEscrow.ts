import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

// Updated ABI to match your actual smart contract
const TASK_ESCROW_ABI = [
  "function postTask(string memory _title, string memory _description) payable returns (uint256)",
  "function assignTask(uint256 _taskId, address _freelancer)",
  "function completeTask(uint256 _taskId)",
  "function cancelTask(uint256 _taskId)",
  "function getTask(uint256 _taskId) view returns (uint256, address, address, uint256, uint8, uint256, uint256, uint256, string, string)",
  "function getTotalTasks() view returns (uint256)",
  "function taskExists(uint256 _taskId) view returns (bool)",
  "event TaskPosted(uint256 indexed taskId, address indexed poster, uint256 reward, string title, string description)",
  "event TaskAssigned(uint256 indexed taskId, address indexed freelancer, uint256 timestamp)",
  "event TaskCompleted(uint256 indexed taskId, uint256 timestamp)",
  "event PaymentReleased(uint256 indexed taskId, address indexed freelancer, uint256 amount)",
  "event TaskCancelled(uint256 indexed taskId, address indexed poster, uint256 reward)"
];

export enum TaskStatus {
  Created = 0,
  Assigned = 1,
  Completed = 2,
  Paid = 3,
  Cancelled = 4
}

export interface ContractTask {
  taskId: number;
  poster: string;
  freelancer: string;
  reward: bigint;
  status: TaskStatus;
  createdAt: number;
  assignedAt: number;
  completedAt: number;
  title: string;
  description: string;
}

interface UseTaskEscrowReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  currentAccount: string | null;
  
  // Contract functions
  postTask: (title: string, description: string, rewardAmount: string) => Promise<{ taskId: number; txHash: string } | null>;
  assignTask: (taskId: number, freelancerAddress: string) => Promise<string | null>;
  completeTask: (taskId: number) => Promise<string | null>;
  cancelTask: (taskId: number) => Promise<string | null>;
  getTask: (taskId: number) => Promise<ContractTask | null>;
  
  // Utility functions
  connect: () => Promise<void>;
  disconnect: () => void;
  formatReward: (reward: bigint) => string;
  getStatusText: (status: TaskStatus) => string;
}

const connectWallet = async (): Promise<string> => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('User rejected the connection request');
    }
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
};

export const useTaskEscrow = (contractAddress?: string): UseTaskEscrowReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (err) {
          console.error('Error checking wallet connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setCurrentAccount(null);
          setIsConnected(false);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }
  }, []);

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

  const getContract = useCallback(async () => {
    if (!contractAddress) {
      throw new Error('Contract address not provided');
    }

    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    return new ethers.Contract(contractAddress, TASK_ESCROW_ABI, signer);
  }, [contractAddress]);

  const postTask = useCallback(async (
    title: string,
    description: string,
    rewardAmount: string
  ): Promise<{ taskId: number; txHash: string } | null> => {
    if (!isConnected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const contract = await getContract();
      const rewardWei = ethers.parseEther(rewardAmount);
      
      const tx = await contract.postTask(title, description, { value: rewardWei });
      const receipt = await tx.wait();
      
      // Extract taskId from events
      const taskPostedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'TaskPosted';
        } catch {
          return false;
        }
      });

      let taskId = 0;
      if (taskPostedEvent) {
        const parsedEvent = contract.interface.parseLog(taskPostedEvent);
        taskId = Number(parsedEvent?.args[0]);
      }
      
      return { taskId, txHash: tx.hash };
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const assignTask = useCallback(async (taskId: number, freelancerAddress: string): Promise<string | null> => {
    if (!isConnected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const contract = await getContract();
      const tx = await contract.assignTask(taskId, freelancerAddress);
      await tx.wait();
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const completeTask = useCallback(async (taskId: number): Promise<string | null> => {
    if (!isConnected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const contract = await getContract();
      const tx = await contract.completeTask(taskId);
      await tx.wait();
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const cancelTask = useCallback(async (taskId: number): Promise<string | null> => {
    if (!isConnected) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const contract = await getContract();
      const tx = await contract.cancelTask(taskId);
      await tx.wait();
      
      return tx.hash;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getContract]);

  const getTask = useCallback(async (taskId: number): Promise<ContractTask | null> => {
    try {
      setError(null);
      
      const contract = await getContract();
      const result = await contract.getTask(taskId);
      
      return {
        taskId: Number(result[0]),
        poster: result[1],
        freelancer: result[2],
        reward: result[3],
        status: Number(result[4]) as TaskStatus,
        createdAt: Number(result[5]),
        assignedAt: Number(result[6]),
        completedAt: Number(result[7]),
        title: result[8],
        description: result[9]
      };
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [getContract]);

  const formatReward = useCallback((reward: bigint): string => {
    return ethers.formatEther(reward);
  }, []);

  const getStatusText = useCallback((status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.Created:
        return 'Open';
      case TaskStatus.Assigned:
        return 'In Progress';
      case TaskStatus.Completed:
        return 'Completed';
      case TaskStatus.Paid:
        return 'Paid';
      case TaskStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }, []);

  return {
    isConnected,
    isLoading,
    error,
    currentAccount,
    postTask,
    assignTask,
    completeTask,
    cancelTask,
    getTask,
    connect,
    disconnect,
    formatReward,
    getStatusText
  };
}; 