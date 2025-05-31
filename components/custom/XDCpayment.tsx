import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../ui/use-toast';

// Replace with your deployed contract address and ABI
const CONTRACT_ADDRESS = "0xYourPaymentContractAddressHere"; 
const CONTRACT_ABI = [
  // Example ABI for a payment function
  "function makePayment(address _recipient, uint256 _amount) payable",
  "event PaymentMade(address indexed payer, address indexed recipient, uint256 amount)"
];

const RPC_URL = 'https://rpc.apothem.network';
const CHAIN_ID = 51; // XDC Apothem Testnet

declare global {
  interface Window {
    ethereum?: any;
  }
}

const XDCpayment: React.FC = () => {
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [xdcAmount, setXdcAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      checkWalletConnection();
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setWalletConnected(false);
      toast({
        title: "Wallet Disconnected",
        description: "Please connect your MetaMask wallet.",
        variant: "destructive",
      });
    } else {
      setWalletConnected(true);
      toast({
        title: "Wallet Connected",
        description: `Connected with account: ${accounts[0].substring(0, 6)}...${accounts[0].slice(-4)}`,
      });
    }
  };

  const handleChainChanged = (chainId: string) => {
    const currentChainId = parseInt(chainId, 16);
    if (currentChainId !== CHAIN_ID) {
      toast({
        title: "Wrong Network",
        description: `Please switch to XDC Apothem Testnet (Chain ID: ${CHAIN_ID}). Current: ${currentChainId}`,
        variant: "destructive",
      });
      setWalletConnected(false); 
    } else {
      toast({
        title: "Correct Network",
        description: "Connected to XDC Apothem Testnet.",
      });
      checkWalletConnection(); 
    }
  };

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletConnected(true);
          const network = await provider.getNetwork();
          if (Number(network.chainId) !== CHAIN_ID) {
            toast({
              title: "Wrong Network",
              description: `Please switch to XDC Apothem Testnet (Chain ID: ${CHAIN_ID}). Current: ${network.chainId}`,
              variant: "destructive",
            });
            setWalletConnected(false);
          }
        } else {
          setWalletConnected(false);
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err);
        setWalletConnected(false);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this feature.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (Number(network.chainId) !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${CHAIN_ID.toString(16)}`,
              chainName: 'XDC Apothem Testnet',
              nativeCurrency: {
                name: 'XDC',
                symbol: 'XDC',
                decimals: 18,
              },
              rpcUrls: [RPC_URL],
              blockExplorerUrls: ['https://explorer.apothem.network/'],
            }],
          });
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
          setWalletConnected(true);
          toast({
            title: "Network Switched",
            description: "Successfully switched to XDC Apothem Testnet.",
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            toast({
              title: "Network Not Added",
              description: "Could not add XDC Apothem Testnet to MetaMask. Please add it manually.",
              variant: "destructive",
            });
          } else if (switchError.code === 4001) {
            toast({
              title: "Connection Rejected",
              description: "User rejected the network switch request.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Network Error",
              description: `Failed to switch network: ${switchError.message}`,
              variant: "destructive",
            });
          }
          setWalletConnected(false);
        }
      } else {
        setWalletConnected(true);
        toast({
          title: "Wallet Connected",
          description: "MetaMask connected successfully.",
        });
      }
    } catch (err: any) {
      console.error("Error connecting to MetaMask:", err);
      if (err.code === 4001) {
        setError("Connection rejected by user.");
        toast({
          title: "Connection Rejected",
          description: "User rejected the connection request.",
          variant: "destructive",
        });
      } else {
        setError(`Failed to connect wallet: ${err.message}`);
        toast({
          title: "Connection Failed",
          description: `Failed to connect wallet: ${err.message}`,
          variant: "destructive",
        });
      }
      setWalletConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your MetaMask wallet first.",
        variant: "destructive",
      });
      return;
    }

    if (!ethers.isAddress(recipientAddress)) {
      setError("Invalid recipient address.");
      toast({
        title: "Invalid Address",
        description: "Please enter a valid recipient's XDC address.",
        variant: "destructive",
      });
      return;
    }

    const paymentAmountWei = ethers.parseEther(xdcAmount || '0');
    if (paymentAmountWei === BigInt(0)) {
      setError("Payment amount cannot be zero.");
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid XDC payment amount.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);
    setTransactionHash(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.makePayment(recipientAddress, paymentAmountWei, {
        value: paymentAmountWei, // Sending XDC as msg.value
      });

      setTransactionHash(tx.hash);
      toast({
        title: "Transaction Sent",
        description: `Transaction hash: ${tx.hash}`,
      });

      await tx.wait(); 

      toast({
        title: "Payment Successful!",
        description: `Transaction confirmed: ${tx.hash}`,
        variant: "default",
      });
      setRecipientAddress('');
      setXdcAmount('');
    } catch (err: any) {
      console.error("Error making payment:", err);
      if (err.code === 4001) {
        setError("Transaction rejected by user.");
        toast({
          title: "Transaction Rejected",
          description: "User rejected the transaction.",
          variant: "destructive",
        });
      } else {
        setError(`Failed to make payment: ${err.message}`);
        toast({
          title: "Transaction Failed",
          description: `Failed to make payment: ${err.message}`,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Make XDC Payment</CardTitle>
        <CardDescription>Send XDC to a recipient via smart contract.</CardDescription>
      </CardHeader>
      <CardContent>
        {!walletConnected ? (
          <div className="text-center">
            <p className="mb-4">Connect your MetaMask wallet to make a payment.</p>
            <Button onClick={connectWallet} disabled={loading}>
              {loading ? 'Connecting...' : 'Connect MetaMask'}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="recipientAddress">Recipient Address</Label>
              <Input
                id="recipientAddress"
                type="text"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                required
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="xdcAmount">XDC Amount (e.g., 10.5)</Label>
              <Input
                id="xdcAmount"
                type="number"
                step="any"
                placeholder="0.0"
                value={xdcAmount}
                onChange={(e) => setXdcAmount(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processing Payment...' : 'Make Payment'}
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
            {transactionHash && (
              <p className="text-green-500 text-sm mt-2">
                Transaction sent! Hash: <a href={`https://explorer.apothem.network/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="underline">
                  {transactionHash.substring(0, 6)}...{transactionHash.slice(-4)}
                </a>
              </p>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default XDCpayment;