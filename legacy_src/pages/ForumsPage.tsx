import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Search, MessageSquare, ThumbsUp, Eye, Plus } from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  avatar: string;
  category: string;
  replies: number;
  views: number;
  likes: number;
  lastActivity: string;
}

// Generate mock data
const generatePosts = (count: number): ForumPost[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    author: faker.person.fullName(),
    avatar: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1494790108755-2616b612c64e', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e'])}?w=100&h=100&fit=crop&crop=face`,
    category: faker.helpers.arrayElement(['General', 'Web Development', 'Design', 'Marketing', 'Feedback']),
    replies: faker.number.int({ min: 0, max: 150 }),
    views: faker.number.int({ min: 10, max: 2000 }),
    likes: faker.number.int({ min: 0, max: 500 }),
    lastActivity: faker.date.recent({ days: 10 }).toLocaleDateString()
  }));
};

const postsData = generatePosts(15);

const ForumsPage: React.FC = () => {
  const [posts] = useState<ForumPost[]>(postsData);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Forums</h1>
            <p className="text-gray-600 mt-1">Discuss, share, and learn with the community.</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Start New Topic</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 flex items-start space-x-4 hover:bg-gray-50"
              >
                <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <a href="#" className="font-semibold text-lg text-gray-900 hover:text-blue-600">{post.title}</a>
                  <p className="text-sm text-gray-600 mt-1">
                    by {post.author} in <span className="font-medium text-blue-600">{post.category}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500 text-right">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.replies}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views}</span>
                  </div>
                  <div>
                    <p className="text-xs">Last activity</p>
                    <p>{post.lastActivity}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumsPage;
