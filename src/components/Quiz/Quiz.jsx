import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../config/supabase'
import { quizQuestions } from '../../data/modules'
import toast from 'react-hot-toast'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheckCircle, FiXCircle, FiAward, FiRefreshCw } = FiIcons

const Quiz = () => {
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      checkPreviousAttempt()
    } else {
      setLoading(false)
    }
  }, [user])

  const checkPreviousAttempt = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (data && data.length > 0) {
        setHasCompleted(true)
        setScore(data[0].score)
      }
    } catch (error) {
      console.error('Error checking quiz attempts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex
    })
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
    }
  }

  const calculateScore = () => {
    let correctAnswers = 0
    quizQuestions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })
    
    const finalScore = (correctAnswers / quizQuestions.length) * 100
    setScore(finalScore)
    setShowResults(true)
    saveQuizAttempt(finalScore)
  }

  const saveQuizAttempt = async (finalScore) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          score: finalScore,
          answers: selectedAnswers,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success(finalScore >= 70 ? 'Congratulations! You passed! 🎉' : 'Good effort! Try again to improve your score.')
    } catch (error) {
      console.error('Error saving quiz attempt:', error)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setShowResults(false)
    setScore(0)
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <SafeIcon icon={FiAward} className="w-16 h-16 text-jade-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-sage-800 mb-4">
            Knowledge Quiz
          </h2>
          <p className="text-sage-600 mb-6">
            Sign in to test your understanding of Tai Chi principles and track your progress.
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

  if (showResults) {
    const passed = score >= 70
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            passed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <SafeIcon 
              icon={passed ? FiCheckCircle : FiXCircle} 
              className={`w-12 h-12 ${passed ? 'text-green-600' : 'text-orange-600'}`} 
            />
          </div>
          
          <h2 className="text-3xl font-bold text-sage-800 mb-4">
            Quiz Complete!
          </h2>
          
          <div className="text-6xl font-bold mb-4">
            <span className={passed ? 'text-green-600' : 'text-orange-600'}>
              {Math.round(score)}%
            </span>
          </div>
          
          <p className="text-lg text-sage-600 mb-8">
            {passed 
              ? 'Excellent! You have a solid understanding of Tai Chi principles.'
              : 'Good effort! Review the course materials and try again to improve your score.'
            }
          </p>

          <div className="space-y-6">
            {quizQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              
              return (
                <div key={question.id} className="text-left bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start mb-2">
                    <SafeIcon 
                      icon={isCorrect ? FiCheckCircle : FiXCircle}
                      className={`w-5 h-5 mr-2 mt-0.5 ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sage-800 mb-2">
                        {question.question}
                      </p>
                      <p className="text-sm text-sage-600 mb-2">
                        <strong>Your answer:</strong> {question.options[userAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mb-2">
                          <strong>Correct answer:</strong> {question.options[question.correctAnswer]}
                        </p>
                      )}
                      <p className="text-sm text-sage-600 italic">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center justify-center px-6 py-3 border border-jade-600 text-jade-600 rounded-lg font-medium hover:bg-jade-50 transition-colors"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Retake Quiz
            </button>
            <a
              href="/course"
              className="bg-jade-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-jade-700 transition-colors"
            >
              Back to Course
            </a>
          </div>
        </motion.div>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]
  const selectedAnswer = selectedAnswers[question.id]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-jade-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-jade-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-sage-800 mb-6">
            {question.question}
          </h2>
        </div>

        <div className="space-y-4 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(question.id, index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? 'border-jade-600 bg-jade-50 text-jade-800'
                  : 'border-gray-200 hover:border-jade-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-6 h-6 rounded-full border-2 mr-3 ${
                  selectedAnswer === index
                    ? 'border-jade-600 bg-jade-600'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className="px-6 py-3 bg-jade-600 text-white rounded-lg font-medium hover:bg-jade-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default Quiz