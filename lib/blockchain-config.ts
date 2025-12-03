// Blockchain configuration for testnet and mainnet support
export const BLOCKCHAIN_CONFIG = {
    // Current network mode (read from environment)
    networkMode: process.env.BLOCKCHAIN_NETWORK || 'testnet',

    // Ethereum Networks
    ethereum: {
        mainnet: {
            chainId: 1,
            name: 'Ethereum Mainnet',
            rpcUrl: 'https://mainnet.infura.io/v3/' + (process.env.INFURA_PROJECT_ID || ''),
            blockExplorer: 'https://etherscan.io',
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
        },
        sepolia: {
            chainId: 11155111,
            name: 'Sepolia Testnet',
            rpcUrl: process.env.ETHEREUM_TESTNET_RPC_URL || 'https://sepolia.infura.io/v3/' + (process.env.INFURA_PROJECT_ID || ''),
            blockExplorer: 'https://sepolia.etherscan.io',
            nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'SepoliaETH',
                decimals: 18,
            },
            faucets: [
                'https://sepoliafaucet.com',
                'https://www.infura.io/faucet/sepolia',
            ],
        },
    },

    // Polygon Networks
    polygon: {
        mainnet: {
            chainId: 137,
            name: 'Polygon Mainnet',
            rpcUrl: 'https://polygon-rpc.com',
            blockExplorer: 'https://polygonscan.com',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
        },
        mumbai: {
            chainId: 80001,
            name: 'Mumbai Testnet',
            rpcUrl: process.env.POLYGON_TESTNET_RPC_URL || 'https://polygon-mumbai.infura.io/v3/' + (process.env.INFURA_PROJECT_ID || ''),
            blockExplorer: 'https://mumbai.polygonscan.com',
            nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
            },
            faucets: [
                'https://faucet.polygon.technology',
            ],
        },
    },

    // Supported cryptocurrencies
    supportedCurrencies: ['ETH', 'MATIC', 'USDT', 'KAUSHAL'],

    // Get current network configuration
    getCurrentNetwork() {
        const isTestnet = this.networkMode === 'testnet';
        return {
            ethereum: isTestnet ? this.ethereum.sepolia : this.ethereum.mainnet,
            polygon: isTestnet ? this.polygon.mumbai : this.polygon.mainnet,
        };
    },

    // Validate wallet address
    isValidAddress(address: string): boolean {
        return /^0x[a-fA-F0-9]{40}$/.test(address);
    },

    // Get block explorer URL for transaction
    getTransactionUrl(txHash: string, network: 'ethereum' | 'polygon' = 'ethereum'): string {
        const currentNetwork = this.getCurrentNetwork();
        const explorer = network === 'ethereum'
            ? currentNetwork.ethereum.blockExplorer
            : currentNetwork.polygon.blockExplorer;
        return `${explorer}/tx/${txHash}`;
    },

    // Get faucet URLs for testnet
    getFaucetUrls(network: 'ethereum' | 'polygon' = 'ethereum'): string[] {
        if (this.networkMode !== 'testnet') return [];
        return network === 'ethereum'
            ? this.ethereum.sepolia.faucets
            : this.polygon.mumbai.faucets;
    },
};

// Smart contract addresses
export const CONTRACT_ADDRESSES = {
    // Placeholder address for KushalX Token on Sepolia. 
    // REPLACE THIS WITH THE ACTUAL DEPLOYED CONTRACT ADDRESS
    kaushalToken: process.env.KAUSHAL_TOKEN_CONTRACT_ADDRESS || '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    paymentProcessor: process.env.PAYMENT_PROCESSOR_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
};

// Minimal ERC20 ABI for transfer
export const ERC20_ABI = [
    "function transfer(address to, uint256 amount) returns (bool)",
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

// Export helper function to check if we're in testnet mode
export const isTestnetMode = () => BLOCKCHAIN_CONFIG.networkMode === 'testnet';

