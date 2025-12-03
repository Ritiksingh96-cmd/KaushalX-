"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ExternalLink, Download, ArrowRight, Coins, Clock, Shield } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"

interface PaymentStatus {
  transactionHash: string
  status: string
  confirmations: number
  blockNumber: number
  gasUsed: string
  gasPrice: string
  timestamp: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const transactionHash = searchParams.get("tx")

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!transactionHash) return

      try {
        const response = await fetch(`/api/payment/crypto?tx=${transactionHash}`)
        if (response.ok) {
          const data = await response.json()
          setPaymentStatus(data.paymentStatus)
        }
      } catch (error) {
        console.error("Error fetching payment status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaymentStatus()
  }, [transactionHash])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">Your crypto payment has been confirmed on the blockchain</p>
        </div>

        <div className="space-y-6">
          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentStatus && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge className="bg-green-100 text-green-800">{paymentStatus.status}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmations</p>
                      <p className="font-medium">{paymentStatus.confirmations}/12</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Hash</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                        {paymentStatus.transactionHash}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(`https://etherscan.io/tx/${paymentStatus.transactionHash}`, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Block Number</p>
                      <p className="font-medium">{paymentStatus.blockNumber.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gas Used</p>
                      <p className="font-medium">{Number.parseInt(paymentStatus.gasUsed).toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-medium">{new Date(paymentStatus.timestamp).toLocaleString()}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Enrollment Confirmed</h4>
                  <p className="text-sm text-muted-foreground">
                    You've been automatically enrolled in the skill course
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Access Available</h4>
                  <p className="text-sm text-muted-foreground">Course materials are now accessible in your dashboard</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Receipt Sent</h4>
                  <p className="text-sm text-muted-foreground">Payment receipt has been sent to your email</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>

          {/* Support */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your payment or course access, our support team is here to help.
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
