import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, MapPin, Calendar, Star, Award, Edit3, Plus, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);

  const [profileData, setProfileData] = useState({
    bio: 'Passionate web developer with 5+ years of experience. Love teaching and learning new technologies.',
    location: 'San Francisco, CA',
    memberSince: 'January 2023',
    skillsOffered: ['React Development', 'Node.js', 'TypeScript', 'UI/UX Design'],
    skillsWanted: ['Machine Learning', 'Data Science', 'German Language', 'Photography'],
    portfolio: [
      {
        title: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce solution using React and Node.js',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop'
      },
      {
        title: 'Mobile App Design',
        description: 'Designed a mobile app UI for a fitness tracking application',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop'
      }
    ]
  });

  const stats = [
    { label: 'Skills Taught', value: '24' },
    { label: 'Skills Learned', value: '18' },
    { label: 'Avg Rating', value: '4.9' },
    { label: 'Sessions', value: '156' }
  ];

  const reviews = [
    {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c64e?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      comment: 'Excellent React teacher! Very patient and explains concepts clearly.',
      date: '2 weeks ago'
    },
    {
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      rating: 5,
      comment: 'Great session on TypeScript. Would definitely recommend!',
      date: '1 month ago'
    },
    {
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
      rating: 4,
      comment: 'Very knowledgeable about Node.js. Helped me build my first API.',
      date: '1 month ago'
    }
  ];

  const addSkill = (type: 'offered' | 'wanted') => {
    if (newSkill.trim()) {
      if (type === 'offered') {
        setProfileData(prev => ({
          ...prev,
          skillsOffered: [...prev.skillsOffered, newSkill.trim()]
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          skillsWanted: [...prev.skillsWanted, newSkill.trim()]
        }));
      }
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const removeSkill = (skill: string, type: 'offered' | 'wanted') => {
    if (type === 'offered') {
      setProfileData(prev => ({
        ...prev,
        skillsOffered: prev.skillsOffered.filter(s => s !== skill)
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        skillsWanted: prev.skillsWanted.filter(s => s !== skill)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              <p className="text-gray-600 mb-4">{profileData.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Member since {profileData.memberSince}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-yellow-500" />
                  <span>Level {user?.level}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {user?.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-200">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Skills */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Offered */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Skills I Offer</h2>
                {isEditing && (
                  <button
                    onClick={() => setShowAddSkill(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Skill</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {profileData.skillsOffered.map((skill, index) => (
                  <div
                    key={index}
                    className="relative group bg-green-100 text-green-800 px-4 py-2 rounded-lg font-medium"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill, 'offered')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {showAddSkill && (
                <div className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter skill name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => addSkill('offered')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowAddSkill(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Skills Wanted */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Skills I Want to Learn</h2>
                {isEditing && (
                  <button
                    onClick={() => setShowAddSkill(true)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Skill</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {profileData.skillsWanted.map((skill, index) => (
                  <div
                    key={index}
                    className="relative group bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill, 'wanted')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Portfolio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
                {isEditing && (
                  <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                    <Plus className="h-4 w-4" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData.portfolio.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Reviews */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h2>

              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{review.name}</h4>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View All Reviews
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
