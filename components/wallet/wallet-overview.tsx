"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditBalance } from "@/components/credits/credit-balance"
import { CryptoConverter } from "@/components/credits/crypto-converter"
import { TransactionHistory } from "./transaction-history"
import { EarningOpportunities } from "./earning-opportunities"

export function WalletOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Wallet</h1>
        <p className="text-muted-foreground">Manage your credits, earnings, and crypto conversions</p>
      </div>

      <CreditBalance />

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="convert">Convert to Crypto</TabsTrigger>
          <TabsTrigger value="earn">Earning Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="convert">
          <CryptoConverter />
        </TabsContent>

        <TabsContent value="earn">
          <EarningOpportunities />
        </TabsContent>
      </Tabs>
    </div>
  )
}
