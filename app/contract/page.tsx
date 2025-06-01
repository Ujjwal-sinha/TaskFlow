"use client";

import React from 'react';
import { TaskEscrowIntegration } from '@/components/custom/TaskEscrowIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Shield, Zap, DollarSign } from 'lucide-react';

export default function ContractPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TaskEscrow Smart Contract
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Secure, decentralized task management on XDC Network
          </p>
          <div className="flex justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              XDC Apothem Testnet
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Smart Contract Powered
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Escrow Protection
            </Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Secure Escrow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Funds are locked in smart contract until task completion, ensuring both parties are protected.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Instant Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Automatic payment release upon task completion with no intermediaries or delays.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Low Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Minimal transaction fees on XDC Network, making micro-tasks economically viable.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How TaskEscrow Works</CardTitle>
            <CardDescription>
              A simple, secure process for task-based payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Post Task</h3>
                <p className="text-sm text-gray-600">
                  Client posts task with XDC reward locked in escrow
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Work Begins</h3>
                <p className="text-sm text-gray-600">
                  Freelancer starts working on the assigned task
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Complete Task</h3>
                <p className="text-sm text-gray-600">
                  Client marks task as completed when satisfied
                </p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Auto Payment</h3>
                <p className="text-sm text-gray-600">
                  Smart contract automatically releases payment
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Integration */}
        <TaskEscrowIntegration 
          onTaskPosted={(taskId, txHash) => {
            console.log('Task posted:', { taskId, txHash });
          }}
          onTaskCompleted={(taskId, txHash) => {
            console.log('Task completed:', { taskId, txHash });
          }}
          onTaskCancelled={(taskId, txHash) => {
            console.log('Task cancelled:', { taskId, txHash });
          }}
        />

        {/* Network Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>XDC Network Information</CardTitle>
            <CardDescription>
              Connect to XDC Apothem Testnet for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Network Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network Name:</span>
                    <span className="font-mono">XDC Apothem Testnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chain ID:</span>
                    <span className="font-mono">51</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RPC URL:</span>
                    <span className="font-mono">https://rpc.apothem.network</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-mono">XDC</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Useful Links</h3>
                <div className="space-y-2">
                  <a 
                    href="https://faucet.apothem.network/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    XDC Testnet Faucet
                  </a>
                  <a 
                    href="https://explorer.apothem.network/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Block Explorer
                  </a>
                  <a 
                    href="https://docs.xdc.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    XDC Documentation
                  </a>
                  <a 
                    href="https://metamask.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Install MetaMask
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to start using TaskEscrow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-sm">
              <li>
                <strong>Install MetaMask:</strong> Download and install the MetaMask browser extension
              </li>
              <li>
                <strong>Add XDC Network:</strong> The app will automatically prompt you to add XDC Apothem Testnet
              </li>
              <li>
                <strong>Get Test XDC:</strong> Visit the{' '}
                <a 
                  href="https://faucet.apothem.network/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  XDC faucet
                </a>{' '}
                to get free testnet tokens
              </li>
              <li>
                <strong>Connect Wallet:</strong> Click "Connect Wallet" above to connect your MetaMask
              </li>
              <li>
                <strong>Post a Task:</strong> Create your first task with escrow protection
              </li>
              <li>
                <strong>Test the Flow:</strong> Complete the task lifecycle to see automatic payments
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 