"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, Building2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

export function WalletConnect() {
    const [isConnected, setIsConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState("")
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)

    const connectWallet = async () => {
        if (typeof window !== "undefined" && (window as any).ethereum) {
            try {
                const accounts = await (window as any).ethereum.request({
                    method: "eth_requestAccounts",
                })
                setWalletAddress(accounts[0])
                setIsConnected(true)
                toast.success("Wallet connected successfully!")
            } catch (error) {
                toast.error("Failed to connect wallet")
            }
        } else {
            toast.error("MetaMask is not installed")
        }
    }

    const handleWithdraw = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Withdrawal request submitted successfully!")
        setIsWithdrawOpen(false)
    }

    return (
        <div className="flex gap-2">
            {!isConnected ? (
                <Button onClick={connectWallet} variant="outline" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                </Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" disabled>
                        <Wallet className="h-4 w-4" />
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </Button>

                    <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Building2 className="h-4 w-4" />
                                Withdraw
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Withdraw to Bank</DialogTitle>
                                <DialogDescription>
                                    Convert your Kaushal Tokens to fiat currency.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleWithdraw} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (KAUSHAL)</Label>
                                    <Input id="amount" type="number" placeholder="Enter amount" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="account">Bank Account Number</Label>
                                    <Input id="account" placeholder="Enter account number" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ifsc">IFSC Code</Label>
                                    <Input id="ifsc" placeholder="Enter IFSC code" required />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">
                                        Submit Request <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    )
}
