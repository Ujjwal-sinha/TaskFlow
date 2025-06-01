"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/custom/theme-toggle"
import { Menu, Bell, Briefcase, LogIn, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@civic/auth-web3/react";
import { ethers } from "ethers";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Post Task", href: "/post-task" },
  { name: "Chatbot", href: "/chatbot" },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isCivicLoading, setIsCivicLoading] = useState(false);
  const [civicError, setCivicError] = useState<string | null>(null);
  const { user, signIn, signOut, isLoading: isUserLoading } = useUser();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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
    } catch (err) {
      console.error('Civic logout failed:', err);
      setCivicError('Logout failed. Please try again.');
    }
    setIsCivicLoading(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-apple-blue to-apple-purple">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">TaskFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors hover:text-apple-blue",
                pathname === item.href ? "text-apple-blue" : "text-muted-foreground",
              )}
            >
              {item.name}
              {pathname === item.href && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-apple-blue"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-4">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-apple-red text-xs"></span>
          </Button>

          {/* Authentication Buttons */}
          {user ? (
            <Button variant="outline" onClick={handleCivicLogout} disabled={isUserLoading || isCivicLoading}>
              Sign Out
            </Button>
          ) : (
            <Link href="/" passHref>
              <Button
                variant="outline"
                onClick={handleCivicLogin}
                disabled={isCivicLoading || isUserLoading}
              >
                {isCivicLoading || isUserLoading ? 'Processing...' : 'Sign In with Civic'}
              </Button>
            </Link>
          )}

          {showWalletButton && (
            isWalletConnected ? (
              <div className="flex gap-2">
                <Button variant="outline" className="truncate max-w-[150px]">
                  {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}` : 'Wallet Connected'}
                </Button>
                <Button variant="outline" size="icon" onClick={async () => {
                  if (typeof window !== 'undefined' && window.ethereum) {
                    try {
                      // Request permissions with an empty eth_accounts to revoke existing permissions
                      await window.ethereum.request({ 
                        method: 'wallet_requestPermissions', 
                        params: [{ eth_accounts: {} }] 
                      });
                      setIsWalletConnected(false);
                      setWalletAddress(null);
                    } catch (error) {
                      console.error("Error disconnecting from MetaMask:", error);
                    }
                  }
                }}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={async () => {
                if (typeof window !== 'undefined' && window.ethereum) {
                  try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                      setIsWalletConnected(true);
                      setWalletAddress(accounts[0].address);
                    }
                  } catch (error) {
                    console.error("Error connecting to MetaMask:", error);
                  }
                }
              }}>
                Connect Wallet
              </Button>
            )
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-apple-blue/10 text-apple-blue"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  {/* Authentication Buttons for Mobile */}
                  {user ? (
                    <Button variant="outline" className="w-full" onClick={handleCivicLogout} disabled={isUserLoading || isCivicLoading}>
                      Sign Out
                    </Button>
                  ) : (
                    <Link href="/" passHref>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleCivicLogin}
                        disabled={isCivicLoading || isUserLoading}
                      >
                        {isCivicLoading || isUserLoading ? 'Processing...' : 'Sign In with Civic'}
                      </Button>
                    </Link>
                  )}
                  
                  {/* Wallet Connection for Mobile */}
                  {showWalletButton && (
                    isWalletConnected ? (
                      <div className="mt-2 space-y-2">
                        <Button variant="outline" className="w-full truncate">
                          {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)}` : 'Wallet Connected'}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={async () => {
                          if (typeof window !== 'undefined' && window.ethereum) {
                            try {
                              // Request permissions with an empty eth_accounts to revoke existing permissions
                              await window.ethereum.request({ 
                                method: 'wallet_requestPermissions', 
                                params: [{ eth_accounts: {} }] 
                              });
                              setIsWalletConnected(false);
                              setWalletAddress(null);
                            } catch (error) {
                              console.error("Error disconnecting from MetaMask:", error);
                            }
                          }
                        }}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Disconnect Wallet
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full mt-2" onClick={async () => {
                        if (typeof window !== 'undefined' && window.ethereum) {
                          try {
                            await window.ethereum.request({ method: 'eth_requestAccounts' });
                            const provider = new ethers.BrowserProvider(window.ethereum);
                            const accounts = await provider.listAccounts();
                            if (accounts.length > 0) {
                              setIsWalletConnected(true);
                              setWalletAddress(accounts[0].address);
                            }
                          } catch (error) {
                            console.error("Error connecting to MetaMask:", error);
                          }
                        }
                      }}>
                        Connect Wallet
                      </Button>
                    )
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

