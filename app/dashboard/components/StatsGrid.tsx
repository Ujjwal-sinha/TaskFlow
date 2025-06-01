"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Target, Star, DollarSign } from "lucide-react"
import { UserStats } from "./types"

interface StatsGridProps {
  stats: UserStats
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statsConfig = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: Send,
      color: "blue",
      delay: 0.3
    },
    {
      title: "Active Applications", 
      value: stats.activeApplications,
      icon: Target,
      color: "green",
      delay: 0.4
    },
    {
      title: "Avg. AI Match",
      value: `${stats.averageMatchScore}%`,
      icon: Star,
      color: "purple",
      delay: 0.5
    },
    {
      title: "Total Earnings",
      value: `${stats.totalEarnings} XDC`,
      icon: DollarSign,
      color: "orange",
      delay: 0.6
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: "from-blue-50 to-blue-100",
        text: "text-blue-700",
        valueText: "text-blue-800",
        iconBg: "from-blue-500 to-blue-600",
        gradient: "from-blue-400 to-blue-600",
        shadow: "rgba(59, 130, 246, 0.4)"
      },
      green: {
        bg: "from-green-50 to-green-100",
        text: "text-green-700",
        valueText: "text-green-800",
        iconBg: "from-green-500 to-green-600",
        gradient: "from-green-400 to-green-600",
        shadow: "rgba(34, 197, 94, 0.4)"
      },
      purple: {
        bg: "from-purple-50 to-purple-100",
        text: "text-purple-700",
        valueText: "text-purple-800",
        iconBg: "from-purple-500 to-purple-600",
        gradient: "from-purple-400 to-purple-600",
        shadow: "rgba(147, 51, 234, 0.4)"
      },
      orange: {
        bg: "from-orange-50 to-orange-100",
        text: "text-orange-700",
        valueText: "text-orange-800",
        iconBg: "from-orange-500 to-orange-600",
        gradient: "from-orange-400 to-orange-600",
        shadow: "rgba(251, 146, 60, 0.4)"
      }
    }
    return colorMap[color as keyof typeof colorMap]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statsConfig.map((stat, index) => {
        const colors = getColorClasses(stat.color)
        const Icon = stat.icon
        
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stat.delay }}
            whileHover={{ 
              scale: 1.02,
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
          >
            <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br ${colors.bg} overflow-hidden relative group`}>
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
              />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.p 
                      className={`text-sm ${colors.text} font-medium`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stat.delay + 0.1 }}
                    >
                      {stat.title}
                    </motion.p>
                    <motion.p 
                      className={`text-3xl font-bold ${colors.valueText}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: stat.delay + 0.2, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                  <motion.div 
                    className={`p-3 rounded-full bg-gradient-to-br ${colors.iconBg} shadow-lg`}
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 10,
                      boxShadow: `0 10px 25px -5px ${colors.shadow}`
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                <motion.div
                  className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${colors.gradient}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: stat.delay + 0.3, duration: 0.8 }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </motion.div>
  )
}