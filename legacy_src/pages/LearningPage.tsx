import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Search, BookOpen, Video, FileText } from 'lucide-react';

interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'video' | 'article';
  category: string;
  duration: string;
  image: string;
}

// Generate mock data
const generateResources = (count: number): LearningResource[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(5),
    type: faker.helpers.arrayElement(['course', 'video', 'article']),
    category: faker.helpers.arrayElement(['Web Development', 'Design', 'Marketing', 'Business', 'Languages']),
    duration: `${faker.number.int({ min: 5, max: 120 })} min`,
    image: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1501504900014-ead6fca34a8a', '1488190211123-2179e62a2024', '1516327083649-96c2ce11f5dc'])}?w=400&h=200&fit=crop`
  }));
};

const resourcesData = generateResources(12);

const LearningPage: React.FC = () => {
  const [resources] = useState<LearningResource[]>(resourcesData);
  const [filter, setFilter] = useState('all');

  const categories = ['All', 'Web Development', 'Design', 'Marketing', 'Business', 'Languages'];

  const filteredResources = resources.filter(res => filter === 'all' || res.category.toLowerCase() === filter);

  const getIconForType = (type: string) => {
    if (type === 'course') return <BookOpen className="h-4 w-4" />;
    if (type === 'video') return <Video className="h-4 w-4" />;
    if (type === 'article') return <FileText className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Learning Library</h1>
          <p className="text-xl text-gray-600 mt-2 max-w-2xl mx-auto">Expand your knowledge with our curated collection of resources.</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for courses, articles, or videos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === cat.toLowerCase()
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden group"
            >
              <div className="relative">
                <img src={resource.image} alt={resource.title} className="w-full h-40 object-cover" />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs font-bold">{resource.category}</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 h-12 group-hover:text-blue-600 transition-colors">{resource.title}</h3>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    {getIconForType(resource.type)}
                    <span className="capitalize">{resource.type}</span>
                  </span>
                  <span>{resource.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
