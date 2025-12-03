import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Zap, Trophy, Globe, Shield, Brain, Coins, Calendar, MessageCircle, Star, BookOpen } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Matching',
      description: 'Our advanced AI connects you with the perfect skill partners based on your needs and expertise.'
    },
    {
      icon: Coins,
      title: 'Skill Credits System',
      description: 'Earn credits by teaching others and spend them to learn new skills. Fair and transparent exchange.'
    },
    {
      icon: Trophy,
      title: 'Gamification & Badges',
      description: 'Level up, earn badges, and compete on leaderboards while building your skill portfolio.'
    },
    {
      icon: Shield,
      title: 'Verified Community',
      description: 'Multi-layered verification ensures you connect with genuine, trustworthy skill partners.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Integrated calendar system that syncs with your external calendars for seamless booking.'
    },
    {
      icon: Globe,
      title: 'Global & Local',
      description: 'Connect with skilled individuals worldwide or find neighbors in your local community.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '1M+', label: 'Skills Exchanged' },
    { number: '200+', label: 'Skill Categories' },
    { number: '95%', label: 'Satisfaction Rate' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Graphic Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c64e?w=150&h=150&fit=crop&crop=face',
      text: 'I learned web development in exchange for teaching design. The AI matching was spot-on!'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      text: 'SkillSwap helped me learn Spanish while teaching programming. The credit system is genius!'
    },
    {
      name: 'Emma Thompson',
      role: 'Marketing Specialist',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      text: 'The gamification keeps me motivated. I\'ve earned 15 badges and made amazing connections!'
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Swap Skills,
                <span className="text-blue-600"> Build Dreams</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Join the revolutionary platform that connects people through skill exchange. 
                Learn from others while sharing your expertise using AI-powered matching, 
                gamification, and a credit-based system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Swapping</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/learning"
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Explore Skills
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="People collaborating and sharing skills"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612c64e?w=40&h=40&fit=crop&crop=face" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">2.1K+ Active Users</p>
                    <p className="text-sm text-gray-500">Currently online</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl font-bold text-blue-600">{stat.number}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose SkillSwap?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've built the most comprehensive skill exchange platform with cutting-edge features 
              that make learning and teaching seamless, rewarding, and fun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How SkillSwap Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up and list your skills to offer and what you want to learn. 
                Our AI will verify and match you with the perfect partners.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Matched</h3>
              <p className="text-gray-600">
                Our AI analyzes your profile and connects you with users who have 
                complementary skills. Start chatting and plan your skill exchange.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Learning</h3>
              <p className="text-gray-600">
                Schedule sessions, earn credits for teaching, and spend them on learning. 
                Build your reputation and unlock exclusive features.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied skill swappers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Skill Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our vibrant community today and unlock the power of collaborative learning. 
              Your next skill is just a swap away!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Join SkillSwap Free
              </Link>
              <Link
                to="/learning"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Skills
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
