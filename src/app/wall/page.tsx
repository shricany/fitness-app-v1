import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function WallOfFamePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: wallPosts } = await supabase
    .from('walls')
    .select('*, users(email), modules(title)')
    .order('created_at', { ascending: false });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Wall of Fame</h1>
      <div className="space-y-8">
        {wallPosts?.map((post) => (
          <div key={post.id} className="p-4 border rounded shadow-sm">
            <p className="text-lg">{post.content}</p>
            <div className="text-sm text-gray-500 mt-2">
              <p>Posted by: {post.users.email}</p>
              {post.modules && <p>Module: {post.modules.title}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
