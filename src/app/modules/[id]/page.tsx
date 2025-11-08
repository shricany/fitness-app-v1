'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { type User } from '@supabase/supabase-js';
import Link from 'next/link';

type Module = {
  id: string;
  title: string;
  description: string;
};

type Exercise = {
  id: string;
  title: string;
  video_url: string;
  sequence_number: number;
};

type Upvote = {
  exercise_id: string;
};

export default function ModulePage({ params }: any) {
  const { id } = params;
  const [module, setModule] = useState<Module | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [upvotes, setUpvotes] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      const { data: moduleData } = await supabase
        .from('modules')
        .select('*')
        .eq('id', id)
        .single();
      setModule(moduleData);

      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('*')
        .eq('module_id', id)
        .order('sequence_number', { ascending: true });
      setExercises(exercisesData || []);

      const { data: upvotesData } = await supabase
        .from('upvotes')
        .select('exercise_id')
        .eq('user_id', user.id);
      setUpvotes(upvotesData?.map((upvote: Upvote) => upvote.exercise_id) || []);
      
      setLoading(false);
    };

    fetchData();
  }, [id, router, supabase]);

  const handleUpvote = async (exerciseId: string) => {
    if (!user) return;
    
    if (upvotes.includes(exerciseId)) {
      await supabase.from('upvotes').delete().match({ user_id: user.id, exercise_id: exerciseId });
      setUpvotes(upvotes.filter((id) => id !== exerciseId));
    } else {
      await supabase.from('upvotes').insert({ user_id: user.id, exercise_id: exerciseId });
      setUpvotes([...upvotes, exerciseId]);
    }
  };

  const handleComplete = (exerciseId: string) => {
    if (!completedExercises.includes(exerciseId)) {
      setCompletedExercises([...completedExercises, exerciseId]);
      // Auto advance to next exercise when completed
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
      }
    }
  };

  const handleShare = async () => {
    if (!user || !module) return;

    await supabase.from('walls').insert({
      user_id: user.id,
      module_id: module.id,
      content: `Just crushed the ${module.title} module! 💪 Feeling stronger every day! #FitnessZone`,
    });
    router.push('/wall');
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const handlePrev = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workout...</p>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Module Not Found</h2>
          <Link href="/modules" className="text-blue-600 hover:text-blue-800">Back to Modules</Link>
        </div>
      </div>
    );
  }

  const progress = (completedExercises.length / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <Link href="/modules" className="text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center text-sm">
            ← Back to Modules
          </Link>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-gray-800">{module.title}</h1>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span>🎯 {exercises.length}</span>
                <span>✓ {completedExercises.length}</span>
                <span>👍 {upvotes.length}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{module.description}</p>
            
            {/* Progress Bar */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Exercise Book Layout */}
        <div className="relative h-[calc(100vh-16rem)] flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full max-w-6xl mx-auto flex items-stretch">
              {/* Navigation + Exercise Container */}
              <div className="flex-1 flex">
                {/* Previous Exercise Preview */}
                {currentExercise > 0 && (
                  <div className="w-48 flex items-center">
                    <button 
                      onClick={handlePrev}
                      className="group relative h-full w-full flex items-center justify-center perspective-1000"
                    >
                      <div className="absolute right-0 w-40 h-[90%] bg-white shadow-lg rounded-l-lg origin-right 
                        transition-all duration-500 ease-in-out transform-gpu
                        group-hover:rotate-y-[-15deg] group-active:rotate-y-[-30deg] group-active:translate-x-8
                        border-r border-gray-100"
                      >
                        <div className="h-full p-3 flex flex-col justify-between transform-gpu rotate-y-[15deg] group-hover:rotate-y-0">
                          <div>
                            <div className="text-xs font-medium text-gray-400 mb-1">Previous</div>
                            <div className="text-sm font-bold text-gray-700 line-clamp-2">
                              {exercises[currentExercise - 1].title}
                            </div>
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full w-fit
                            ${completedExercises.includes(exercises[currentExercise - 1].id) 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            Exercise {currentExercise}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-l from-white/50 to-transparent pointer-events-none" />
                      </div>
                      <div className="absolute z-10 -right-4 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center
                        transition-transform group-hover:-translate-x-1 group-active:-translate-x-2"
                      >
                        ←
                      </div>
                    </button>
                  </div>
                )}

                {/* Current Exercise */}
                {exercises.map((exercise, index) => {
                  const isCompleted = completedExercises.includes(exercise.id);
                  const isUpvoted = upvotes.includes(exercise.id);
                  const isCurrent = index === currentExercise;
                  
                  if (!isCurrent) return null;

                  return (
                    <div 
                      key={exercise.id} 
                      className="flex-1 bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 mx-4 relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-black/[0.02] via-transparent to-black/[0.02]" />
                      <div className="relative p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-400'
                            } shadow-md`}>
                              {isCompleted ? '✓' : index + 1}
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-gray-800">{exercise.title}</h2>
                              <span className="text-sm text-gray-500">Exercise {currentExercise + 1} of {exercises.length}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpvote(exercise.id)}
                              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                                isUpvoted 
                                  ? 'bg-blue-500 text-white shadow-md' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {isUpvoted ? '👍 Upvoted' : '👍 Upvote'}
                            </button>
                            
                            {!isCompleted && (
                              <button
                                onClick={() => handleComplete(exercise.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 
                                  transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                              >
                                Complete & Next
                              </button>
                            )}
                          </div>
                        </div>

                        {exercise.video_url && (
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                            <iframe
                              src={getYouTubeEmbedUrl(exercise.video_url)}
                              className="w-full h-full"
                              allowFullScreen
                              title={exercise.title}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Next Exercise Preview */}
                {currentExercise < exercises.length - 1 && (
                  <div className="w-48 flex items-center">
                    <button 
                      onClick={handleNext}
                      className="group relative h-full w-full flex items-center justify-center perspective-1000"
                    >
                      <div className="absolute left-0 w-40 h-[90%] bg-white shadow-lg rounded-r-lg origin-left 
                        transition-all duration-500 ease-in-out transform-gpu
                        group-hover:rotate-y-[15deg] group-active:rotate-y-[30deg] group-active:-translate-x-8
                        border-l border-gray-100"
                      >
                        <div className="h-full p-3 flex flex-col justify-between transform-gpu rotate-y-[-15deg] group-hover:rotate-y-0">
                          <div>
                            <div className="text-xs font-medium text-gray-400 mb-1">Next Up</div>
                            <div className="text-sm font-bold text-gray-700 line-clamp-2">
                              {exercises[currentExercise + 1].title}
                            </div>
                          </div>
                          <div className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full w-fit">
                            Exercise {currentExercise + 2}
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/50 pointer-events-none" />
                      </div>
                      <div className="absolute z-10 -left-4 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center
                        transition-transform group-hover:translate-x-1 group-active:translate-x-2"
                      >
                        →
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completion Actions */}
        {progress === 100 && (
          <div className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow p-4 text-center text-white">
            <div className="text-3xl mb-2">🎉</div>
            <h2 className="text-xl font-bold mb-2">Congratulations!</h2>
            <p className="text-sm mb-3">You've completed the {module.title} module!</p>
            <button
              onClick={handleShare}
              className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transition-all duration-200"
            >
              🏆 Share Achievement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}