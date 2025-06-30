import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

const Hero = () => {
  const { user } = useAuth()

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Discover the Art of
              <span className="text-teal-600 block">Tai Chi</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Begin your journey into the ancient practice of Tai Chi. Learn to harmonize mind, body, and breath through gentle movements that promote inner peace, balance, and wellbeing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to={user ? "/course" : "/auth"}
              className="bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Learning Now
            </Link>
            <Link
              to="/course"
              className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-50 transition-colors"
            >
              Explore Course
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Mindful Movement</h3>
              <p className="text-gray-600">Learn flowing movements that calm the mind and strengthen the body</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Inner Balance</h3>
              <p className="text-gray-600">Discover harmony through ancient Daoist principles and philosophy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Practice</h3>
              <p className="text-gray-600">Integrate Tai Chi into your everyday life for lasting wellbeing</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-emerald-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full opacity-30"></div>
      </div>
    </div>
  )
}

export default Hero