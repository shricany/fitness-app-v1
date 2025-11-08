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
    // For UI demonstration purposes, we are loading mock data directly.
    setUser({ email: 'demo@user.com' }); // Mock user
    setStats({
      totalWorkouts: 24,
      weeklyGoal: 5,
      currentStreak: 7,
      totalMinutes: 1440,
      caloriesBurned: 3200,
      weeklyProgress: 80,
    });
    setChallenges([
      {
        id: '1',
        title: '7-Day Streak Challenge',
        description: 'Complete at least one exercise daily for 7 days',
        progress: 5,
        target: 7,
        endDate: '2024-12-20',
        participants: 234,
      },
      {
        id: '2',
        title: 'Weekly Warrior',
        description: 'Complete 5 workouts this week',
        progress: 4,
        target: 5,
        endDate: '2024-12-15',
        participants: 156,
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">
          <Flame className="w-12 h-12 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Here's your fitness journey overview. Keep up the great work!
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">Start Workout</Button>
        </div>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalWorkouts}</p>
                  <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.currentStreak} days</p>
                  <p className="text-sm text-orange-600 mt-1">Keep it going!</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Minutes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMinutes}</p>
                  <p className="text-sm text-purple-600 mt-1">24 hours of fitness!</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Calories Burned</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.caloriesBurned.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">Amazing progress!</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Target className="h-5 w-5" /> Weekly Goal Progress
              </CardTitle>
              <CardDescription>
                {Math.floor((stats.weeklyProgress / 100) * stats.weeklyGoal)} of {stats.weeklyGoal} workouts completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={stats.weeklyProgress} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600 mt-3">
                <span>{stats.weeklyProgress}% Complete</span>
                <span>
                  {stats.weeklyGoal - Math.floor((stats.weeklyProgress / 100) * stats.weeklyGoal)} workouts remaining
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <TrendingUp className="h-5 w-5" /> This Week's Activity
              </CardTitle>
              <CardDescription>Your workout frequency this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-gray-500 mb-2">{day}</div>
                    <div
                      className={`h-8 w-8 rounded-lg mx-auto flex items-center justify-center text-xs font-medium ${
                        index < 5 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {index < 5 ? '✓' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Trophy className="h-5 w-5" /> Active Challenges
                </CardTitle>
                <CardDescription>Join challenges to stay motivated</CardDescription>
              </div>
              <Link href="/challenges">
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{challenge.title}</p>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {challenge.progress}/{challenge.target}
                      </p>
                      <Progress value={(challenge.progress / challenge.target) * 100} className="h-2 w-16 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
              <CardDescription>Start a new activity or view your progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/exercises" className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Start Workout</p>
                    <p className="text-sm text-gray-600">Browse exercises</p>
                  </div>
                </div>
              </Link>
              <Link href="/create-session" className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Create Session</p>
                    <p className="text-sm text-gray-600">Invite friends & start together</p>
                  </div>
                </div>
              </Link>
              <Link href="/modules" className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View Programs</p>
                    <p className="text-sm text-gray-600">Structured plans</p>
                  </div>
                </div>
              </Link>
              <Link href="/leaderboard" className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View Analytics</p>
                    <p className="text-sm text-gray-600">Track progress</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}