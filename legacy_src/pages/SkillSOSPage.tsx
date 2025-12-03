import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Zap, Plus, Clock, Tag, User } from 'lucide-react';

interface SosRequest {
  id: string;
  title: string;
  description: string;
  author: string;
  avatar: string;
  skill: string;
  postedAt: string;
  credits: number;
}

// Generate mock data
const generateSosRequests = (count: number): SosRequest[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: `Urgent help needed with ${faker.hacker.noun()}`,
    description: faker.lorem.paragraph(),
    author: faker.person.fullName(),
    avatar: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1494790108755-2616b612c64e', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e'])}?w=100&h=100&fit=crop&crop=face`,
    skill: faker.hacker.ingverb(),
    postedAt: `${faker.number.int({ min: 5, max: 59 })} minutes ago`,
    credits: faker.number.int({ min: 20, max: 200 })
  }));
};

const sosRequestsData = generateSosRequests(5);

const SkillSOSPage: React.FC = () => {
  const [requests] = useState<SosRequest[]>(sosRequestsData);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Zap className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900">Skill SOS</h1>
          <p className="text-xl text-gray-600 mt-2">Get immediate help from the community when you're stuck.</p>
        </div>

        <div className="text-center mb-12">
          <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold mx-auto">
            <Plus className="h-5 w-5" />
            <span>Create New SOS Request</span>
          </button>
        </div>

        <div className="space-y-6">
          {requests.map((req, index) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border-l-4 border-red-500 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{req.title}</h2>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                      {req.credits} Credits
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{req.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{req.postedAt}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag className="h-4 w-4" />
                      <span className="font-medium text-blue-600">{req.skill}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{req.description}</p>
                </div>
                <div className="mt-4 md:mt-0 flex-shrink-0">
                  <button className="w-full md:w-auto bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                    I can help!
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillSOSPage;
