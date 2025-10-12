'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp,
  Users,
  Calendar,
  Target,
  Flame
} from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  score: number
  change: number // position change from last week
  streak: number
  totalWorkouts: number
  avatar?: string
}

interface Challenge {
  id: string
  title: string
  participants: number
  endDate: string
}

export default function LeaderboardPage() {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([])
  const [challengeLeaderboards, setChallengeLeaderboards] = useState<{[key: string]: LeaderboardEntry[]}>({})
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
  const [selectedChallenge, setSelectedChallenge] = useState<string>('global')
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadLeaderboards() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)

        // Mock data for global leaderboard
        const mockGlobalLeaderboard: LeaderboardEntry[] = [
          {
            rank: 1,
            userId: '1',
            username: 'FitnessPro',
            score: 2450,
            change: 2,
            streak: 15,
            totalWorkouts: 48
          },
          {
            rank: 2,
            userId: '2',
            username: 'WorkoutWarrior',
            score: 2380,
            change: -1,
            streak: 12,
            totalWorkouts: 45
          },
          {
            rank: 3,
            userId: '3',
            username: 'HealthHero',
            score: 2290,
            change: 1,
            streak: 8,
            totalWorkouts: 42
          },
          {
            rank: 4,
            userId: '4',
            username: 'GymGuru',
            score: 2180,
            change: 0,
            streak: 6,
            totalWorkouts: 38
          },
          {
            rank: 5,
            userId: '5',
            username: 'CardioKing',
            score: 2050,
            change: 3,
            streak: 10,
            totalWorkouts: 35
          },
          {
            rank: 6,
            userId: user?.id || '6',
            username: user?.email?.split('@')[0] || 'You',
            score: 1890,
            change: -2,
            streak: 5,
            totalWorkouts: 32
          }
        ]

        setGlobalLeaderboard(mockGlobalLeaderboard)

        // Mock active challenges
        const mockChallenges: Challenge[] = [
          {
            id: '1',
            title: '7-Day Streak Master',
            participants: 234,
            endDate: '2024-12-17'
          },
          {
            id: '2',
            title: 'Weekly Warrior',
            participants: 156,
            endDate: '2024-12-15'
          }
        ]

        setActiveChallenges(mockChallenges)

        // Mock challenge leaderboards
        setChallengeLeaderboards({
          '1': [
            { rank: 1, userId: '1', username: 'StreakMaster', score: 7, change: 0, streak: 7, totalWorkouts: 7 },
            { rank: 2, userId: '2', username: 'DailyGrinder', score: 6, change: 1, streak: 6, totalWorkouts: 6 },
            { rank: 3, userId: '3', username: 'ConsistentOne', score: 5, change: -1, streak: 5, totalWorkouts: 5 }
          ],
          '2': [
            { rank: 1, userId: '4', username: 'WeeklyChamp', score: 5, change: 0, streak: 3, totalWorkouts: 5 },
            { rank: 2, userId: '5', username: 'WorkoutBeast', score: 4, change: 2, streak: 4, totalWorkouts: 4 },
            { rank: 3, userId: '6', username: 'FitnessFreak', score: 4, change: -1, streak: 2, totalWorkouts: 4 }
          ]
        })

      } catch (error) {
        console.error('Error loading leaderboards:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboards()
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />
      case 2: return <Medal className="h-6 w-6 text-gray-400" />
      case 3: return <Medal className="h-6 w-6 text-amber-600" />
      default: return <span className="text-lg font-bold text-slate-600">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (change < 0) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    return <span className="text-slate-400">-</span>
  }

  const currentLeaderboard = selectedChallenge === 'global' 
    ? globalLeaderboard 
    : challengeLeaderboards[selectedChallenge] || []

  const userRank = currentLeaderboard.find(entry => entry.userId === currentUser?.id)

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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Leaderboard 🏆</h1>
          <p className="text-slate-600 text-lg">See how you rank against other fitness enthusiasts</p>
        </div>

        {/* User's Current Position */}
        {userRank && (
          <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(userRank.rank)}
                    <div>
                      <div className="text-2xl font-bold">Your Rank: #{userRank.rank}</div>
                      <div className="text-blue-100">Score: {userRank.score} points</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-blue-100">
                    {getChangeIcon(userRank.change)}
                    <span>{Math.abs(userRank.change)} positions {userRank.change >= 0 ? 'up' : 'down'}</span>
                  </div>
                  <div className="text-sm text-blue-100">from last week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Selection */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedChallenge('global')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedChallenge === 'global'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Trophy className="h-4 w-4 inline mr-2" />
            Global Leaderboard
          </button>
          {activeChallenges.map((challenge) => (
            <button
              key={challenge.id}
              onClick={() => setSelectedChallenge(challenge.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedChallenge === challenge.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              {challenge.title}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {selectedChallenge === 'global' ? '1,234' : activeChallenges.find(c => c.id === selectedChallenge)?.participants || 0}
              </div>
              <div className="text-sm text-slate-600">Total Participants</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {currentLeaderboard[0]?.streak || 0}
              </div>
              <div className="text-sm text-slate-600">Top Streak (Days)</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-800">
                {selectedChallenge !== 'global' 
                  ? new Date(activeChallenges.find(c => c.id === selectedChallenge)?.endDate || '').toLocaleDateString()
                  : 'Ongoing'
                }
              </div>
              <div className="text-sm text-slate-600">
                {selectedChallenge !== 'global' ? 'Challenge Ends' : 'Competition'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              {selectedChallenge === 'global' ? 'Global Rankings' : activeChallenges.find(c => c.id === selectedChallenge)?.title}
            </CardTitle>
            <CardDescription>
              {selectedChallenge === 'global' 
                ? 'Top performers across all challenges and workouts'
                : 'Challenge-specific rankings and progress'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentLeaderboard.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    entry.userId === currentUser?.id
                      ? 'bg-blue-50 border-2 border-blue-200'
                      : 'bg-white hover:bg-slate-50'
                  } ${index < 3 ? 'shadow-md' : 'shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(entry.rank)}`}>
                      {entry.rank <= 3 ? getRankIcon(entry.rank) : <span className="font-bold">#{entry.rank}</span>}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        {entry.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="font-semibold text-slate-800">
                        {entry.username}
                        {entry.userId === currentUser?.id && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800">You</Badge>
                        )}
                      </div>
                      <div className="text-sm text-slate-600">
                        {entry.totalWorkouts} workouts • {entry.streak} day streak
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-800">{entry.score}</div>
                    <div className="flex items-center gap-1 text-sm">
                      {getChangeIcon(entry.change)}
                      <span className={entry.change > 0 ? 'text-green-600' : entry.change < 0 ? 'text-red-600' : 'text-slate-500'}>
                        {entry.change === 0 ? 'No change' : `${Math.abs(entry.change)} ${entry.change > 0 ? 'up' : 'down'}`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {currentLeaderboard.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 mb-2">No rankings yet</h3>
                <p className="text-slate-500">Be the first to join this challenge and claim the top spot!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}