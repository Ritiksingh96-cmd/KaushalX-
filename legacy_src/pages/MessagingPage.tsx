import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { faker } from '@faker-js/faker';
import { Search, Send, Paperclip, Smile, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSender: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
}

// Generate mock data
const generateConversations = (count: number): Conversation[] => {
  return Array.from({ length: count }, () => {
    const messages: Message[] = Array.from({ length: faker.number.int({ min: 5, max: 20 }) }, () => ({
      id: faker.string.uuid(),
      text: faker.lorem.sentence(),
      timestamp: faker.date.recent().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: faker.datatype.boolean()
    }));
    return {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      avatar: `https://images.unsplash.com/photo-${faker.helpers.arrayElement(['1494790108755-2616b612c64e', '1438761681033-6461ffad8d80', '1472099645785-5658abf4ff4e'])}?w=100&h=100&fit=crop&crop=face`,
      lastMessage: messages[messages.length - 1].text.substring(0, 30) + '...',
      timestamp: messages[messages.length - 1].timestamp,
      unread: faker.number.int({ min: 0, max: 3 }),
      messages
    };
  });
};

const conversationsData = generateConversations(8);

const MessagingPage: React.FC = () => {
  const [conversations] = useState<Conversation[]>(conversationsData);
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: faker.string.uuid(),
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true,
    };

    setSelectedConversation(prev => ({
        ...prev,
        messages: [...prev.messages, message]
    }));
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>
        <div className="bg-white rounded-xl shadow-lg h-[calc(100vh-200px)] flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.map(convo => (
                <motion.div
                  key={convo.id}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  className={`p-4 flex items-center space-x-4 cursor-pointer border-b border-gray-200 ${selectedConversation.id === convo.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedConversation(convo)}
                >
                  <img src={convo.avatar} alt={convo.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-900 truncate">{convo.name}</p>
                      <p className="text-xs text-gray-500">{convo.timestamp}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
                      {convo.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{convo.unread}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-2/3 flex flex-col">
            {selectedConversation ? (
              <>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900">{selectedConversation.name}</p>
                      <p className="text-xs text-green-500">Online</p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {selectedConversation.messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${msg.isSender ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.isSender ? 'text-blue-200' : 'text-gray-400'} text-right`}>{msg.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                    <button type="button" className="text-gray-500 hover:text-gray-700"><Smile className="h-5 w-5" /></button>
                    <button type="button" className="text-gray-500 hover:text-gray-700"><Paperclip className="h-5 w-5" /></button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-100 border-transparent focus:ring-0 focus:border-transparent rounded-full px-4 py-2"
                    />
                    <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
