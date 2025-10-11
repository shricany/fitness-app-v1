'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Invite {
  id: string;
  session_id: string;
  inviter_id: string;
  status: string;
  created_at: string;
  exercise_sessions: {
    title: string;
    instructor_id: string;
  };
}

export default function InvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.email) return;

    const { data } = await supabase
      .from('session_invites')
      .select(`
        *,
        exercise_sessions (
          title,
          instructor_id
        )
      `)
      .eq('invitee_email', user.email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (data) setInvites(data);
    setLoading(false);
  };

  const acceptInvite = async (invite: Invite) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Add user to session participants
    await supabase
      .from('session_participants')
      .insert({
        session_id: invite.session_id,
        user_id: user?.id
      });

    // Update invite status
    await supabase
      .from('session_invites')
      .update({ status: 'accepted' })
      .eq('id', invite.id);

    // Redirect to session
    router.push(`/session/${invite.session_id}`);
  };

  const declineInvite = async (inviteId: string) => {
    await supabase
      .from('session_invites')
      .update({ status: 'declined' })
      .eq('id', inviteId);

    loadInvites();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading invites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">Session Invites</h1>
          
          {invites.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📬</div>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">No pending invites</h2>
              <p className="text-gray-500">You'll see workout session invites here when someone invites you.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite.id} className="border rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {invite.exercise_sessions.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        You've been invited to join this workout session
                      </p>
                      <p className="text-sm text-gray-500">
                        Invited {new Date(invite.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptInvite(invite)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => declineInvite(invite.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}