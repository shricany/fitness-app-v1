"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function CreateSessionQuick() {
  const [open, setOpen] = useState(false);
  const [modules, setModules] = useState<any[]>([]);
  const [sessionTitle, setSessionTitle] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [inviteEmails, setInviteEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    if (open) loadModules();
  }, [open]);

  const loadModules = async () => {
    const { data } = await supabase.from('modules').select('*').order('title');
    if (data) setModules(data);
  };

  const submit = async () => {
    if (!sessionTitle || !selectedModule) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data: session, error } = await supabase
      .from('exercise_sessions')
      .insert({ title: sessionTitle, module_id: selectedModule, instructor_id: user?.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error);
      setLoading(false);
      return;
    }

    await supabase.from('session_participants').insert({ session_id: session.id, user_id: user?.id });

    if (inviteEmails.trim()) {
      const emails = inviteEmails.split(',').map((e) => e.trim());
      const invites = emails.map((email) => ({ session_id: session.id, inviter_id: user?.id, invitee_email: email }));
      await supabase.from('session_invites').insert(invites);
    }

    setLoading(false);
    setOpen(false);
    router.push(`/session/${session.id}`);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        aria-label="quick-create-session"
        className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Create
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Quick Create Session</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Session Title</label>
                <input value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Module</label>
                <select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="">Choose a module...</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Invite emails (comma separated)</label>
                <input value={inviteEmails} onChange={(e) => setInviteEmails(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex items-center justify-end space-x-2 mt-4">
                <button onClick={() => setOpen(false)} className="px-3 py-2 bg-gray-100 rounded">Cancel</button>
                <button onClick={submit} disabled={loading || !sessionTitle || !selectedModule} className="px-3 py-2 bg-blue-600 text-white rounded">
                  {loading ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
