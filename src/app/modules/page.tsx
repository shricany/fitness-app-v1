import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function ModulesPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: modules } = await supabase.from('modules').select('*');
  const { data: exercises } = await supabase.from('exercises').select('module_id');

  const getExerciseCount = (moduleId: string) => {
    return exercises?.filter(ex => ex.module_id === moduleId).length || 0;
  };

  const moduleIcons = {
    'Yoga Flow': '🧘',
    'HIIT Cardio': '🔥',
    'Strength Training': '💪',
    'Pilates Core': '✨',
    'Dance Fitness': '💃'
  };

  const moduleColors = {
    'Yoga Flow': 'from-green-400 to-blue-500',
    'HIIT Cardio': 'from-red-400 to-orange-500',
    'Strength Training': 'from-purple-400 to-pink-500',
    'Pilates Core': 'from-yellow-400 to-orange-500',
    'Dance Fitness': 'from-pink-400 to-purple-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🏋️ Workout Modules
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your fitness adventure! Each module is designed to help you reach your goals.
          </p>
        </div>

        {modules && modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module) => {
              const icon = moduleIcons[module.title as keyof typeof moduleIcons] || '🏋️';
              const gradient = moduleColors[module.title as keyof typeof moduleColors] || 'from-blue-400 to-purple-500';
              const exerciseCount = getExerciseCount(module.id);
              
              return (
                <Link 
                  key={module.id} 
                  href={`/modules/${module.id}`} 
                  className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className={`h-32 bg-gradient-to-r ${gradient} flex items-center justify-center`}>
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-1">🎯</span>
                        <span>{exerciseCount} exercises</span>
                      </div>
                      <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
                        Start Now
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Modules Available</h3>
            <p className="text-gray-600">Check back soon for new workout modules!</p>
          </div>
        )}

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            💡 Pro Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="font-bold text-gray-800 mb-1">Stay Consistent</h3>
              <p className="text-sm text-gray-600">Regular workouts yield better results</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💧</div>
              <h3 className="font-bold text-gray-800 mb-1">Stay Hydrated</h3>
              <p className="text-sm text-gray-600">Drink water before, during, and after</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">😴</div>
              <h3 className="font-bold text-gray-800 mb-1">Rest Well</h3>
              <p className="text-sm text-gray-600">Recovery is part of the process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
