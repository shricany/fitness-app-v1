import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: completedModules } = await supabase
    .from('walls')
    .select('modules(title)')
    .eq('user_id', session.user.id);

  const { data: upvotedExercises } = await supabase
    .from('upvotes')
    .select('exercises(title)')
    .eq('user_id', session.user.id);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Completed Modules</h2>
          <ul className="list-disc list-inside">
            {completedModules?.map((item: any, index) => (
              <li key={index}>{item.modules?.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Upvoted Exercises</h2>
          <ul className="list-disc list-inside">
            {upvotedExercises?.map((item: any, index) => (
              <li key={index}>{item.exercises?.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
