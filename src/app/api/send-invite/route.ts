import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, sessionTitle, inviteEmails } = await request.json();
    
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, just create the invites in the database
    // In a real app, you'd integrate with an email service like Resend, SendGrid, etc.
    const emails = inviteEmails.split(',').map((email: string) => email.trim());
    const invites = emails.map((email: string) => ({
      session_id: sessionId,
      inviter_id: user.id,
      invitee_email: email
    }));

    const { error } = await supabase
      .from('session_invites')
      .insert(invites);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // TODO: Send actual emails here
    // Example with a service like Resend:
    /*
    for (const email of emails) {
      await resend.emails.send({
        from: 'fitness@yourapp.com',
        to: email,
        subject: `You're invited to join "${sessionTitle}"`,
        html: `
          <h2>You've been invited to a workout session!</h2>
          <p>Session: ${sessionTitle}</p>
          <p>Click here to join: ${process.env.NEXT_PUBLIC_APP_URL}/invites</p>
        `
      });
    }
    */

    return NextResponse.json({ 
      success: true, 
      message: `Invites sent to ${emails.length} users. They can check their invites page to join.` 
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to send invites' }, { status: 500 });
  }
}