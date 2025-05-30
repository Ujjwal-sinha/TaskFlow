"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Check, X, MessageSquare, DollarSign, Briefcase } from "lucide-react"
import { mockNotifications } from "@/lib/mock-data"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "task_update":
      return Briefcase
    case "payment":
      return DollarSign
    case "message":
      return MessageSquare
    default:
      return Bell
  }
}

const getNotificationColor = (type: string) => {
  switch (type) {
    case "task_update":
      return "text-apple-blue"
    case "payment":
      return "text-apple-green"
    case "message":
      return "text-apple-purple"
    default:
      return "text-muted-foreground"
  }
}

export function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-apple-red text-xs text-white flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Notifications
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-apple-blue hover:text-apple-blue/80"
              >
                Mark all as read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>Stay updated with your latest activity</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            <AnimatePresence>
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                const iconColor = getNotificationColor(notification.type)

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`border-0 shadow-sm transition-all hover:shadow-md ${
                        !notification.read ? "bg-apple-blue/5 border-l-4 border-l-apple-blue" : "bg-card"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full bg-background ${iconColor}`}>
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                              </div>

                              <div className="flex items-center space-x-1 ml-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => removeNotification(notification.id)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {notifications.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up! Check back later for updates.</p>
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
