import { KushalXTransaction } from "@/components/crypto/kushalx-transaction";
import { WalletConnect } from "@/components/wallet/wallet-connect";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Crypto Wallet | KaushalX",
    description: "Manage your KushalX tokens and perform testnet transactions.",
};

export default function CryptoPage() {
    return (
        <div className="container mx-auto py-12 px-4 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
                    KushalX Crypto Wallet
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Manage your earnings, send tokens, and explore the blockchain features of KaushalX.
                    Currently running on <strong>Sepolia Testnet</strong>.
                </p>
                <div className="flex justify-center mt-4">
                    <WalletConnect />
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {/* Transaction Card */}
                <div className="lg:col-span-2">
                    <KushalXTransaction />
                </div>

                {/* Info Card */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl glass-panel border-blue-500/30">
                        <h3 className="text-xl font-semibold mb-4 text-neon-blue">Testnet Info</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Network: Sepolia
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Token: KushalX (KSHL)
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                Status: Active
                            </li>
                        </ul>
                        <div className="mt-6">
                            <p className="text-xs text-gray-500 mb-2">Need test ETH?</p>
                            <a
                                href="https://sepoliafaucet.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 text-sm underline"
                            >
                                Visit Sepolia Faucet
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
