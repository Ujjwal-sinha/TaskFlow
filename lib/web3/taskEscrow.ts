import { ethers } from 'ethers';

// TaskEscrow contract ABI
export const TASK_ESCROW_ABI = [
  "function postTask(address _freelancer) payable returns (uint256)",
  "function completeTask(uint256 _taskId)",
  "function cancelTask(uint256 _taskId)",
  "function getTask(uint256 _taskId) view returns (uint256 taskId, address poster, address freelancer, uint256 reward, uint8 status, uint256 createdAt, uint256 completedAt)",
  "event TaskPosted(uint256 indexed taskId, address indexed poster, address indexed freelancer, uint256 reward)",
  "event TaskCompleted(uint256 indexed taskId, uint256 timestamp)",
  "event PaymentReleased(uint256 indexed taskId, address indexed freelancer, uint256 amount)",
  "event TaskCancelled(uint256 indexed taskId, address indexed poster, address indexed freelancer, uint256 reward)"
];

// XDC Apothem Testnet configuration
export const XDC_CONFIG = {
  chainId: 51,
  chainName: 'XDC Apothem Testnet',
  rpcUrl: 'https://rpc.apothem.network',
  blockExplorerUrl: 'https://explorer.apothem.network/',
  nativeCurrency: {
    name: 'XDC',
    symbol: 'XDC',
    decimals: 18,
  },
};

// Task status enum matching the smart contract
export enum TaskStatus {
  Created = 0,
  Completed = 1,
  Paid = 2,
  Cancelled = 3,
}

// TypeScript interfaces
export interface ContractTask {
  taskId: number;
  poster: string;
  freelancer: string;
  reward: bigint;
  status: TaskStatus;
  createdAt: number;
  completedAt: number;
}

export interface TaskEscrowService {
  postTask: (freelancerAddress: string, rewardAmount: string) => Promise<{ taskId: number; txHash: string }>;
  completeTask: (taskId: number) => Promise<string>;
  cancelTask: (taskId: number) => Promise<string>;
  getTask: (taskId: number) => Promise<ContractTask>;
  getContractAddress: () => string;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

class TaskEscrowServiceImpl implements TaskEscrowService {
  private contractAddress: string;
  private provider: ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress;
  }

  private async initializeProvider(): Promise<ethers.BrowserProvider> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    if (!this.provider) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }

    // Check if connected to correct network
    const network = await this.provider.getNetwork();
    if (Number(network.chainId) !== XDC_CONFIG.chainId) {
      await this.switchToXDCNetwork();
    }

    return this.provider;
  }

  private async switchToXDCNetwork(): Promise<void> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${XDC_CONFIG.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${XDC_CONFIG.chainId.toString(16)}`,
              chainName: XDC_CONFIG.chainName,
              nativeCurrency: XDC_CONFIG.nativeCurrency,
              rpcUrls: [XDC_CONFIG.rpcUrl],
              blockExplorerUrls: [XDC_CONFIG.blockExplorerUrl],
            }],
          });
        } catch (addError) {
          throw new Error('Failed to add XDC network to MetaMask');
        }
      } else {
        throw new Error('Failed to switch to XDC network');
      }
    }
  }

  private async getContract(): Promise<ethers.Contract> {
    const provider = await this.initializeProvider();
    const signer = await provider.getSigner();
    
    if (!this.contract) {
      this.contract = new ethers.Contract(this.contractAddress, TASK_ESCROW_ABI, signer);
    }

    return this.contract;
  }

  async postTask(freelancerAddress: string, rewardAmount: string): Promise<{ taskId: number; txHash: string }> {
    try {
      if (!ethers.isAddress(freelancerAddress)) {
        throw new Error('Invalid freelancer address');
      }

      const rewardWei = ethers.parseEther(rewardAmount);
      if (rewardWei <= 0) {
        throw new Error('Reward amount must be greater than 0');
      }

      const contract = await this.getContract();
      const tx = await contract.postTask(freelancerAddress, { value: rewardWei });
      
      const receipt = await tx.wait();
      
      // Extract taskId from the TaskPosted event
      const taskPostedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'TaskPosted';
        } catch {
          return false;
        }
      });

      if (!taskPostedEvent) {
        throw new Error('TaskPosted event not found in transaction receipt');
      }

      const parsedEvent = contract.interface.parseLog(taskPostedEvent);
      const taskId = Number(parsedEvent?.args[0]);

      return {
        taskId,
        txHash: tx.hash,
      };
    } catch (error: any) {
      console.error('Error posting task:', error);
      throw new Error(`Failed to post task: ${error.message}`);
    }
  }

  async completeTask(taskId: number): Promise<string> {
    try {
      const contract = await this.getContract();
      const tx = await contract.completeTask(taskId);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      console.error('Error completing task:', error);
      throw new Error(`Failed to complete task: ${error.message}`);
    }
  }

  async cancelTask(taskId: number): Promise<string> {
    try {
      const contract = await this.getContract();
      const tx = await contract.cancelTask(taskId);
      await tx.wait();
      return tx.hash;
    } catch (error: any) {
      console.error('Error cancelling task:', error);
      throw new Error(`Failed to cancel task: ${error.message}`);
    }
  }

  async getTask(taskId: number): Promise<ContractTask> {
    try {
      const contract = await this.getContract();
      const result = await contract.getTask(taskId);
      
      return {
        taskId: Number(result[0]),
        poster: result[1],
        freelancer: result[2],
        reward: result[3],
        status: Number(result[4]) as TaskStatus,
        createdAt: Number(result[5]),
        completedAt: Number(result[6]),
      };
    } catch (error: any) {
      console.error('Error getting task:', error);
      throw new Error(`Failed to get task: ${error.message}`);
    }
  }

  getContractAddress(): string {
    return this.contractAddress;
  }
}

// Create and export the service instance
export const createTaskEscrowService = (contractAddress: string): TaskEscrowService => {
  return new TaskEscrowServiceImpl(contractAddress);
};

// Utility functions
export const formatXDC = (wei: bigint): string => {
  return ethers.formatEther(wei);
};

export const parseXDC = (xdc: string): bigint => {
  return ethers.parseEther(xdc);
};

export const getTaskStatusText = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.Created:
      return 'Created';
    case TaskStatus.Completed:
      return 'Completed';
    case TaskStatus.Paid:
      return 'Paid';
    case TaskStatus.Cancelled:
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export const isWalletConnected = async (): Promise<boolean> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    return false;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  } catch {
    return false;
  }
};

export const connectWallet = async (): Promise<string> => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.getAddress();
  } catch (error: any) {
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
}; 