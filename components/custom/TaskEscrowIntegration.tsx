import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useTaskEscrow } from '@/hooks/useTaskEscrow';
import { ContractTask, TaskStatus } from '@/lib/web3/taskEscrow';
import { Loader2, ExternalLink, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';

interface TaskEscrowIntegrationProps {
  contractAddress?: string;
  onTaskPosted?: (taskId: number, txHash: string) => void;
  onTaskCompleted?: (taskId: number, txHash: string) => void;
  onTaskCancelled?: (taskId: number, txHash: string) => void;
}

export const TaskEscrowIntegration: React.FC<TaskEscrowIntegrationProps> = ({
  contractAddress = process.env.NEXT_PUBLIC_TASK_ESCROW_ADDRESS || '',
  onTaskPosted,
  onTaskCompleted,
  onTaskCancelled,
}) => {
  const {
    isConnected,
    isLoading,
    error,
    currentAccount,
    postTask,
    completeTask,
    cancelTask,
    getTask,
    connect,
    disconnect,
    formatReward,
    getStatusText,
  } = useTaskEscrow(contractAddress);

  const { toast } = useToast();

  // Form state for posting new tasks
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [rewardAmount, setRewardAmount] = useState('');
  
  // State for viewing existing tasks
  const [taskId, setTaskId] = useState('');
  const [currentTask, setCurrentTask] = useState<ContractTask | null>(null);

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (err) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handlePostTask = async () => {
    if (!freelancerAddress || !rewardAmount) {
      toast({
        title: "Missing Information",
        description: "Please provide freelancer address and reward amount",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await postTask(freelancerAddress, rewardAmount);
      if (result) {
        toast({
          title: "Task Posted Successfully!",
          description: `Task ID: ${result.taskId}, TX: ${result.txHash.substring(0, 10)}...`,
        });
        
        // Clear form
        setFreelancerAddress('');
        setRewardAmount('');
        
        // Callback to parent component
        onTaskPosted?.(result.taskId, result.txHash);
      }
    } catch (err) {
      toast({
        title: "Failed to Post Task",
        description: error || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleGetTask = async () => {
    if (!taskId) {
      toast({
        title: "Missing Task ID",
        description: "Please enter a task ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const task = await getTask(parseInt(taskId));
      if (task) {
        setCurrentTask(task);
        toast({
          title: "Task Retrieved",
          description: `Task ${task.taskId} loaded successfully`,
        });
      }
    } catch (err) {
      toast({
        title: "Failed to Get Task",
        description: error || "Task not found",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (taskIdToComplete: number) => {
    try {
      const txHash = await completeTask(taskIdToComplete);
      if (txHash) {
        toast({
          title: "Task Completed!",
          description: `Transaction: ${txHash.substring(0, 10)}...`,
        });
        
        // Refresh task data
        const updatedTask = await getTask(taskIdToComplete);
        if (updatedTask) {
          setCurrentTask(updatedTask);
        }
        
        onTaskCompleted?.(taskIdToComplete, txHash);
      }
    } catch (err) {
      toast({
        title: "Failed to Complete Task",
        description: error || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleCancelTask = async (taskIdToCancel: number) => {
    try {
      const txHash = await cancelTask(taskIdToCancel);
      if (txHash) {
        toast({
          title: "Task Cancelled",
          description: `Transaction: ${txHash.substring(0, 10)}...`,
        });
        
        // Refresh task data
        const updatedTask = await getTask(taskIdToCancel);
        if (updatedTask) {
          setCurrentTask(updatedTask);
        }
        
        onTaskCancelled?.(taskIdToCancel, txHash);
      }
    } catch (err) {
      toast({
        title: "Failed to Cancel Task",
        description: error || "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Created:
        return <Clock className="h-4 w-4" />;
      case TaskStatus.Completed:
      case TaskStatus.Paid:
        return <CheckCircle className="h-4 w-4" />;
      case TaskStatus.Cancelled:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Created:
        return "bg-blue-100 text-blue-800";
      case TaskStatus.Completed:
      case TaskStatus.Paid:
        return "bg-green-100 text-green-800";
      case TaskStatus.Cancelled:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!contractAddress) {
    return (
      <Alert>
        <AlertDescription>
          TaskEscrow contract address not configured. Please set NEXT_PUBLIC_TASK_ESCROW_ADDRESS in your environment variables.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            XDC TaskEscrow Contract
          </CardTitle>
          <CardDescription>
            Interact with the TaskEscrow smart contract on XDC Apothem Testnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                Connect your MetaMask wallet to interact with the contract
              </p>
              <Button onClick={handleConnect} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Connected Account</p>
                  <p className="text-sm text-gray-600 font-mono">
                    {currentAccount?.substring(0, 6)}...{currentAccount?.slice(-4)}
                  </p>
                </div>
                <Button variant="outline" onClick={disconnect}>
                  Disconnect
                </Button>
              </div>
              
              <div className="text-xs text-gray-500">
                Contract: {contractAddress.substring(0, 10)}...{contractAddress.slice(-6)}
                <a 
                  href={`https://explorer.apothem.network/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Post New Task */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>Post New Task</CardTitle>
            <CardDescription>
              Create a new task with escrow payment on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="freelancer">Freelancer Address</Label>
              <Input
                id="freelancer"
                placeholder="0x..."
                value={freelancerAddress}
                onChange={(e) => setFreelancerAddress(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="reward">Reward Amount (XDC)</Label>
              <Input
                id="reward"
                type="number"
                step="0.01"
                placeholder="1.0"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
              />
            </div>
            <Button 
              onClick={handlePostTask} 
              disabled={isLoading || !freelancerAddress || !rewardAmount}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Task...
                </>
              ) : (
                'Post Task with Escrow'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* View Existing Task */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>View Task</CardTitle>
            <CardDescription>
              Look up an existing task by its ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Task ID"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
              />
              <Button onClick={handleGetTask} disabled={isLoading || !taskId}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Task'}
              </Button>
            </div>

            {currentTask && (
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Task #{currentTask.taskId}</h3>
                  <Badge className={getStatusColor(currentTask.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(currentTask.status)}
                      {getStatusText(currentTask.status)}
                    </span>
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Poster</p>
                    <p className="font-mono text-gray-600">
                      {currentTask.poster.substring(0, 10)}...{currentTask.poster.slice(-6)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Freelancer</p>
                    <p className="font-mono text-gray-600">
                      {currentTask.freelancer.substring(0, 10)}...{currentTask.freelancer.slice(-6)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Reward</p>
                    <p className="text-green-600 font-semibold">
                      {formatReward(currentTask.reward)} XDC
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Created</p>
                    <p className="text-gray-600">
                      {new Date(currentTask.createdAt * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Task Actions */}
                {currentAccount && currentTask.status === TaskStatus.Created && (
                  <div className="flex gap-2 pt-2">
                    {currentAccount.toLowerCase() === currentTask.poster.toLowerCase() && (
                      <>
                        <Button
                          onClick={() => handleCompleteTask(currentTask.taskId)}
                          disabled={isLoading}
                          size="sm"
                        >
                          Complete Task
                        </Button>
                        <Button
                          onClick={() => handleCancelTask(currentTask.taskId)}
                          disabled={isLoading}
                          variant="destructive"
                          size="sm"
                        >
                          Cancel Task
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 