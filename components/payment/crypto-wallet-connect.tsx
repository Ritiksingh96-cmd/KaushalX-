"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, ExternalLink, CheckCircle, AlertCircle } from "lucide-react"

interface WalletOption {
  id: string
  name: string
  icon: string
  description: string
  installed: boolean
  supported: boolean
}

const walletOptions: WalletOption[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Most popular Ethereum wallet",
    installed: typeof window !== "undefined" && !!(window as any).ethereum,
    supported: true,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Connect with mobile wallets",
    installed: true,
    supported: true,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Coinbase's self-custody wallet",
    installed: false,
    supported: true,
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Mobile-first crypto wallet",
    installed: false,
    supported: true,
  },
]

interface CryptoWalletConnectProps {
  onConnect: (walletId: string, address: string) => void
}

export function CryptoWalletConnect({ onConnect }: CryptoWalletConnectProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)

  const connectWallet = async (walletId: string) => {
    setConnecting(walletId)

    try {
      if (walletId === "metamask") {
        if (typeof window !== "undefined" && (window as any).ethereum) {
          const accounts = await (window as any).ethereum.request({
            method: "eth_requestAccounts",
          })

          if (accounts.length > 0) {
            setConnectedWallet(walletId)
            onConnect(walletId, accounts[0])
          }
        } else {
          // Redirect to MetaMask installation
          window.open("https://metamask.io/download/", "_blank")
        }
      } else {
        // Simulate connection for other wallets
        setTimeout(() => {
          const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`
          setConnectedWallet(walletId)
          onConnect(walletId, mockAddress)
        }, 2000)
      }
    } catch (error) {
      console.error("Wallet connection error:", error)
    } finally {
      setConnecting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Connect Crypto Wallet
        </CardTitle>
        <CardDescription>Connect your wallet to make secure crypto payments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {walletOptions.map((wallet) => (
          <div
            key={wallet.id}
            className={`p-4 border rounded-lg transition-colors ${
              connectedWallet === wallet.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {wallet.name}
                    {connectedWallet === wallet.id && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </h4>
                  <p className="text-sm text-muted-foreground">{wallet.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!wallet.installed && wallet.supported && (
                  <Badge variant="outline" className="text-xs">
                    Not Installed
                  </Badge>
                )}
                {!wallet.supported && (
                  <Badge variant="destructive" className="text-xs">
                    Coming Soon
                  </Badge>
                )}

                {connectedWallet === wallet.id ? (
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant={wallet.installed ? "default" : "outline"}
                    disabled={!wallet.supported || connecting === wallet.id}
                    onClick={() => connectWallet(wallet.id)}
                  >
                    {connecting === wallet.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : wallet.installed ? (
                      "Connect"
                    ) : (
                      <>
                        Install
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Security Notice</p>
              <p>
                Always verify the website URL before connecting your wallet. KAUSHALX will never ask for your private
                keys or seed phrase.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
