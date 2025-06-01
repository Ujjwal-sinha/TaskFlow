import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// TaskEscrow contract bytecode and ABI (you'll need to compile the contract first)
const TASK_ESCROW_ABI = [
  "constructor()",
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
const XDC_CONFIG = {
  rpcUrl: 'https://rpc.apothem.network',
  chainId: 51,
};

export async function POST(request: NextRequest) {
  try {
    const { privateKey } = await request.json();

    if (!privateKey) {
      return NextResponse.json(
        { error: 'Private key is required for deployment' },
        { status: 400 }
      );
    }

    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(XDC_CONFIG.rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInXDC = ethers.formatEther(balance);

    if (parseFloat(balanceInXDC) < 0.1) {
      return NextResponse.json(
        { 
          error: 'Insufficient balance for deployment',
          balance: balanceInXDC,
          required: '0.1 XDC minimum'
        },
        { status: 400 }
      );
    }

    // Note: In a real deployment, you would need the compiled contract bytecode
    // For now, we'll return the deployment information structure
    return NextResponse.json({
      message: 'Contract deployment initiated',
      deployer: wallet.address,
      balance: balanceInXDC,
      network: 'XDC Apothem Testnet',
      chainId: XDC_CONFIG.chainId,
      note: 'To complete deployment, run: npx hardhat run scripts/deploy.js --network apothem'
    });

  } catch (error: any) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { error: `Deployment failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return current contract address if deployed
    const contractAddress = process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS;
    
    if (!contractAddress) {
      return NextResponse.json({
        deployed: false,
        message: 'Contract not yet deployed',
        instructions: 'Use POST /api/contract/deploy to deploy the contract'
      });
    }

    // Verify contract exists on the network
    const provider = new ethers.JsonRpcProvider(XDC_CONFIG.rpcUrl);
    const code = await provider.getCode(contractAddress);
    
    if (code === '0x') {
      return NextResponse.json({
        deployed: false,
        error: 'Contract address exists but no code found',
        address: contractAddress
      });
    }

    return NextResponse.json({
      deployed: true,
      address: contractAddress,
      network: 'XDC Apothem Testnet',
      chainId: XDC_CONFIG.chainId,
      explorer: `https://explorer.apothem.network/address/${contractAddress}`
    });

  } catch (error: any) {
    console.error('Error checking contract deployment:', error);
    return NextResponse.json(
      { error: `Failed to check deployment: ${error.message}` },
      { status: 500 }
    );
  }
} 