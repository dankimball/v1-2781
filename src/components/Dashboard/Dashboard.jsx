import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { supabase } from '../../config/supabase';
import { modules } from '../../data/modules';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import GetStartedComponent from '../Quest/GetStartedComponent';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiBookOpen, FiEdit3, FiAward, FiTrendingUp, FiCalendar, FiPlay } = FiIcons;

const Dashboard = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [stats, setStats] = useState({
    completedModules: 0,
    journalEntries: 0,
    quizScore: null,
    streakDays: 0
  });
  const [loading, setLoading] = useState(true);
  const [showGetStarted, setShowGetStarted] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Fetch completed modules
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('module_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      // Fetch journal entries
      const { data: journalData } = await supabase
        .from('journal_entries')
        .select('id,created_at')
        .eq('user_id', user.id);

      // Fetch quiz attempts
      const { data: quizData } = await supabase
        .from('quiz_attempts')
        .select('score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      setStats({
        completedModules: progressData?.length || 0,
        journalEntries: journalData?.length || 0,
        quizScore: quizData?.[0]?.score || null,
        streakDays: calculateStreak(journalData || [])
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (entries) => {
    if (!entries.length) return 0;

    const today = new Date();
    const sortedEntries = entries
      .map(entry => new Date(entry.created_at).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date(today);

    for (const entryDate of sortedEntries) {
      if (currentDate.toDateString() === entryDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (currentDate.toDateString() !== entryDate) {
        break;
      }
    }

    return streak;
  };

  const progressPercentage = (stats.completedModules / modules.length) * 100;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <SafeIcon icon={FiUser} className="w-16 h-16 text-teal-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            Sign in to view your progress, journal entries, and achievements.
          </p>
          <Link
            to="/login"
            className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user.email?.split('@')[0] || 'Practitioner'}!
          </h1>
          <button
            onClick={() => setShowGetStarted(!showGetStarted)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center"
          >
            <SafeIcon icon={FiPlay} className="w-4 h-4 mr-2" />
            Get Started Guide
          </button>
        </div>
        <p className="text-gray-600">
          Track your Tai Chi journey and continue building your practice
        </p>
      </motion.div>

      {/* GetStarted Component */}
      {showGetStarted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Getting Started Guide</h2>
            <button
              onClick={() => setShowGetStarted(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <GetStartedComponent />
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <SafeIcon icon={FiBookOpen} className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-bold text-gray-800">
              {stats.completedModules}/{modules.length}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Course Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{Math.round(progressPercentage)}% complete</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <SafeIcon icon={FiEdit3} className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-bold text-gray-800">
              {stats.journalEntries}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Journal Entries</h3>
          <p className="text-sm text-gray-600">
            {stats.journalEntries === 0 ? 'Start your first entry' : 'Keep reflecting on your practice'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-bold text-gray-800">
              {stats.streakDays}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Day Streak</h3>
          <p className="text-sm text-gray-600">
            {stats.streakDays === 0 ? 'Start your streak today' : 'Days of consistent practice'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <SafeIcon icon={FiAward} className="w-8 h-8 text-teal-600" />
            <span className="text-2xl font-bold text-gray-800">
              {stats.quizScore ? `${Math.round(stats.quizScore)}%` : '-'}
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Quiz Score</h3>
          <p className="text-sm text-gray-600">
            {stats.quizScore === null ? 'Take the quiz to test your knowledge' : stats.quizScore >= 70 ? 'Excellent understanding!' : 'Consider reviewing the material'}
          </p>
        </motion.div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6"
        >
          <SafeIcon icon={FiBookOpen} className="w-12 h-12 text-teal-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Continue Learning</h3>
          <p className="text-gray-600 mb-4">
            {stats.completedModules === modules.length ? "You've completed all modules! Review your favorites." : `Continue with Module ${stats.completedModules + 1}`}
          </p>
          <Link
            to="/course"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            Go to Course
            <SafeIcon icon={FiTrendingUp} className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6"
        >
          <SafeIcon icon={FiEdit3} className="w-12 h-12 text-teal-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Daily Reflection</h3>
          <p className="text-gray-600 mb-4">
            {stats.streakDays > 0 ? `Keep your ${stats.streakDays}-day streak going!` : 'Start your practice journal today'}
          </p>
          <Link
            to="/journal"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            Write Entry
            <SafeIcon icon={FiEdit3} className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6"
        >
          <SafeIcon icon={FiAward} className="w-12 h-12 text-teal-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Test Knowledge</h3>
          <p className="text-gray-600 mb-4">
            {stats.quizScore === null ? 'Ready to test your understanding?' : 'Retake the quiz to improve your score'}
          </p>
          <Link
            to="/quiz"
            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium"
          >
            Take Quiz
            <SafeIcon icon={FiAward} className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>

      {/* Premium Upgrade */}
      {!userData?.has_premium && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Unlock Your Full Potential</h3>
          <p className="text-teal-100 mb-6">
            Access all 5 modules, advanced techniques, and exclusive content to master Tai Chi
          </p>
          <Link
            to="/upgrade"
            className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Upgrade to Premium - $19
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;