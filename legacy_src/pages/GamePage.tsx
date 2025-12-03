import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Award, Shield, Star, Trophy, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  points: number;
}

// Generate mock data
const generateLeaderboard = (count: number): LeaderboardUser[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1494790108755-2616b612c64e', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e'])}?w=100&h=100&fit=crop&crop=face`,
    level: faker.number.int({ min: 1, max: 20 }),
    points: faker.number.int({ min: 1000, max: 10000 })
  })).sort((a, b) => b.points - a.points);
};

const leaderboardData = generateLeaderboard(10);

const GamePage: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard] = useState<LeaderboardUser[]>(leaderboardData);

  const userProgress = 65; // Example progress percentage

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gamification & Achievements</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Progress & Badges */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Shield className="h-20 w-20 text-yellow-400" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-gray-800">{user?.level}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Level {user?.level}</p>
                  <p className="text-sm text-gray-600 mb-2">Next level in {1000 - (userProgress * 10)} points</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <motion.div
                      className="bg-blue-600 h-4 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${userProgress}%` }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Badges</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {user?.badges.map((badge, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Award className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">{badge}</p>
                  </div>
                ))}
                <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <p className="text-sm text-gray-500">More badges to unlock!</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Leaderboard</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {leaderboard.map((player, index) => (
                <div key={player.id} className={`p-4 flex items-center space-x-4 ${index < 3 ? `bg-${['yellow', 'gray', 'orange'][index]}-50` : ''}`}>
                  <span className="font-bold text-gray-600 w-6 text-center">{index + 1}</span>
                  <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{player.name}</p>
                    <p className="text-sm text-gray-500">Level {player.level}</p>
                  </div>
                  <p className="font-semibold text-blue-600">{player.points} pts</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
