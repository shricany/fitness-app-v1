'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Users, 
  Calendar, 
  Target, 
  Clock,
  Award,
  Flame,
  TrendingUp,
  CheckCircle
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  type: string
  target: number
  unit: string
  startDate: string
  endDate: string
  participants: number
  isJoined: boolean
  progress: number
  reward: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'joined' | 'completed'>('all')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadChallenges() {
      try {
        // Mock data for now - replace with actual Supabase queries
        const mockChallenges: Challenge[] = [
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
            isJoined: true,
            progress: 5,
            reward: 100,
            difficulty: 'medium'
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
            isJoined: true,
            progress: 4,
            reward: 75,
            difficulty: 'easy'
          },
          {
            id: '3',
            title: 'Cardio Champion',
            description: 'Burn 2000 calories through cardio exercises this month',
            type: 'calories',
            target: 2000,
            unit: 'calories',
            startDate: '2024-12-01',
            endDate: '2024-12-31',
            participants: 89,
            isJoined: false,
            progress: 0,
            reward: 200,
            difficulty: 'hard'
          },
          {
            id: '4',
            title: 'Strength Builder',
            description: 'Complete 10 strength training sessions this month',
            type: 'strength',
            target: 10,
            unit: 'sessions',
            startDate: '2024-12-01',
            endDate: '2024-12-31',
            participants: 67,
            isJoined: false,
            progress: 0,
            reward: 150,
            difficulty: 'medium'
          },
          {
            id: '5',
            title: 'Morning Motivation',
            description: 'Complete workouts before 9 AM for 5 days',
            type: 'morning',
            target: 5,
            unit: 'days',
            startDate: '2024-12-12',
            endDate: '2024-12-18',
            participants: 123,
            isJoined: false,
            progress: 0,
            reward: 80,
            difficulty: 'easy'
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

  const handleJoinChallenge = async (challengeId: string) => {
    // Update local state immediately for better UX
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, isJoined: true, participants: challenge.participants + 1 }
          : challenge
      )
    )
    
    // TODO: Add actual Supabase logic here
    console.log('Joining challenge:', challengeId)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'streak': return <Flame className="h-4 w-4" />
      case 'weekly_goal': return <Target className="h-4 w-4" />
      case 'calories': return <TrendingUp className="h-4 w-4" />
      case 'strength': return <Award className="h-4 w-4" />
      case 'morning': return <Clock className="h-4 w-4" />
      default: return <Trophy className="h-4 w-4" />
    }
  }

  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'joined') return challenge.isJoined
    if (activeTab === 'completed') return challenge.isJoined && challenge.progress >= challenge.target
    return true
  })

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Fitness Challenges 🏆</h1>
          <p className="text-slate-600 text-lg">Join challenges, compete with others, and earn rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{challenges.filter(c => c.isJoined).length}</div>
              <div className="text-sm text-blue-100">Active Challenges</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{challenges.filter(c => c.isJoined && c.progress >= c.target).length}</div>
              <div className="text-sm text-green-100">Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{challenges.filter(c => c.isJoined).reduce((sum, c) => sum + c.reward, 0)}</div>
              <div className="text-sm text-purple-100">Points Earned</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{challenges.reduce((sum, c) => sum + c.participants, 0)}</div>
              <div className="text-sm text-orange-100">Total Participants</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 w-fit">
          {[
            { key: 'all', label: 'All Challenges' },
            { key: 'joined', label: 'My Challenges' },
            { key: 'completed', label: 'Completed' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(challenge.type)}
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <CardDescription>{challenge.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                {challenge.isJoined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}/{challenge.target} {challenge.unit}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                  </div>
                )}

                {/* Challenge Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-slate-500" />
                    <span>{challenge.target} {challenge.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span>{challenge.participants} joined</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span>Ends {new Date(challenge.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-slate-500" />
                    <span>{challenge.reward} points</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {challenge.isJoined ? (
                    challenge.progress >= challenge.target ? (
                      <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed!
                      </Button>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>
                        <Trophy className="h-4 w-4 mr-2" />
                        Joined
                      </Button>
                    )
                  ) : (
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleJoinChallenge(challenge.id)}
                    >
                      Join Challenge
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No challenges found</h3>
            <p className="text-slate-500">
              {activeTab === 'joined' 
                ? "You haven't joined any challenges yet. Start by joining one above!"
                : activeTab === 'completed'
                ? "Complete some challenges to see them here."
                : "New challenges coming soon!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}