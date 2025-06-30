import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUserData } from '../../hooks/useUserData'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiLock, FiPlay, FiClock, FiCheck } = FiIcons

const ModuleCard = ({ module, index, isUnlocked, isCompleted }) => {
  const { user } = useAuth()
  const { userData } = useUserData()
  const hasPremium = userData?.has_premium || false

  const canAccess = module.isFree || hasPremium || isUnlocked

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        canAccess ? 'hover:shadow-xl hover:-translate-y-1' : 'opacity-75'
      }`}
    >
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-jade-100 to-sage-100 flex items-center justify-center">
          {canAccess ? (
            <SafeIcon icon={FiPlay} className="w-12 h-12 text-jade-600" />
          ) : (
            <SafeIcon icon={FiLock} className="w-12 h-12 text-sage-400" />
          )}
        </div>
        
        {!module.isFree && (
          <div className="absolute top-3 right-3 bg-jade-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            Premium
          </div>
        )}

        {isCompleted && (
          <div className="absolute top-3 left-3 bg-green-500 text-white p-2 rounded-full">
            <SafeIcon icon={FiCheck} className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-jade-600">Module {module.id}</span>
          <div className="flex items-center text-sage-500 text-sm">
            <SafeIcon icon={FiClock} className="w-4 h-4 mr-1" />
            {module.estimatedTime}
          </div>
        </div>

        <h3 className="text-xl font-bold text-sage-800 mb-3">{module.title}</h3>
        <p className="text-sage-600 mb-4 line-clamp-3">{module.description}</p>

        <div className="mb-4">
          <h4 className="font-semibold text-sage-700 mb-2">Key Movements:</h4>
          <ul className="text-sm text-sage-600 space-y-1">
            {module.keyMovements.slice(0, 2).map((movement, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-jade-500 mr-2">•</span>
                {movement}
              </li>
            ))}
            {module.keyMovements.length > 2 && (
              <li className="text-jade-600 font-medium">+ {module.keyMovements.length - 2} more</li>
            )}
          </ul>
        </div>

        <div className="flex justify-between items-center">
          {canAccess ? (
            <Link
              to={`/module/${module.id}`}
              className="bg-jade-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-jade-700 transition-colors"
            >
              {isCompleted ? 'Review' : 'Start Module'}
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              {user ? (
                <Link
                  to="/upgrade"
                  className="bg-jade-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-jade-700 transition-colors"
                >
                  Unlock Premium
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="bg-sage-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-sage-700 transition-colors"
                >
                  Sign In to Access
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ModuleCard