"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, RefreshCw, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function WalletBalance() {
    const [balance, setBalance] = useState<{ eth: string; kushal: string } | null>(null)
    const [address, setAddress] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            toast.error("Please install MetaMask")
            return
        }

        setIsLoading(true)
        try {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const userAddress = await signer.getAddress()
            setAddress(userAddress)

            // Get ETH Balance
            const ethBalance = await provider.getBalance(userAddress)

            // Mock KUSHAL Balance for now (would normally fetch from contract)
            // In a real app, you'd use the contract address and ABI here
            const kushalBalance = "150.00"

            setBalance({
                eth: ethers.formatEther(ethBalance).slice(0, 6),
                kushal: kushalBalance
            })

            toast.success("Wallet connected")
        } catch (error) {
            console.error("Wallet connection error:", error)
            toast.error("Failed to connect wallet")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Check if already connected
        if (typeof window.ethereum !== "undefined" && (window.ethereum as any).selectedAddress) {
            connectWallet()
        }
    }, [])

    if (!address) {
        return (
            <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 mb-6">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-full">
                            <Wallet className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Connect Wallet</h3>
                            <p className="text-sm text-gray-400">View your crypto balance and trade skills</p>
                        </div>
                    </div>
                    <Button
                        onClick={connectWallet}
                        disabled={isLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30 mb-6">
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-full">
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-mono">{address.slice(0, 6)}...{address.slice(-4)}</p>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-lg">{balance?.eth} ETH</span>
                                <span className="text-gray-500">|</span>
                                <span className="font-bold text-purple-400 text-lg">{balance?.kushal} KUSHAL</span>
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={connectWallet}
                        className="text-gray-400 hover:text-white"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
