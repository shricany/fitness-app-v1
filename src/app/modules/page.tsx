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

  const isAuthenticated = !!session;

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workout Programs</h1>
            <p className="text-sm text-gray-600 mt-1">Choose your fitness adventure! Each program is designed to help you reach your goals.</p>
          </div>
        </div>
      </div>
      <div className="p-8">

        {modules && modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const exerciseCount = getExerciseCount(module.id);
              
              return (
                <Link 
                  key={module.id} 
                  href={`/modules/${module.id}`} 
                  className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-0"
                >
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">M</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{exerciseCount} exercises</span>
                      </div>
                      <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm font-medium group-hover:bg-blue-600 group-hover:text-white transition-all">
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Programs Available</h3>
            <p className="text-gray-500">Check back soon for new workout programs!</p>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Pro Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">C</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Stay Consistent</h3>
              <p className="text-sm text-gray-600">Regular workouts yield better results</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">H</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Stay Hydrated</h3>
              <p className="text-sm text-gray-600">Drink water before, during, and after</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">R</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Rest Well</h3>
              <p className="text-sm text-gray-600">Recovery is part of the process</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
