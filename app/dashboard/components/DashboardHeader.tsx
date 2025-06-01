"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, User } from "lucide-react"

interface DashboardHeaderProps {
  user: any
  currentAccount: string | null
  isConnected: boolean
  onConnect: () => void
}

export function DashboardHeader({ user, currentAccount, isConnected, onConnect }: DashboardHeaderProps) {
  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Freelancer Dashboard</h1>
            <p className="text-muted-foreground">
              Discover opportunities and manage your applications
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Hello, {String(user?.displayName || user?.name || 'User')}!
              </p>
              {currentAccount && (
                <p className="text-sm text-muted-foreground font-mono">
                  {currentAccount.substring(0, 6)}...{currentAccount.slice(-4)}
                </p>
              )}
            </div>
            <Avatar className="h-12 w-12">
              <AvatarImage src={(user?.avatar as string) || '/placeholder-user.jpg'} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </motion.div>

      {/* Wallet Connection */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-800">Connect Your Wallet</h3>
                    <p className="text-sm text-orange-700">
                      Connect MetaMask to apply for tasks and manage applications
                    </p>
                  </div>
                </div>
                <Button onClick={onConnect} className="bg-orange-600 hover:bg-orange-700">
                  Connect Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </>
  )
}