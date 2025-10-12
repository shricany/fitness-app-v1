'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Target,
  Trophy,
  Eye,
  MoreHorizontal
} from 'lucide-react'

interface AdminChallenge {
  id: string
  title: string
  description: string
  type: string
  target: number
  unit: string
  startDate: string
  endDate: string
  participants: number
  isActive: boolean
  reward: number
  createdAt: string
}

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function loadChallenges() {
      try {
        // Mock data for admin challenges
        const mockChallenges: AdminChallenge[] = [
          {
            id: '1',
            title: '7-Day Streak Master',
            description: 'Complete at least one exercise every day for 7 consecutive days',
            type: 'streak',
            target: 7,
            unit: 'days',
            startDate: '2024-12-10',
            endDate: '2024-12-17',
            participants: 234,
            isActive: true,
            reward: 100,
            createdAt: '2024-12-08'
          },
          {
            id: '2',
            title: 'Weekly Warrior',
            description: 'Complete 5 different workouts this week',
            type: 'weekly_goal',
            target: 5,
            unit: 'workouts',
            startDate: '2024-12-09',
            endDate: '2024-12-15',
            participants: 156,
            isActive: true,
            reward: 75,
            createdAt: '2024-12-07'
          },
          {
            id: '3',
            title: 'November Challenge',
            description: 'Complete 20 workouts in November',
            type: 'monthly',
            target: 20,
            unit: 'workouts',
            startDate: '2024-11-01',
            endDate: '2024-11-30',
            participants: 89,
            isActive: false,
            reward: 200,
            createdAt: '2024-10-28'
          }
        ]

        setChallenges(mockChallenges)
      } catch (error) {
        console.error('Error loading challenges:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChallenges()
  }, [])

  const handleDeleteChallenge = async (challengeId: string) => {
    if (confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      setChallenges(prev => prev.filter(c => c.id !== challengeId))
      // TODO: Add actual Supabase delete logic
      console.log('Deleting challenge:', challengeId)
    }
  }

  const handleToggleActive = async (challengeId: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, isActive: !challenge.isActive }
          : challenge
      )
    )
    // TODO: Add actual Supabase update logic
    console.log('Toggling challenge status:', challengeId)
  }

  const getStatusBadge = (challenge: AdminChallenge) => {
    const now = new Date()
    const startDate = new Date(challenge.startDate)
    const endDate = new Date(challenge.endDate)

    if (!challenge.isActive) {
      return <Badge variant="secondary">Inactive</Badge>
    }
    if (now < startDate) {
      return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
    }
    if (now > endDate) {
      return <Badge className="bg-gray-100 text-gray-800">Ended</Badge>
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Challenge Management</h1>
            <p className="text-slate-600 text-lg">Create, edit, and manage fitness challenges</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">{challenges.length}</div>
              <div className="text-sm text-slate-600">Total Challenges</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {challenges.filter(c => c.isActive).length}
              </div>
              <div className="text-sm text-slate-600">Active Challenges</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {challenges.reduce((sum, c) => sum + c.participants, 0)}
              </div>
              <div className="text-sm text-slate-600">Total Participants</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {challenges.filter(c => {
                  const now = new Date()
                  const endDate = new Date(c.endDate)
                  return c.isActive && now <= endDate
                }).length}
              </div>
              <div className="text-sm text-slate-600">Ongoing</div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Challenges</CardTitle>
            <CardDescription>Manage your fitness challenges and track participation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-800">{challenge.title}</h3>
                        {getStatusBadge(challenge)}
                      </div>
                      <p className="text-slate-600 mb-3">{challenge.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Target:</span>
                          <div className="font-medium">{challenge.target} {challenge.unit}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Participants:</span>
                          <div className="font-medium">{challenge.participants}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Duration:</span>
                          <div className="font-medium">
                            {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-500">Reward:</span>
                          <div className="font-medium">{challenge.reward} points</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleActive(challenge.id)}
                        className={challenge.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {challenge.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteChallenge(challenge.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {challenges.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No challenges yet</h3>
                <p className="text-slate-500 mb-4">Create your first challenge to get started</p>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Challenge
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Challenge Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Create New Challenge</h2>
              <p className="text-slate-600 mb-4">Challenge creation form would go here.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateModal(false)}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}