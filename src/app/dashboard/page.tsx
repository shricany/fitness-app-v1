'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Activity, 
  Calendar, 
  Target, 
  Trophy, 
  TrendingUp, 
  Users, 
  Flame,
  Award,
  Clock,
  Zap
} from 'lucide-react'

interface UserStats {
  totalWorkouts: number
  weeklyGoal: number
  currentStreak: number
  totalMinutes: number
  caloriesBurned: number
  weeklyProgress: number
}

interface Challenge {
  id: string
  title: string
  description: string
  progress: number
  target: number
  endDate: string
  participants: number
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<UserStats>({
    totalWorkouts: 0,
    weeklyGoal: 5,
    currentStreak: 0,
    totalMinutes: 0,
    caloriesBurned: 0,
    weeklyProgress: 0
  })
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        setUser(user)

        // Load user stats (mock data for now)
        setStats({
          totalWorkouts: 24,
          weeklyGoal: 5,
          currentStreak: 7,
          totalMinutes: 1440,
          caloriesBurned: 3200,
          weeklyProgress: 80
        })

        // Load active challenges (mock data)
        setChallenges([
          {
            id: '1',
            title: '7-Day Streak Challenge',
            description: 'Complete at least one exercise daily for 7 days',
            progress: 5,
            target: 7,
            endDate: '2024-12-20',
            participants: 234
          },
          {
            id: '2',
            title: 'Weekly Warrior',
            description: 'Complete 5 workouts this week',
            progress: 4,
            target: 5,
            endDate: '2024-12-15',
            participants: 156
          }
        ])

      } catch (error) {
        console.error('Error loading dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

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
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Welcome back, {user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-slate-600 text-lg">Here's your fitness journey overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Activity className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
              <p className="text-xs text-blue-100">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <Flame className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentStreak} days</div>
              <p className="text-xs text-purple-100">Keep it going! 🔥</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Minutes</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMinutes}</div>
              <p className="text-xs text-green-100">24 hours of fitness!</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
              <Zap className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.caloriesBurned}</div>
              <p className="text-xs text-orange-100">Amazing progress!</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Weekly Goal Progress
              </CardTitle>
              <CardDescription>
                {Math.floor((stats.weeklyProgress / 100) * stats.weeklyGoal)} of {stats.weeklyGoal} workouts completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={stats.weeklyProgress} className="h-3" />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>{stats.weeklyProgress}% Complete</span>
                  <span>{stats.weeklyGoal - Math.floor((stats.weeklyProgress / 100) * stats.weeklyGoal)} workouts remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                This Week's Activity
              </CardTitle>
              <CardDescription>Your workout frequency this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-slate-600 mb-1">{day}</div>
                    <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center text-xs font-medium ${
                      index < 5 ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {index < 5 ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Challenges */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Active Challenges
                </CardTitle>
                <CardDescription>Join challenges to stay motivated and compete with others</CardDescription>
              </div>
              <Link href="/challenges">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">{challenge.title}</h3>
                      <p className="text-sm text-slate-600">{challenge.description}</p>
                    </div>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {challenge.progress}/{challenge.target}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {challenge.participants}
                      </span>
                    </div>
                    <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Ends: {new Date(challenge.endDate).toLocaleDateString()}</span>
                      <span>{Math.round((challenge.progress / challenge.target) * 100)}% complete</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/exercises">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Start Workout</h3>
                <p className="text-sm text-slate-600">Browse exercises and start your session</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/challenges">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Join Challenge</h3>
                <p className="text-sm text-slate-600">Compete with others and win rewards</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/leaderboard">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Leaderboard</h3>
                <p className="text-sm text-slate-600">See how you rank against others</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}