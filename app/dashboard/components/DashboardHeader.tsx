"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, CheckCircle, AlertCircle } from "lucide-react"

interface DashboardHeaderProps {
  user: any
  isConnected: boolean
  currentAccount: string | null
  onConnect: () => void
}

export function DashboardHeader({ user, isConnected, currentAccount, onConnect }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className="border-0 shadow-apple bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
                <AvatarImage 
                  src={user?.avatar || '/placeholder-user.jpg'} 
                  alt={user?.name || 'User'} 
                />
                <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {user?.name || user?.displayName || 'User'}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Ready to explore new opportunities or manage your tasks?
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Wallet Status:</span>
                {isConnected ? (
                  <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Connected
                  </Badge>
                )}
              </div>
              
              {isConnected && currentAccount && (
                <p className="text-xs text-muted-foreground font-mono">
                  {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
                </p>
              )}
              
              {!isConnected && (
                <Button onClick={onConnect} size="sm" className="mt-2">
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 