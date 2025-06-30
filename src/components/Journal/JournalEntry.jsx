import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../config/supabase'
import toast from 'react-hot-toast'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiEdit3, FiSave, FiSparkles } = FiIcons

const JournalEntry = () => {
  const { user } = useAuth()
  const [entry, setEntry] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  const todaysPrompt = "How did your body feel today during practice? What sensations, emotions, or insights arose as you moved through the movements?"

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save your journal entry')
      return
    }

    if (!entry.trim()) {
      toast.error('Please write something before saving')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          entry: entry.trim(),
          ai_response: aiResponse,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Journal entry saved! 📝')
      setEntry('')
      setAiResponse('')
    } catch (error) {
      console.error('Error saving journal entry:', error)
      toast.error('Failed to save entry')
    } finally {
      setLoading(false)
    }
  }

  const generateAIFeedback = async () => {
    if (!entry.trim()) {
      toast.error('Please write your reflection first')
      return
    }

    setAiLoading(true)
    try {
      const response = await fetch('/api/chatWithGPT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Please provide supportive feedback for this Tai Chi practice reflection. Give a 2-sentence summary, a supportive affirmation, and a suggested next practice or question. Keep it warm and encouraging.

Reflection: "${entry}"`,
          systemPrompt: "You are a wise and supportive Tai Chi instructor providing gentle guidance to students reflecting on their practice."
        })
      })

      if (!response.ok) throw new Error('Failed to generate feedback')

      const data = await response.json()
      setAiResponse(data.response)
      toast.success('AI feedback generated! ✨')
    } catch (error) {
      console.error('Error generating AI feedback:', error)
      toast.error('Failed to generate feedback. You can still save your entry.')
    } finally {
      setAiLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <SafeIcon icon={FiEdit3} className="w-16 h-16 text-jade-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-sage-800 mb-4">
            Practice Journal
          </h2>
          <p className="text-sage-600 mb-6">
            Sign in to access your personal practice journal and track your Tai Chi journey.
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-sage-800 mb-4">
            Daily Practice Journal
          </h1>
          <p className="text-sage-600">
            Reflect on your practice and deepen your understanding of Tai Chi
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-sage-800 mb-3">
              Today's Reflection Prompt
            </h3>
            <div className="bg-jade-50 rounded-lg p-4">
              <p className="text-sage-700 italic">"{todaysPrompt}"</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-sage-700 mb-2">
              Your Reflection
            </label>
            <textarea
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Take a moment to reflect on your practice today..."
              className="w-full h-48 p-4 border border-sage-200 rounded-lg focus:ring-2 focus:ring-jade-500 focus:border-jade-500 resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={generateAIFeedback}
              disabled={aiLoading || !entry.trim()}
              className="flex items-center justify-center px-6 py-3 border border-jade-600 text-jade-600 rounded-lg font-medium hover:bg-jade-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiSparkles} className="w-4 h-4 mr-2" />
              {aiLoading ? 'Generating...' : 'Get AI Feedback'}
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !entry.trim()}
              className="flex items-center justify-center px-6 py-3 bg-jade-600 text-white rounded-lg font-medium hover:bg-jade-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>

          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-jade-50 to-sage-50 rounded-lg p-6"
            >
              <h4 className="font-semibold text-sage-800 mb-3 flex items-center">
                <SafeIcon icon={FiSparkles} className="w-4 h-4 mr-2 text-jade-600" />
                AI Guidance
              </h4>
              <div className="text-sage-700 whitespace-pre-wrap leading-relaxed">
                {aiResponse}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default JournalEntry