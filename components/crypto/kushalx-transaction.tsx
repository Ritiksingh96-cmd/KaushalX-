"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BLOCKCHAIN_CONFIG, CONTRACT_ADDRESSES, ERC20_ABI } from "@/lib/blockchain-config";
import { Loader2, Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function KushalXTransaction() {
    const [amount, setAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const connectWallet = async () => {
        if (typeof window.ethereum === "undefined") {
            toast.error("Please install MetaMask to use this feature");
            return null;
        }

        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            return signer;
        } catch (err) {
            console.error("Failed to connect wallet:", err);
            toast.error("Failed to connect wallet");
            return null;
        }
    };

    const handleTransaction = async () => {
        if (!amount || !recipient) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setError(null);
        setTxHash(null);

        try {
            const signer = await connectWallet();
            if (!signer) {
                setIsLoading(false);
                return;
            }

            // Check network
            const provider = signer.provider;
            const network = await provider.getNetwork();
            // Sepolia Chain ID is 11155111
            if (network.chainId !== BigInt(11155111)) {
                try {
                    await window.ethereum?.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
                    });
                } catch (switchError: any) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        toast.error("Please add Sepolia network to MetaMask");
                    } else {
                        toast.error("Please switch to Sepolia Testnet");
                    }
                    setIsLoading(false);
                    return;
                }
            }

            const contract = new ethers.Contract(CONTRACT_ADDRESSES.kaushalToken, ERC20_ABI, signer);

            // Parse amount to 18 decimals (assuming standard ERC20)
            const amountWei = ethers.parseUnits(amount, 18);

            toast.info("Please confirm the transaction in your wallet...");

            const tx = await contract.transfer(recipient, amountWei);
            toast.success("Transaction submitted!");

            setTxHash(tx.hash);

            await tx.wait();
            toast.success("Transaction confirmed on blockchain!");

        } catch (err: any) {
            console.error("Transaction failed:", err);
            setError(err.message || "Transaction failed");
            toast.error("Transaction failed. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto glass-panel border-purple-500/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-neon-purple">
                    <Wallet className="w-6 h-6" />
                    KushalX Testnet Transfer
                </CardTitle>
                <CardDescription>
                    Send KushalX tokens on the Sepolia Testnet.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Recipient Address</label>
                    <Input
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="bg-black/50 border-purple-500/30 text-white placeholder:text-gray-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Amount (KUSHAL)</label>
                    <Input
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/50 border-purple-500/30 text-white placeholder:text-gray-500"
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 flex items-start gap-2 text-red-200 text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {txHash && (
                    <div className="p-3 rounded-md bg-green-500/10 border border-green-500/50 flex items-start gap-2 text-green-200 text-sm">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <div>
                            <p className="font-medium">Transaction Sent!</p>
                            <a
                                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs underline hover:text-green-100"
                            >
                                View on Etherscan
                            </a>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-none shadow-lg shadow-purple-500/20"
                    onClick={handleTransaction}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        "Send KushalX"
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
