import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../config/supabase'
import { format } from 'date-fns'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCalendar, FiEdit3, FiSparkles } = FiIcons

const JournalHistory = () => {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error) {
      console.error('Error fetching journal entries:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <SafeIcon icon={FiEdit3} className="w-16 h-16 text-jade-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-sage-800 mb-4">
            Journal History
          </h2>
          <p className="text-sage-600 mb-6">
            Sign in to view your practice journal history and track your progress.
          </p>
          <a
            href="/auth"
            className="bg-jade-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-jade-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-jade-600"></div>
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
        <h1 className="text-3xl font-bold text-sage-800 mb-4">
          Journal History
        </h1>
        <p className="text-sage-600">
          Revisit your practice reflections and track your Tai Chi journey
        </p>
      </motion.div>

      {entries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <SafeIcon icon={FiEdit3} className="w-16 h-16 text-sage-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-sage-800 mb-4">
            No journal entries yet
          </h3>
          <p className="text-sage-600 mb-6">
            Start your practice journal to track your Tai Chi journey and insights.
          </p>
          <a
            href="/journal"
            className="bg-jade-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-jade-700 transition-colors"
          >
            Write First Entry
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-jade-600 mr-2" />
                <span className="text-sm font-medium text-sage-600">
                  {format(new Date(entry.created_at), 'MMMM d, yyyy')}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-sage-800 mb-2">Your Reflection</h3>
                <p className="text-sage-700 leading-relaxed">{entry.entry}</p>
              </div>

              {entry.ai_response && (
                <div className="bg-gradient-to-r from-jade-50 to-sage-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sage-800 mb-2 flex items-center">
                    <SafeIcon icon={FiSparkles} className="w-4 h-4 mr-2 text-jade-600" />
                    AI Guidance
                  </h4>
                  <p className="text-sage-700 whitespace-pre-wrap leading-relaxed">
                    {entry.ai_response}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default JournalHistory