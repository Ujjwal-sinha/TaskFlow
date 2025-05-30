"use client"

import { motion } from "framer-motion";
import { useState } from 'react';
import { useUser} from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3"; // Updated import
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Star, Users, Zap, ChevronDown } from "lucide-react"
// import Link from "next/link" // Link component is not used, can be removed if not needed elsewhere

export function HeroSection() {
  const [isCivicLoading, setIsCivicLoading] = useState(false);
  const [civicError, setCivicError] = useState<string | null>(null);
  const router = useRouter();
  const { user, signIn, isLoading: isUserLoading } = useUser(); // Use Civic's useUser hook

  const handleCivicLogin = async () => {
    setIsCivicLoading(true);
    setCivicError(null);
    try {
      await signIn(); // Use signIn from the hook
      // After signIn, the user object from useUser() will update.
      // We might need to wait for user to be available or handle it in a useEffect.
      // For now, let's assume signIn handles the redirect or provides user info for wallet creation.
      // The example from Civic docs suggests checking user and userHasWallet after login.
      // This part might need adjustment based on how useUser() behaves post-signIn.
      router.push('/dashboard'); // Redirect on successful signIn initiation
    } catch (err) {
      console.error('Civic login failed on hero:', err);
      setCivicError('Login failed. Please try again.');
    }
    setIsCivicLoading(false);
  };

  // Optional: useEffect to handle wallet creation after user logs in
  // import { useEffect } from 'react';
  // useEffect(() => {
  //   if (user && !userHasWallet({ user }) && !isUserLoading) { // userHasWallet might need the full context from useUser
  //     const initWallet = async () => {
  //       try {
  //         await createWallet();
  //         console.log('Wallet created successfully');
  //         router.push('/dashboard');
  //       } catch (error) {
  //         console.error('Failed to create wallet:', error);
  //         setCivicError('Failed to initialize your wallet. Please try again.');
  //       }
  //     };
  //     initWallet();
  //   }\ else if (user && userHasWallet({ user })) {
  //     router.push('/dashboard');
  //   }
  // }, [user, createWallet, router, isUserLoading]); // isUserLoading might be from useUser as well

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-apple-blue/5 py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-apple-blue/20 to-apple-purple/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-apple-green/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-apple-purple/10 rounded-full blur-3xl"></div>
      </div>

      {/* Animated shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -100, y: -100 }}
          animate={{ opacity: 0.4, x: 0, y: 0 }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-apple-blue/10 rounded-full blur-xl"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: 0.3, x: 0, y: 0 }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-apple-purple/10 rounded-full blur-xl"
        ></motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center rounded-full bg-apple-blue/10 px-4 py-2 text-sm font-medium text-apple-blue ring-1 ring-apple-blue/20">
              <Zap className="mr-2 h-4 w-4" />
              Powered by Web3 Technology
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            The Future of
            <div className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-apple-blue to-apple-purple bg-clip-text text-transparent">
                {" "}
                Freelancing
              </span>
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-2 left-0 h-3 bg-apple-blue/10 rounded-full -z-10"
              ></motion.div>
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl"
          >
            Connect with talented freelancers and clients on a decentralized platform. Secure payments, transparent
            transactions, and global opportunities await.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-apple-blue to-apple-purple hover:from-apple-blue/90 hover:to-apple-purple/90 transition-all duration-300 hover:scale-105 text-white font-medium"
              onClick={handleCivicLogin}
              disabled={isCivicLoading || isUserLoading} // Disable button also when useUser is loading
            >
              <Shield className="mr-3 h-5 w-5" />
              {isCivicLoading || isUserLoading ? 'Processing...' : 'Sign In with Civic'}
            </Button>
            {civicError && <p className="text-sm text-red-500 text-center mt-2 w-full">{civicError}</p>} 
            <Button variant="outline" size="lg" className="group">
              <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-apple-green/10 mb-4">
                <Users className="h-6 w-6 text-apple-green" />
              </div>
              <div className="text-2xl font-bold text-foreground">10K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-apple-orange/10 mb-4">
                <Star className="h-6 w-6 text-apple-orange" />
              </div>
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-apple-purple/10 mb-4">
                <Zap className="h-6 w-6 text-apple-purple" />
              </div>
              <div className="text-2xl font-bold text-foreground">$2M+</div>
              <div className="text-sm text-muted-foreground">Total Earned</div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          >
            <span className="text-sm text-muted-foreground mb-2">Scroll to explore</span>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
