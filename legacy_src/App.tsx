import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import MessagingPage from './pages/MessagingPage';
import CalendarPage from './pages/CalendarPage';
import WalletPage from './pages/WalletPage';
import GamePage from './pages/GamePage';
import ForumsPage from './pages/ForumsPage';
import ProjectsPage from './pages/ProjectsPage';
import LearningPage from './pages/LearningPage';
import SkillSOSPage from './pages/SkillSOSPage';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">Loading SkillSwap...</h2>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/messages" element={<MessagingPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/gamification" element={<GamePage />} />
              <Route path="/forums" element={<ForumsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/skill-sos" element={<SkillSOSPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
