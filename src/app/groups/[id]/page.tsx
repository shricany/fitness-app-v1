'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { type User } from '@supabase/supabase-js';

type Group = {
  id: string;
  name: string;
  created_by: string;
};

type Member = {
  user_id: string;
  users: {
    email: string;
  };
};

type Message = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  users: {
    email: string;
  };
};

export default async function GroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };

    const fetchGroupData = async () => {
      const { data: groupData } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();
      setGroup(groupData);

      const { data: membersData } = await supabase
        .from('group_members')
        .select('user_id, users(email)')
        .eq('group_id', id);
      setMembers(membersData as any);
    };

    fetchUser();
    fetchGroupData();

    const channel = supabase
      .channel(`chat:${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `group_id=eq.${id}` },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, router, supabase]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      await supabase.from('messages').insert({
        content: newMessage,
        user_id: user.id,
        group_id: id,
      });
      setNewMessage('');
    }
  };

  const handleJoinGroup = async () => {
    if (user) {
      const { error } = await supabase.from('group_members').insert({
        group_id: id,
        user_id: user.id,
      });
      if (!error) {
        setMembers([...members, { user_id: user.id, users: { email: user.email! } }]);
      }
    }
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  const isMember = members.some((member) => member.user_id === user?.id);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-8">{group.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Chat</h2>
          <div className="border rounded p-4 h-96 overflow-y-auto mb-4">
            {messages.map((message) => (
              <div key={message.id} className="mb-2">
                <strong>{message.users.email}:</strong> {message.content}
              </div>
            ))}
          </div>
          {isMember && (
            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Type a message..."
              />
            </form>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Members</h2>
          <ul>
            {members.map((member) => (
              <li key={member.user_id}>{member.users.email}</li>
            ))}
          </ul>
          {!isMember && (
            <button onClick={handleJoinGroup} className="mt-4 w-full p-2 text-white bg-green-500 rounded">
              Join Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
