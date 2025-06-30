import React from 'react'
import { motion } from 'framer-motion'

const modules = [
  {
    id: 1,
    title: "What Is Tai Chi?",
    description: "Discover the ancient art of Tai Chi, its origins, and how it can transform your daily life through gentle movement and mindful breathing.",
    estimatedTime: "15 minutes",
    isFree: true
  },
  {
    id: 2,
    title: "Yin-Yang & Daoist Roots",
    description: "Explore the philosophical foundation of Tai Chi, understanding the balance of opposites and the Daoist principles that guide this ancient practice.",
    estimatedTime: "20 minutes",
    isFree: false
  },
  {
    id: 3,
    title: "Movement + Breath Connection",
    description: "Learn to synchronize your breath with gentle movements, creating a flowing meditation that calms the mind and strengthens the body.",
    estimatedTime: "25 minutes",
    isFree: false
  },
  {
    id: 4,
    title: "Everyday Mindfulness Practices",
    description: "Integrate Tai Chi principles into your daily routine, bringing mindfulness and presence to ordinary activities.",
    estimatedTime: "18 minutes",
    isFree: false
  },
  {
    id: 5,
    title: "Integrating Tai Chi Into Daily Life",
    description: "Create a sustainable practice that fits your lifestyle, building lasting habits that support your wellbeing and inner peace.",
    estimatedTime: "22 minutes",
    isFree: false
  }
]

const CourseOverview = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Foundations of Tai Chi
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master the ancient art through 5 comprehensive modules designed to guide you from beginner to confident practitioner.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-teal-600">
                  Module {module.id}
                </span>
                {!module.isFree && (
                  <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                    Premium
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{module.title}</h3>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{module.estimatedTime}</span>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors">
                  {module.isFree ? 'Start Free' : 'Upgrade to Access'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default CourseOverview