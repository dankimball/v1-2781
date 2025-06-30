import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { modules } from '../../data/modules'
import { useAuth } from '../../hooks/useAuth'
import { useUserData } from '../../hooks/useUserData'
import { supabase } from '../../config/supabase'
import toast from 'react-hot-toast'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiClock, FiCheck, FiArrowLeft, FiArrowRight } = FiIcons

const ModuleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { userData } = useUserData()
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  const module = modules.find(m => m.id === parseInt(id))
  const hasPremium = userData?.has_premium || false
  const canAccess = module?.isFree || hasPremium

  useEffect(() => {
    if (user && module) {
      checkCompletion()
    } else {
      setLoading(false)
    }
  }, [user, module])

  const checkCompletion = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('module_id', module.id)
        .single()

      if (data) {
        setIsCompleted(data.completed)
      }
    } catch (error) {
      console.error('Error checking completion:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsCompleted = async () => {
    if (!user) {
      toast.error('Please sign in to track your progress')
      return
    }

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          module_id: module.id,
          completed: true,
          completed_at: new Date().toISOString()
        })

      if (error) throw error

      setIsCompleted(true)
      toast.success('Module completed! 🎉')
    } catch (error) {
      console.error('Error marking completion:', error)
      toast.error('Failed to save progress')
    }
  }

  if (!module) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-sage-800 mb-4">Module Not Found</h1>
        <button
          onClick={() => navigate('/course')}
          className="text-jade-600 hover:text-jade-700 font-medium"
        >
          Return to Course
        </button>
      </div>
    )
  }

  if (!canAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-24 h-24 bg-jade-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheck} className="w-12 h-12 text-jade-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-4">Premium Module</h1>
          <p className="text-sage-600 mb-6">
            This module is part of our premium course. Unlock all modules to continue your Tai Chi journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/upgrade')}
              className="bg-jade-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-jade-700 transition-colors"
            >
              Unlock Premium - $19
            </button>
            <button
              onClick={() => navigate('/course')}
              className="border border-sage-300 text-sage-700 px-8 py-3 rounded-lg font-semibold hover:bg-sage-50 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/course')}
          className="flex items-center text-jade-600 hover:text-jade-700 font-medium mb-6"
        >
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4 mr-2" />
          Back to Course
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm font-medium text-jade-600 bg-jade-50 px-3 py-1 rounded-full">
                Module {module.id}
              </span>
              {isCompleted && (
                <span className="ml-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Completed
                </span>
              )}
            </div>
            <div className="flex items-center text-sage-500">
              <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
              {module.estimatedTime}
            </div>
          </div>

          <h1 className="text-3xl font-bold text-sage-800 mb-4">{module.title}</h1>
          <p className="text-lg text-sage-600 mb-8">{module.description}</p>

          {/* Video Section */}
          <div className="mb-8">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <iframe
                src={module.videoUrl}
                title={module.title}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Key Movements */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-sage-800 mb-4">Key Movements</h3>
            <div className="bg-sage-50 rounded-lg p-6">
              <ul className="space-y-3">
                {module.keyMovements.map((movement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-jade-500 font-bold mr-3">{index + 1}.</span>
                    <span className="text-sage-700">{movement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Journal Prompt */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-sage-800 mb-4">Reflection Prompt</h3>
            <div className="bg-jade-50 rounded-lg p-6">
              <p className="text-sage-700 italic">"{module.journalPrompt}"</p>
              <div className="mt-4">
                <button
                  onClick={() => navigate('/journal')}
                  className="text-jade-600 hover:text-jade-700 font-medium"
                >
                  Write in your journal →
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-4">
              {!isCompleted && (
                <button
                  onClick={markAsCompleted}
                  className="bg-jade-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-jade-700 transition-colors"
                >
                  Mark as Complete
                </button>
              )}
              <button
                onClick={() => navigate('/journal')}
                className="border border-jade-600 text-jade-600 px-6 py-3 rounded-lg font-semibold hover:bg-jade-50 transition-colors"
              >
                Journal Entry
              </button>
            </div>

            {module.id < modules.length && (
              <button
                onClick={() => navigate(`/module/${module.id + 1}`)}
                className="flex items-center justify-center text-sage-600 hover:text-jade-600 font-medium"
              >
                Next Module
                <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ModuleDetail