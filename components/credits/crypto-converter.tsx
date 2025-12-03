"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRightLeft, Wallet, AlertCircle } from "lucide-react"
import { toast } from "sonner"

const CRYPTO_RATES = {
  BTC: { rate: 0.000023, symbol: "₿", name: "Bitcoin" },
  ETH: { rate: 0.00035, symbol: "Ξ", name: "Ethereum" },
  USDT: { rate: 0.01, symbol: "USDT", name: "Tether" },
  BNB: { rate: 0.000045, symbol: "BNB", name: "Binance Coin" },
}

export function CryptoConverter() {
  const { data: session } = useSession()
  const [creditsAmount, setCreditsAmount] = useState("")
  const [cryptoType, setCryptoType] = useState<keyof typeof CRYPTO_RATES>("USDT")
  const [walletAddress, setWalletAddress] = useState("")
  const [loading, setLoading] = useState(false)

  const cryptoAmount = creditsAmount ? Number.parseFloat(creditsAmount) * CRYPTO_RATES[cryptoType].rate : 0

  const handleConvert = async () => {
    if (!session?.user?.id) {
      toast.error("Please sign in to convert credits")
      return
    }

    if (!creditsAmount || !walletAddress) {
      toast.error("Please fill in all fields")
      return
    }

    if (Number.parseFloat(creditsAmount) < 100) {
      toast.error("Minimum conversion is 100 credits")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/credits/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creditsAmount: Number.parseFloat(creditsAmount),
          cryptoType,
          walletAddress,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(data.message)
        setCreditsAmount("")
        setWalletAddress("")
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      toast.error("Failed to process conversion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Convert Credits to Crypto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Minimum conversion: 100 credits. Processing takes 24-48 hours.</AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="credits">Credits Amount</Label>
          <Input
            id="credits"
            type="number"
            placeholder="Enter credits to convert"
            value={creditsAmount}
            onChange={(e) => setCreditsAmount(e.target.value)}
            min="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="crypto">Cryptocurrency</Label>
          <Select value={cryptoType} onValueChange={(value: keyof typeof CRYPTO_RATES) => setCryptoType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CRYPTO_RATES).map(([key, crypto]) => (
                <SelectItem key={key} value={key}>
                  {crypto.symbol} {crypto.name} ({key})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wallet">Wallet Address</Label>
          <Input
            id="wallet"
            placeholder="Enter your wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>

        {creditsAmount && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">You will receive:</span>
              <span className="font-semibold">
                {CRYPTO_RATES[cryptoType].symbol}
                {cryptoAmount.toFixed(8)} {cryptoType}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">Conversion rate:</span>
              <span className="text-sm">
                1 credit = {CRYPTO_RATES[cryptoType].rate} {cryptoType}
              </span>
            </div>
          </div>
        )}

        <Button onClick={handleConvert} disabled={loading || !creditsAmount || !walletAddress} className="w-full">
          <Wallet className="h-4 w-4 mr-2" />
          {loading ? "Processing..." : "Convert to Crypto"}
        </Button>
      </CardContent>
    </Card>
  )
}
