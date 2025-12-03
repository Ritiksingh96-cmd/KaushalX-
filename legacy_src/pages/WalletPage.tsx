import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Coins, ArrowUpRight, ArrowDownLeft, Plus, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  id: string;
  type: 'earned' | 'spent' | 'donated';
  description: string;
  amount: number;
  date: string;
}

// Generate mock data
const generateTransactions = (count: number): Transaction[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['earned', 'spent', 'donated']),
    description: faker.lorem.sentence(4),
    amount: faker.number.int({ min: 10, max: 100 }),
    date: faker.date.recent({ days: 30 }).toLocaleDateString()
  }));
};

const transactionsData = generateTransactions(10);

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions] = useState<Transaction[]>(transactionsData);

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'earned': return <ArrowUpRight className="h-5 w-5 text-green-500" />;
      case 'spent': return <ArrowDownLeft className="h-5 w-5 text-red-500" />;
      case 'donated': return <Gift className="h-5 w-5 text-indigo-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wallet</h1>
        
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg text-blue-200">Current Balance</p>
              <div className="flex items-center space-x-2 mt-2">
                <Coins className="h-8 w-8" />
                <p className="text-5xl font-bold">{user?.skillCredits}</p>
              </div>
              <p className="text-sm text-blue-200 mt-1">Skill Credits</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Earn Credits</span>
              </button>
              <button className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                <Gift className="h-4 w-4" />
                <span>Donate</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {transactions.map(tx => (
              <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    {getIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{tx.description}</p>
                    <p className="text-sm text-gray-500">{tx.date}</p>
                  </div>
                </div>
                <p className={`font-semibold text-lg ${tx.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WalletPage;
