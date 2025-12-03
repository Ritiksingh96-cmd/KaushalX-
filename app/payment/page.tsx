"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Coins, Shield, Clock, CheckCircle, AlertCircle, Copy, ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaymentMethod {
  id: string
  name: string
  symbol: string
  icon: string
  network: string
  address: string
  qrCode: string
  minAmount: number
  maxAmount: number
  processingTime: string
  fees: {
    network: number
    platform: number
  }
}

interface PaymentRequest {
  skillId: string
  skillTitle: string
  instructorName: string
  amount: number
  currency: string
  description: string
}

const cryptoMethods: PaymentMethod[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "🔷",
    network: "Ethereum Mainnet",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e",
    qrCode: "/placeholder.svg?key=eth-qr",
    minAmount: 0.001,
    maxAmount: 10,
    processingTime: "5-15 minutes",
    fees: {
      network: 0.002,
      platform: 0.025,
    },
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    network: "Bitcoin Network",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    qrCode: "/placeholder.svg?key=btc-qr",
    minAmount: 0.0001,
    maxAmount: 1,
    processingTime: "10-30 minutes",
    fees: {
      network: 0.0001,
      platform: 0.025,
    },
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    icon: "💚",
    network: "Ethereum (ERC-20)",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e",
    qrCode: "/placeholder.svg?key=usdt-qr",
    minAmount: 1,
    maxAmount: 10000,
    processingTime: "5-15 minutes",
    fees: {
      network: 2,
      platform: 0.025,
    },
  },
  {
    id: "kaushal",
    name: "KAUSHAL Token",
    symbol: "KAUSHAL",
    icon: "🚀",
    network: "Polygon Network",
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e",
    qrCode: "/placeholder.svg?key=kaushal-qr",
    minAmount: 10,
    maxAmount: 100000,
    processingTime: "1-3 minutes",
    fees: {
      network: 0.1,
      platform: 0.01,
    },
  },
]

export default function PaymentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(() => {
    const currency = searchParams.get("currency") || "KAUSHAL"
    return cryptoMethods.find((m) => m.symbol === currency) || cryptoMethods[0]
  })
  const [paymentAmount, setPaymentAmount] = useState(() => searchParams.get("amount") || "")
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "completed" | "failed">("pending")
  const [transactionHash, setTransactionHash] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(900) // 15 minutes

  // Get payment request from URL params
  const paymentRequest: PaymentRequest = {
    skillId: searchParams.get("skillId") || "",
    skillTitle: searchParams.get("skillTitle") || "React Development Course",
    instructorName: searchParams.get("instructor") || "Priya Sharma",
    amount: Number.parseFloat(searchParams.get("amount") || "500"),
    currency: searchParams.get("currency") || "KAUSHAL",
    description: searchParams.get("description") || "Skill enrollment payment",
  }

  useEffect(() => {
    // Countdown timer for payment expiry
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification in real app
  }

  const handlePaymentSubmit = async () => {
    setPaymentStatus("processing")

    try {
      const response = await fetch("/api/payment/crypto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillId: paymentRequest.skillId,
          amount: Number.parseFloat(paymentAmount),
          currency: selectedMethod.symbol,
          paymentMethod: selectedMethod.id,
          walletAddress: selectedMethod.address,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTransactionHash(data.transactionHash)
        setPaymentStatus("completed")

        // Redirect to success page after 3 seconds
        setTimeout(() => {
          router.push(`/payment/success?tx=${data.transactionHash}`)
        }, 3000)
      } else {
        setPaymentStatus("failed")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentStatus("failed")
    }
  }

  const totalAmount = Number.parseFloat(paymentAmount || "0")
  const networkFee = selectedMethod.fees.network
  const platformFee = totalAmount * selectedMethod.fees.platform
  const finalAmount = totalAmount + networkFee + platformFee

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Crypto Payment</h1>
          <p className="text-xl text-muted-foreground">Secure blockchain payments for skill enrollment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{paymentRequest.skillTitle}</h4>
                    <p className="text-sm text-muted-foreground">by {paymentRequest.instructorName}</p>
                  </div>
                  <Badge variant="secondary">Skill Course</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Course Price</span>
                    <span>
                      {paymentRequest.amount} {paymentRequest.currency}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Network Fee</span>
                    <span>
                      {networkFee} {selectedMethod.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform Fee ({(selectedMethod.fees.platform * 100).toFixed(1)}%)</span>
                    <span>
                      {platformFee.toFixed(4)} {selectedMethod.symbol}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span>
                      {finalAmount.toFixed(4)} {selectedMethod.symbol}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Payment Method</CardTitle>
                <CardDescription>Choose your preferred cryptocurrency</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={selectedMethod.id}
                  onValueChange={(value) => {
                    const method = cryptoMethods.find((m) => m.id === value)
                    if (method) setSelectedMethod(method)
                  }}
                >
                  <TabsList className="grid w-full grid-cols-4">
                    {cryptoMethods.map((method) => (
                      <TabsTrigger key={method.id} value={method.id} className="flex items-center gap-2">
                        <span className="text-lg">{method.icon}</span>
                        {method.symbol}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {cryptoMethods.map((method) => (
                    <TabsContent key={method.id} value={method.id} className="mt-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-muted-foreground">Network</Label>
                            <p className="font-medium">{method.network}</p>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Processing Time</Label>
                            <p className="font-medium">{method.processingTime}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-muted-foreground">Wallet Address</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input value={method.address} readOnly className="font-mono text-sm" />
                            <Button size="sm" variant="outline" onClick={() => copyToClipboard(method.address)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-sm">Security Features</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Multi-signature wallet protection</li>
                            <li>• Real-time transaction monitoring</li>
                            <li>• Automatic refund for failed payments</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Payment Status */}
          <div className="space-y-6">
            {/* Timer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Payment Timer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{formatTime(timeRemaining)}</div>
                  <p className="text-sm text-muted-foreground">Time remaining to complete payment</p>
                  {timeRemaining < 300 && (
                    <Badge variant="destructive" className="mt-2">
                      Payment expires soon!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle>QR Code Payment</CardTitle>
                <CardDescription>Scan with your crypto wallet</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                  <img
                    src={selectedMethod.qrCode || "/placeholder.svg"}
                    alt="Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Scan this QR code with your {selectedMethod.name} wallet
                </p>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    {paymentStatus === "pending" && (
                      <>
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <span>Waiting for payment...</span>
                      </>
                    )}
                    {paymentStatus === "processing" && (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span>Processing payment...</span>
                      </>
                    )}
                    {paymentStatus === "completed" && (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>Payment completed!</span>
                      </>
                    )}
                    {paymentStatus === "failed" && (
                      <>
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <span>Payment failed</span>
                      </>
                    )}
                  </div>

                  {transactionHash && (
                    <div>
                      <Label className="text-muted-foreground">Transaction Hash</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={transactionHash} readOnly className="font-mono text-xs" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://etherscan.io/tx/${transactionHash}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handlePaymentSubmit}
                    disabled={paymentStatus === "processing" || paymentStatus === "completed"}
                  >
                    {paymentStatus === "processing"
                      ? "Processing..."
                      : paymentStatus === "completed"
                        ? "Payment Completed"
                        : "Confirm Payment"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
