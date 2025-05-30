"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Removed Avatar imports
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu" // Removed DropdownMenu imports
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/custom/theme-toggle"
import { Menu, Bell, Briefcase, LogIn } from "lucide-react" // Removed User, Settings, LogOut. Added LogIn
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Post Task", href: "/post-task" },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

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

          {/* Sign In Button */}
          <Link href="/" passHref>
            <Button variant="outline">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
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
                  {/* Sign In Button for Mobile */}
                  <Link href="/" passHref>
                    <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
