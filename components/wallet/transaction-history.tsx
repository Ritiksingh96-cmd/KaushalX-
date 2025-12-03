"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpRight, ArrowDownLeft, Gift, Coins } from "lucide-react"
import { format } from "date-fns"

interface Transaction {
  _id: string
  type: "earn" | "spend" | "convert" | "bonus" | "penalty"
  amount: number
  description: string
  category: string
  status: "pending" | "completed" | "failed"
  createdAt: string
  metadata?: {
    skillName?: string
    sessionDuration?: number
    cryptoType?: string
    cryptoAmount?: number
  }
}

export function TransactionHistory() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchTransactions()
    }
  }, [session])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/credits/transactions")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionIcon = (type: string, category: string) => {
    switch (type) {
      case "earn":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "spend":
      case "convert":
        return <ArrowDownLeft className="h-4 w-4 text-red-600" />
      case "bonus":
        return <Gift className="h-4 w-4 text-blue-600" />
      default:
        return <Coins className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions yet</p>
                <p className="text-sm">Start earning credits by teaching or learning skills!</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">{getTransactionIcon(transaction.type, transaction.category)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{transaction.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      {transaction.metadata?.skillName && (
                        <p className="text-xs text-blue-600 mt-1">Skill: {transaction.metadata.skillName}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        transaction.type === "earn" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "earn" ? "+" : "-"}
                      {transaction.amount.toLocaleString()} credits
                    </p>
                    {transaction.metadata?.cryptoAmount && (
                      <p className="text-xs text-muted-foreground">
                        ≈ {transaction.metadata.cryptoAmount} {transaction.metadata.cryptoType}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
