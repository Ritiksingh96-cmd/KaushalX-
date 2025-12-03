import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Search, Plus, Users, Code, Palette } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  lead: string;
  leadAvatar: string;
  skills: string[];
  members: number;
  capacity: number;
}

// Generate mock data
const generateProjects = (count: number): Project[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    lead: faker.person.fullName(),
    leadAvatar: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1494790108755-2616b612c64e', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e'])}?w=100&h=100&fit=crop&crop=face`,
    skills: faker.helpers.arrayElements(['React', 'Node.js', 'Figma', 'UI/UX', 'Marketing', 'Copywriting'], { min: 2, max: 4 }),
    members: faker.number.int({ min: 1, max: 10 }),
    capacity: 10
  }));
};

const projectsData = generateProjects(9);

const ProjectsPage: React.FC = () => {
  const [projects] = useState<Project[]>(projectsData);

  const getIconForSkill = (skill: string) => {
    if (['React', 'Node.js'].includes(skill)) return <Code className="h-4 w-4 mr-1" />;
    if (['Figma', 'UI/UX'].includes(skill)) return <Palette className="h-4 w-4 mr-1" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collaborative Projects</h1>
            <p className="text-gray-600 mt-1">Join a team and build something amazing together.</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Create New Project</span>
          </button>
        </div>
        
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">{project.title}</h2>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{project.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-800 mb-2">Skills Needed:</p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map(skill => (
                      <span key={skill} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                        {getIconForSkill(skill)} {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <img src={project.leadAvatar} alt={project.lead} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs text-gray-500">Project Lead</p>
                      <p className="text-sm font-medium text-gray-800">{project.lead}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Team</p>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-800">{project.members}/{project.capacity}</span>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Project
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
