"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, Bell, Briefcase, LogOut, Search, X } from "lucide-react"
import { useUser } from "@civic/auth-web3/react";
import { ethers } from "ethers";
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Settings, Home, BarChart3, Plus, MessageSquare } from 'lucide-react'

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Marketplace", href: "/marketplace", icon: Briefcase },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Post Task", href: "/post-task", icon: Plus },
  {name :"About", href: "/about", icon: MessageSquare},
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isCivicLoading, setIsCivicLoading] = useState(false);
  const [civicError, setCivicError] = useState<string | null>(null);
  const { user, signIn, signOut, isLoading: isUserLoading } = useUser();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const showWalletButton = pathname === '/dashboard' || pathname === '/marketplace';

  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setWalletAddress(accounts[0].address);
          } else {
            setIsWalletConnected(false);
            setWalletAddress(null);
          }
        } catch (error) {
          console.error("Error checking MetaMask connection:", error);
          setIsWalletConnected(false);
          setWalletAddress(null);
        }
      }
    };

    checkMetaMaskConnection();

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
        } else {
          setIsWalletConnected(false);
          setWalletAddress(null);
        }
      });
      window.ethereum.on('chainChanged', () => {
        checkMetaMaskConnection();
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCivicLogin = async () => {
    setIsCivicLoading(true);
    setCivicError(null);
    try {
      await signIn();
    } catch (err) {
      console.error('Civic login failed:', err);
      setCivicError('Login failed. Please try again.');
    }
    setIsCivicLoading(false);
  };

  const handleCivicLogout = async () => {
    setIsCivicLoading(true);
    setCivicError(null);
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      })
    } catch (err) {
      console.error('Civic logout failed:', err);
      setCivicError('Logout failed. Please try again.');
    }
    setIsCivicLoading(false);
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  }

  const linkVariants = {
    inactive: { 
      scale: 1,
      backgroundColor: "transparent",
      color: "#6b7280"
    },
    active: { 
      scale: 1.05,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      color: "#3b82f6",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(59, 130, 246, 0.05)",
      transition: {
        duration: 0.2
      }
    }
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    }
  }

  return (
    <motion.nav 
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 border-gray-200 shadow-lg' 
          : 'bg-white/60 border-transparent'
      }`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-apple-blue to-apple-purple rounded-xl flex items-center justify-center shadow-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                TaskFlow
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-2"
            variants={itemVariants}
          >
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              
              return (
                <motion.div key={item.name}>
                  <Link href={item.href}>
                    <motion.div
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                      variants={linkVariants}
                      initial="inactive"
                      animate={isActive ? "active" : "inactive"}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div
                          className="w-1.5 h-1.5 bg-apple-blue rounded-full"
                          layoutId="activeIndicator"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Right Side */}
          <motion.div 
            className="flex items-center space-x-4"
            variants={itemVariants}
          >
            {/* Search */}
            <motion.button
              className="p-2 rounded-xl bg-gray-50 hover:bg-apple-blue/10 text-apple-blue hover:text-apple-blue transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>

            {/* Notifications */}
            <motion.button
              className="relative p-2 rounded-xl bg-gray-50 hover:bg-apple-blue/10 text-apple-blue hover:text-apple-blue transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHasNewNotifications(false)}
            >
              <Bell className="h-5 w-5" />
              <AnimatePresence>
                {hasNewNotifications && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-apple-red rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      transition: { repeat: Infinity, duration: 2 }
                    }}
                    exit={{ scale: 0 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <Avatar className="h-8 w-8 ring-2 ring-apple-blue hover:ring-apple-blue transition-all duration-300">
                        <AvatarImage src={(user.avatar as string) || '/placeholder-user.jpg'} />
                        <AvatarFallback className="bg-gradient-to-br from-apple-100 to-apple-200">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div className="hidden sm:block text-left">
                      <motion.p 
                        className="text-sm font-medium"
                        whileHover={{ x: 2 }}
                      >
                        {(user.displayName as string) || (user.name as string) || 'User'}
                      </motion.p>
                      <motion.p 
                        className="text-xs text-muted-foreground"
                        whileHover={{ x: 2 }}
                      >
                        {(user.email as string) || 'Welcome back!'}
                      </motion.p>
                    </div>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-0 shadow-xl bg-white/95 backdrop-blur-xl" align="end">
                  <DropdownMenuLabel className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={(user.avatar as string) || '/placeholder-user.jpg'} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{(user.displayName as string) || (user.name as string) || 'User'}</p>
                      <p className="text-xs text-muted-foreground">
                        {(user.email as string) || 'Active Account'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-apple-blue/10 hover:text-apple-blue transition-colors duration-200">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-apple-blue/10 hover:text-apple-blue transition-colors duration-200">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleCivicLogout}
                    className="hover:bg-apple-red/10 hover:text-apple-red transition-colors duration-200"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="bg-gradient-to-r from-apple-blue to-apple-purple hover:from-apple-blue/80 hover:to-apple-purple/80 text-white shadow-lg rounded-xl">
                  Sign In
                </Button>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-xl bg-gray-50 hover:bg-apple-blue/10 text-apple-blue hover:text-apple-blue transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t bg-white/95 backdrop-blur-xl"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <motion.div
                      key={item.name}
                      variants={itemVariants}
                      custom={index}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <motion.div
                          className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-apple-blue/10 text-apple-blue shadow-sm'
                              : 'text-apple-blue hover:bg-apple-blue/10 hover:text-apple-blue'
                          }`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                          {isActive && (
                            <motion.div
                              className="ml-auto w-2 h-2 bg-apple-blue rounded-full"
                              layoutId="mobileActiveIndicator"
                            />
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

