import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Star, MessageCircle, Calendar, Zap, TrendingUp, Users, BookOpen, Target } from 'lucide-react';
import { faker } from '@faker-js/faker';

interface SkillMatch {
  id: string;
  name: string;
  skill: string;
  avatar: string;
  rating: number;
  distance: string;
  availability: string;
  matchScore: number;
  description: string;
}

interface RecentActivity {
  id: string;
  type: 'match' | 'session' | 'message';
  title: string;
  description: string;
  time: string;
  avatar?: string;
}

const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Generate mock data
  const skillMatches: SkillMatch[] = Array.from({ length: 6 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    skill: faker.helpers.arrayElement(['Web Development', 'Graphic Design', 'Photography', 'Marketing', 'Language Learning', 'Music Production']),
    avatar: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1494790108755-2616b612c64e', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e', '1507003211169-0a1dd7228f2d', '1517841905240-472988babdf9', '1534528741775-53994a69daeb'])}?w=150&h=150&fit=crop&crop=face`,
    rating: faker.number.float({ min: 4, max: 5, fractionDigits: 1 }),
    distance: `${faker.number.int({ min: 1, max: 50 })} km away`,
    availability: faker.helpers.arrayElement(['Available now', 'Available today', 'Available this week']),
    matchScore: faker.number.int({ min: 75, max: 98 }),
    description: faker.lorem.sentence()
  }));

  const recentActivity: RecentActivity[] = Array.from({ length: 5 }, () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(['match', 'session', 'message']),
    title: faker.helpers.arrayElement([
      'New skill match found',
      'Session completed',
      'Message received',
      'Skill request',
      'Session scheduled'
    ]),
    description: faker.lorem.sentence(),
    time: faker.helpers.arrayElement(['2 minutes ago', '1 hour ago', '3 hours ago', 'Yesterday', '2 days ago']),
    avatar: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1494790108755-2616b612c64e', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e'])}?w=40&h=40&fit=crop&crop=face`
  }));

  const categories = [
    'All',
    'Technology',
    'Design',
    'Business',
    'Languages',
    'Arts',
    'Health',
    'Education'
  ];

  const quickStats = [
    { label: 'Active Matches', value: '12', icon: Users, color: 'text-blue-600' },
    { label: 'Skill Credits', value: '450', icon: Target, color: 'text-green-600' },
    { label: 'Sessions This Month', value: '8', icon: BookOpen, color: 'text-purple-600' },
    { label: 'Reputation Score', value: '4.9', icon: Star, color: 'text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Discover new skills and connect with amazing people</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search for skills, people, or projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category.toLowerCase())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.toLowerCase()
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* AI Recommendation Banner */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">AI Recommendation</h3>
                    <p className="text-sm text-blue-700">
                      Based on your profile, you might be interested in learning "Data Analysis" and teaching "React Development"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Matches */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recommended Matches</h2>
                <span className="text-sm text-gray-500">{skillMatches.length} matches found</span>
              </div>

              <div className="grid gap-6">
                {skillMatches.map((match, index) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={match.avatar}
                        alt={match.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{match.name}</h3>
                            <p className="text-blue-600 font-medium">{match.skill}</p>
                            <p className="text-gray-600 text-sm mt-1">{match.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {match.matchScore}% match
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{match.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{match.distance}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{match.availability}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-4">
                          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Connect
                          </button>
                          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Calendar className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {activity.avatar ? (
                        <img
                          src={activity.avatar}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill SOS */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Skill SOS</h3>
              <p className="text-sm text-red-700 mb-4">
                Need urgent help? Post a Skill SOS and get immediate assistance from our community.
              </p>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Create SOS Request
              </button>
            </div>

            {/* Learning Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Web Development</span>
                    <span className="text-gray-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Graphic Design</span>
                    <span className="text-gray-500">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">Spanish</span>
                    <span className="text-gray-500">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
