'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Flame, 
  ArrowLeft,
  Target
} from 'lucide-react'

interface Exercise {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  caloriesPerMinute: number
  equipment: string[]
  muscleGroups: string[]
  videoUrl?: string
  instructions: string[]
}

export default function ExerciseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock exercise data - replace with actual database call
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
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
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
        videoUrl: 'https://www.youtube.com/embed/TU8QYVW0gDU',
        instructions: [
          'Start standing, then squat down and place hands on floor',
          'Jump feet back into plank position',
          'Do a push-up (optional)',
          'Jump feet back to squat position',
          'Jump up with arms overhead'
        ]
      }
    ]

    const foundExercise = mockExercises.find(ex => ex.id === params.id)
    setExercise(foundExercise || null)
    setLoading(false)
  }, [params.id])

  const handleVideoEnd = () => {
    setIsPlaying(false)
    setIsCompleted(true)
  }

  const handleMarkCompleted = () => {
    setIsCompleted(true)
    alert('Exercise completed! Great job! 🎉')
    // Here you would save to database
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Exercise not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">{exercise.title}</h1>
            <p className="text-slate-600 text-lg">{exercise.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Exercise Video</CardTitle>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                  {exercise.videoUrl ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={exercise.videoUrl}
                      title={exercise.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                      onLoad={() => setIsPlaying(true)}
                    ></iframe>
                  ) : (
                    <div className="text-center">
                      <Play className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">Video coming soon</p>
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{exercise.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{exercise.caloriesPerMinute * exercise.duration} cal</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!isCompleted ? (
                      <Button 
                        onClick={handleMarkCompleted}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Completed
                      </Button>
                    ) : (
                      <Button disabled className="bg-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed!
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exercise Info */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Exercise Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <div className="font-semibold">{exercise.duration} min</div>
                    <div className="text-xs text-slate-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <Flame className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                    <div className="font-semibold">{exercise.caloriesPerMinute * exercise.duration}</div>
                    <div className="text-xs text-slate-600">Calories</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Muscle Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Target Muscles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {exercise.muscleGroups.map((muscle) => (
                    <Badge key={muscle} variant="secondary">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equipment */}
            {exercise.equipment.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Needed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {exercise.equipment.map((item) => (
                      <Badge key={item} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm text-slate-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}