import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from './useAuth'

export const useUserData = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserData()
    } else {
      setUserData(null)
      setLoading(false)
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user data:', error)
        return
      }

      setUserData(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserData = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setUserData(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating user data:', error)
      return { data: null, error }
    }
  }

  return {
    userData,
    loading,
    updateUserData,
    refetch: fetchUserData
  }
}