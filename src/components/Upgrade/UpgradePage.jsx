import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { useUserData } from '../../hooks/useUserData'
import { stripePromise } from '../../config/stripe'
import { supabase } from '../../config/supabase'
import toast from 'react-hot-toast'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheck, FiStar, FiLock, FiCreditCard } = FiIcons

const UpgradePage = () => {
  const { user } = useAuth()
  const { userData, updateUserData } = useUserData()
  const [loading, setLoading] = useState(false)

  const features = [
    'Access to all 5 comprehensive modules',
    'Advanced Tai Chi techniques and forms',
    'Exclusive video content and demonstrations',
    'Personalized practice recommendations',
    'Priority support and community access',
    'Lifetime access to all current and future content'
  ]

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade')
      return
    }

    setLoading(true)
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe not loaded')

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          priceId: 'price_tai_chi_premium', // Replace with actual Stripe price ID
        }),
      })

      const session = await response.json()
      
      if (session.error) {
        throw new Error(session.error)
      }

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        throw new Error(result.error.message)
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      toast.error('Failed to start checkout process')
    } finally {
      setLoading(false)
    }
  }

  // Simulate payment success for demo purposes
  const handleDemoUpgrade = async () => {
    if (!user) {
      toast.error('Please sign in to upgrade')
      return
    }

    setLoading(true)
    try {
      await updateUserData({ has_premium: true })
      toast.success('Premium access activated! 🎉')
    } catch (error) {
      console.error('Error upgrading account:', error)
      toast.error('Failed to upgrade account')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <SafeIcon icon={FiStar} className="w-16 h-16 text-jade-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-sage-800 mb-4">
            Upgrade to Premium
          </h2>
          <p className="text-sage-600 mb-6">
            Sign in to unlock premium features and access the complete Tai Chi course.
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

  if (userData?.has_premium) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheck} className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-sage-800 mb-4">
            You're Premium! 🎉
          </h2>
          <p className="text-sage-600 mb-6">
            You have access to all premium features and content. Continue your Tai Chi journey!
          </p>
          <a
            href="/course"
            className="bg-jade-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-jade-700 transition-colors"
          >
            Continue Learning
          </a>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-sage-800 mb-4">
          Unlock Your Full Potential
        </h1>
        <p className="text-xl text-sage-600">
          Master Tai Chi with our complete premium course
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-sage-800 mb-6">
            What's Included
          </h3>
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <SafeIcon icon={FiCheck} className="w-5 h-5 text-jade-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-sage-700">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Pricing */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-jade-50 to-sage-50 rounded-xl p-8"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <SafeIcon icon={FiStar} className="w-8 h-8 text-jade-600" />
              <h3 className="text-2xl font-bold text-sage-800 ml-2">Premium Access</h3>
            </div>
            <div className="text-6xl font-bold text-jade-600 mb-2">$19</div>
            <p className="text-sage-600">One-time payment • Lifetime access</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between py-2 border-b border-sage-200">
              <span className="text-sage-700">Free Preview</span>
              <span className="text-sage-500">Module 1 only</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sage-200">
              <span className="text-sage-700">Premium Course</span>
              <span className="text-jade-600 font-semibold">All 5 modules</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-sage-200">
              <span className="text-sage-700">Advanced Content</span>
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-jade-600" />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sage-700">Lifetime Updates</span>
              <SafeIcon icon={FiCheck} className="w-5 h-5 text-jade-600" />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDemoUpgrade}
              disabled={loading}
              className="w-full bg-jade-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-jade-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <SafeIcon icon={FiCreditCard} className="w-5 h-5 mr-2" />
              {loading ? 'Processing...' : 'Upgrade Now - $19'}
            </button>
            <p className="text-xs text-sage-500 text-center">
              Demo mode: Click to simulate premium upgrade
            </p>
            <p className="text-xs text-sage-500 text-center">
              Secure payment • 30-day money-back guarantee
            </p>
          </div>
        </motion.div>
      </div>

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 bg-white rounded-xl shadow-lg p-8"
      >
        <h3 className="text-2xl font-bold text-sage-800 mb-8 text-center">
          What Students Say
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="mb-4">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon key={i} icon={FiStar} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sage-600 italic">
                "This course transformed my understanding of Tai Chi. The step-by-step approach made it accessible and deeply meaningful."
              </p>
            </div>
            <p className="font-semibold text-sage-800">- Sarah M.</p>
          </div>
          <div className="text-center">
            <div className="mb-4">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon key={i} icon={FiStar} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-sage-600 italic">
                "The premium modules go deep into the philosophy and practice. Worth every penny for the comprehensive content."
              </p>
            </div>
            <p className="font-semibold text-sage-800">- David L.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UpgradePage