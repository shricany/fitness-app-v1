'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Module {
  id: string;
  title: string;
  description: string;
}

export default function CreateSessionPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const { data } = await supabase
      .from('modules')
      .select('*')
      .order('title');
    
    if (data) setModules(data);
  };

  const createSession = async () => {
    if (!sessionTitle || !selectedModule) return;
    
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    // Create session
    const { data: session, error } = await supabase
      .from('exercise_sessions')
      .insert({
        title: sessionTitle,
        module_id: selectedModule,
        instructor_id: user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      setLoading(false);
      return;
    }

    // Add instructor as participant
    await supabase
      .from('session_participants')
      .insert({
        session_id: session.id,
        user_id: user?.id
      });

    // Send invites
    if (inviteEmails.trim()) {
      const emails = inviteEmails.split(',').map(email => email.trim());
      const invites = emails.map(email => ({
        session_id: session.id,
        inviter_id: user?.id,
        invitee_email: email
      }));

      await supabase
        .from('session_invites')
        .insert(invites);
    }

    setLoading(false);
    router.push(`/session/${session.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Create Exercise Session</h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Session Title</label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g., Morning Yoga Session"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Module</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">Choose a fitness module...</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Invite Users (Email addresses, comma-separated)
              </label>
              <textarea
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder="user1@example.com, user2@example.com"
                className="w-full border rounded-lg px-4 py-2 h-24"
              />
            </div>

            <button
              onClick={createSession}
              disabled={loading || !sessionTitle || !selectedModule}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Creating Session...' : 'Create Session'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}