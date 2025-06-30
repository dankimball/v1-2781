import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../../context/AuthContext';
import questConfig from '../../config/questConfig';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleLogin = ({ userId, token, newUser, email }) => {
    // Store authentication data
    const userData = {
      userId,
      token,
      email: email || 'user@example.com'
    };
    
    signIn(userData);
    
    if (newUser) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <span className="text-white font-bold text-4xl">太</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">
              Welcome to Your<br />
              <span className="text-teal-200">Tai Chi Journey</span>
            </h1>
            <p className="text-xl text-teal-100 leading-relaxed max-w-md">
              Discover inner peace and balance through the ancient art of Tai Chi. 
              Begin your transformative practice today.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      {/* Right Section - Authentication */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="lg:hidden w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">太</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Continue your mindful journey
              </p>
            </div>

            <QuestLogin
              onSubmit={handleLogin}
              email={true}
              google={false}
              accent={questConfig.PRIMARY_COLOR}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;