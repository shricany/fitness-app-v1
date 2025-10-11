'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name?: string
  created_at: string
  last_sign_in_at: string
  role?: string
  is_banned?: boolean
  ban_reason?: string
  banned_at?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAdminAndFetchUsers()
  }, [])

  const banUser = async (userId: string, reason: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('banned_users')
      .insert([{ user_id: userId, banned_by: user.id, reason }])

    if (!error) {
      checkAdminAndFetchUsers()
    }
  }

  const unbanUser = async (userId: string) => {
    const { error } = await supabase
      .from('banned_users')
      .delete()
      .eq('user_id', userId)

    if (!error) {
      checkAdminAndFetchUsers()
    }
  }

  const handleBanToggle = async (user: User) => {
    if (user.is_banned) {
      if (confirm(`Unban ${user.email}?`)) {
        await unbanUser(user.id)
      }
    } else {
      const reason = prompt(`Ban reason for ${user.email}:`)
      if (reason) {
        await banUser(user.id, reason)
      }
    }
  }

  const checkAdminAndFetchUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Check admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (roleData?.role !== 'admin') {
        router.push('/')
        return
      }

      // Fetch users from admin view
      const { data: usersData } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(usersData || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className={user.is_banned ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.name || 'Not provided'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.is_banned 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.is_banned ? 'BANNED' : 'Active'}
                  </span>
                  {user.is_banned && user.ban_reason && (
                    <div className="text-xs text-gray-500 mt-1">
                      Reason: {user.ban_reason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleBanToggle(user)}
                    className={`px-3 py-1 rounded text-xs ${
                      user.is_banned
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {user.is_banned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}