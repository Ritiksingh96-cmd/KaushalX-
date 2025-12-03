"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, TrendingUp, Users, Lock } from "lucide-react"
import { motion } from "framer-motion"

interface TokenStatsProps {
    userBalance: number
}

export function TokenStats({ userBalance }: TokenStatsProps) {
    const stats = [
        {
            title: "Your Balance",
            value: `${userBalance} KAUSHAL`,
            description: "Available for trade",
            icon: Coins,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
        },
        {
            title: "Total Supply",
            value: "2,000,000,000",
            description: "Fixed Cap",
            icon: Lock,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            title: "Public Allocation",
            value: "1,000,000,000",
            description: "Airdrops & Rewards",
            icon: Users,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
        {
            title: "Owner Reserve",
            value: "1,000,000,000",
            description: "Locked for ecosystem",
            icon: TrendingUp,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    )
}
