import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Calendar, Clock, Video, User, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface Session {
  id: string;
  title: string;
  with: string;
  avatar: string;
  time: string;
  duration: string;
  isUpcoming: boolean;
}

// Generate mock data
const generateSessions = (count: number): Session[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: `Session: ${faker.hacker.verb()} with ${faker.person.firstName()}`,
    with: faker.person.fullName(),
    avatar: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1494790108755-2616b612c64e', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e'])}?w=100&h=100&fit=crop&crop=face`,
    time: faker.date.soon({ days: 7 }).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: `${faker.number.int({ min: 30, max: 90 })} mins`,
    isUpcoming: faker.datatype.boolean()
  }));
};

const sessionsData = generateSessions(5);

const CalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [sessions] = useState<Session[]>(sessionsData);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
            <p className="text-gray-600 mt-1">Manage your skill exchange sessions.</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Schedule New Session</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6"
          >
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              inline
              className="w-full border-none"
            />
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sessions for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Today'}
            </h2>
            <div className="space-y-4">
              {sessions.length > 0 ? sessions.map(session => (
                <div key={session.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900">{session.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                    <User className="h-4 w-4" />
                    <span>with {session.with}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.time} ({session.duration})</span>
                  </div>
                  <button className="mt-3 w-full flex items-center justify-center space-x-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                    <Video className="h-4 w-4" />
                    <span>Join Session</span>
                  </button>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No sessions scheduled for this day.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
