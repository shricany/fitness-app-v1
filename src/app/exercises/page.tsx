'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Clock, 
  Flame, 
  Target,
  Filter,
  Search,
  Heart,
  Dumbbell,
  Zap,
  Users
} from 'lucide-react'

interface Exercise {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // in minutes
  caloriesPerMinute: number
  equipment: string[]
  muscleGroups: string[]
  videoUrl?: string
  imageUrl?: string
  instructions: string[]
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const categories = ['all', 'cardio', 'strength', 'flexibility', 'hiit', 'yoga', 'pilates']
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const handleStartExercise = (exerciseId: string) => {
    window.location.href = `/exercises/${exerciseId}`
  }

  useEffect(() => {
    async function loadExercises() {
      try {
        // Mock data for exercises
        const mockExercises: Exercise[] = [
          {
            id: '1',
            title: 'Push-ups',
            description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
            category: 'strength',
            difficulty: 'beginner',
            duration: 10,
            caloriesPerMinute: 8,
            equipment: [],
            muscleGroups: ['chest', 'shoulders', 'triceps', 'core'],
            instructions: [
              'Start in plank position with hands shoulder-width apart',
              'Lower your body until chest nearly touches the floor',
              'Push back up to starting position',
              'Keep your core engaged throughout'
            ]
          },
          {
            id: '2',
            title: 'Burpees',
            description: 'Full-body high-intensity exercise combining squat, plank, and jump',
            category: 'hiit',
            difficulty: 'intermediate',
            duration: 15,
            caloriesPerMinute: 12,
            equipment: [],
            muscleGroups: ['full body'],
            instructions: [
              'Start standing, then squat down and place hands on floor',
              'Jump feet back into plank position',
              'Do a push-up (optional)',
              'Jump feet back to squat position',
              'Jump up with arms overhead'
            ]
          },
          {
            id: '3',
            title: 'Mountain Climbers',
            description: 'Dynamic cardio exercise that targets core and improves cardiovascular fitness',
            category: 'cardio',
            difficulty: 'intermediate',
            duration: 12,
            caloriesPerMinute: 10,
            equipment: [],
            muscleGroups: ['core', 'shoulders', 'legs'],
            instructions: [
              'Start in plank position',
              'Bring right knee toward chest',
              'Quickly switch legs, bringing left knee toward chest',
              'Continue alternating legs rapidly',
              'Keep hips level and core engaged'
            ]
          },
          {
            id: '4',
            title: 'Downward Dog',
            description: 'Classic yoga pose that stretches and strengthens the entire body',
            category: 'yoga',
            difficulty: 'beginner',
            duration: 8,
            caloriesPerMinute: 3,
            equipment: ['yoga mat'],
            muscleGroups: ['shoulders', 'hamstrings', 'calves', 'core'],
            instructions: [
              'Start on hands and knees',
              'Tuck toes under and lift hips up and back',
              'Straighten legs and arms',
              'Create an inverted V shape with your body',
              'Hold and breathe deeply'
            ]
          },
          {
            id: '5',
            title: 'Kettlebell Swings',
            description: 'Explosive hip-hinge movement that builds power and burns calories',
            category: 'strength',
            difficulty: 'advanced',
            duration: 20,
            caloriesPerMinute: 15,
            equipment: ['kettlebell'],
            muscleGroups: ['glutes', 'hamstrings', 'core', 'shoulders'],
            instructions: [
              'Stand with feet shoulder-width apart, kettlebell in front',
              'Hinge at hips and grab kettlebell with both hands',
              'Drive hips forward explosively to swing kettlebell up',
              'Let kettlebell swing back between legs',
              'Repeat with powerful hip drive'
            ]
          },
          {
            id: '6',
            title: 'Plank Hold',
            description: 'Isometric core exercise that builds stability and endurance',
            category: 'strength',
            difficulty: 'beginner',
            duration: 5,
            caloriesPerMinute: 5,
            equipment: [],
            muscleGroups: ['core', 'shoulders', 'glutes'],
            instructions: [
              'Start in push-up position',
              'Lower to forearms, keeping body straight',
              'Engage core and hold position',
              'Keep hips level, don\'t let them sag or pike up',
              'Breathe steadily throughout hold'
            ]
          }
        ]

        setExercises(mockExercises)
        setFilteredExercises(mockExercises)
      } catch (error) {
        console.error('Error loading exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    loadExercises()
  }, [])

  useEffect(() => {
    let filtered = exercises

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory)
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exercise => exercise.difficulty === selectedDifficulty)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscleGroups.some(muscle => muscle.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredExercises(filtered)
  }, [exercises, selectedCategory, selectedDifficulty, searchTerm])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cardio': return <Heart className="h-4 w-4" />
      case 'strength': return <Dumbbell className="h-4 w-4" />
      case 'hiit': return <Zap className="h-4 w-4" />
      case 'yoga': return <Target className="h-4 w-4" />
      case 'pilates': return <Users className="h-4 w-4" />
      default: return <Play className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
            <p className="text-sm text-gray-600 mt-1">Discover and master individual exercises for your fitness journey</p>
          </div>
        </div>
      </div>
      <div className="p-8">

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search exercises, muscle groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </p>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="border-0 shadow-sm hover:shadow-md transition-all duration-200 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(exercise.category)}
                    <CardTitle className="text-lg">{exercise.title}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Exercise Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <span>{exercise.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-slate-500" />
                    <span>{exercise.caloriesPerMinute * exercise.duration} cal</span>
                  </div>
                </div>

                {/* Muscle Groups */}
                <div>
                  <div className="text-sm text-slate-500 mb-2">Target Muscles:</div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups.map((muscle) => (
                      <Badge key={muscle} variant="secondary" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Equipment */}
                {exercise.equipment.length > 0 && (
                  <div>
                    <div className="text-sm text-slate-500 mb-2">Equipment:</div>
                    <div className="flex flex-wrap gap-1">
                      {exercise.equipment.map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleStartExercise(exercise.id)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Exercise
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No exercises found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}