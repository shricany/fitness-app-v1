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

export default async function ModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    }
  };

  const handleShare = async () => {
    if (user && module) {
      await supabase.from('walls').insert({
        user_id: user.id,
        module_id: module.id,
        content: `Just crushed the ${module.title} module! 💪 Feeling stronger every day! #FitnessZone`,
      });
      router.push('/wall');
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
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
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/modules" className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center">
            ← Back to Modules
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{module.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{module.description}</p>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>🎯 {exercises.length} exercises</span>
              <span>✓ {completedExercises.length} completed</span>
              <span>👍 {upvotes.length} upvoted</span>
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          {exercises.map((exercise, index) => {
            const isCompleted = completedExercises.includes(exercise.id);
            const isUpvoted = upvotes.includes(exercise.id);
            
            return (
              <div key={exercise.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800">{exercise.title}</h2>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUpvote(exercise.id)}
                        className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                          isUpvoted 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isUpvoted ? '👍 Upvoted' : '👍 Upvote'}
                      </button>
                      
                      {!isCompleted && (
                        <button
                          onClick={() => handleComplete(exercise.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition-colors duration-200"
                        >
                          ✓ Complete
                        </button>
                      )}
                    </div>
                  </div>

                  {exercise.video_url && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
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
        </div>

        {/* Completion Actions */}
        {progress === 100 && (
          <div className="mt-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shadow-lg p-8 text-center text-white">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
            <p className="text-xl mb-6">You've completed the {module.title} module!</p>
            <button
              onClick={handleShare}
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              🏆 Share Achievement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
