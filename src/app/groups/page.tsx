import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function GroupsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: groups } = await supabase.from('groups').select('*').eq('is_public', true);

  const handleCreateGroup = async (formData: FormData) => {
    'use server';
    const groupName = formData.get('groupName') as string;
    const isPublic = formData.get('isPublic') === 'on';

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: newGroup, error } = await supabase
        .from('groups')
        .insert([{ name: groupName, is_public: isPublic, created_by: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating group:', error);
        return;
      }

      if (newGroup) {
        await supabase.from('group_members').insert([{ group_id: newGroup.id, user_id: user.id }]);
      }
    }
    redirect('/groups');
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">Workout Groups</h1>
      <div className="mb-8">
        <form action={handleCreateGroup} className="p-4 border rounded shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Create a New Group</h2>
          <input
            type="text"
            name="groupName"
            placeholder="Group Name"
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <label className="flex items-center mb-4">
            <input type="checkbox" name="isPublic" className="mr-2" defaultChecked />
            Public Group
          </label>
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">
            Create Group
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groups?.map((group) => (
          <Link key={group.id} href={`/groups/${group.id}`} className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{group.name}</h5>
          </Link>
        ))}
      </div>
    </div>
  );
}
