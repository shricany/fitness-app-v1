import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div className="container mx-auto px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              FitTogether 💪
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              The world's first collaborative fitness platform
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
              Lead or join live workout sessions with friends. Real-time video sync, live chat, and instructor controls make fitness social and fun!
            </p>
            
            <div className="flex gap-4 justify-center">
              <a href="/login" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Started Free
              </a>
              <a href="#features" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
                Learn More
              </a>
            </div>
          </div>

          {/* Features */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-xl font-bold mb-4">Live Video Sync</h3>
              <p className="text-gray-600">Instructors control video playback for all participants in real-time</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-4">Live Chat</h3>
              <p className="text-gray-600">Chat with your workout buddies during sessions for motivation</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-4">Group Workouts</h3>
              <p className="text-gray-600">Invite friends and family to join your fitness journey together</p>
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-semibold mb-2">Create Session</h4>
                <p className="text-sm text-gray-600">Choose a workout module and create a live session</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold mb-2">Invite Friends</h4>
                <p className="text-sm text-gray-600">Send invites via email to your workout partners</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h4 className="font-semibold mb-2">Lead Together</h4>
                <p className="text-sm text-gray-600">Control video playback and chat with participants</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                </div>
                <h4 className="font-semibold mb-2">Stay Motivated</h4>
                <p className="text-sm text-gray-600">Achieve fitness goals together as a community</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Fit Together?</h2>
            <p className="text-lg text-gray-600 mb-8">Join thousands of users making fitness social and fun</p>
            <a href="/login" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Your Free Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: modules } = await supabase.from('modules').select('*').limit(3);
  const { data: recentActivity } = await supabase.from('walls').select('*').limit(3);

  const handleLogout = async () => {
    'use server';
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    redirect('/login');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Welcome back, <span className="text-blue-600">{user?.email?.split('@')[0]}</span>! 🚀
              </h1>
              <p className="text-xl text-gray-600">Ready to crush your fitness goals today?</p>
            </div>
            <div className="flex gap-2">
              <a href="/profile" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full transition-colors duration-200">
                Profile
              </a>
              <form action={handleLogout}>
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors duration-200">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🏋️</div>
            <h3 className="text-2xl font-bold text-blue-600">{modules?.length || 0}</h3>
            <p className="text-gray-600">Available Modules</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="text-2xl font-bold text-orange-600">12</h3>
            <p className="text-gray-600">Workouts This Week</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="text-2xl font-bold text-green-600">85%</h3>
            <p className="text-gray-600">Goal Achievement</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <Link href="/modules" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="text-3xl mb-3">🏋️</div>
            <h3 className="text-xl font-bold mb-2">Start Workout</h3>
            <p className="text-blue-100">Browse fitness modules</p>
          </Link>
          <Link href="/create-session" className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="text-3xl mb-3">🎥</div>
            <h3 className="text-xl font-bold mb-2">Create Session</h3>
            <p className="text-red-100">Lead a workout</p>
          </Link>
          <Link href="/groups" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-xl font-bold mb-2">Join Groups</h3>
            <p className="text-purple-100">Connect with others</p>
          </Link>
          <Link href="/wall" className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="text-xl font-bold mb-2">Wall of Fame</h3>
            <p className="text-green-100">Share achievements</p>
          </Link>
          <Link href="/invites" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="text-3xl mb-3">📬</div>
            <h3 className="text-xl font-bold mb-2">Invites</h3>
            <p className="text-yellow-100">View invitations</p>
          </Link>
          <Link href="/dashboard" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold mb-2">Dashboard</h3>
            <p className="text-orange-100">Track progress</p>
          </Link>
        </div>

        {/* Featured Modules */}
        {modules && modules.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-2">✨</span> Featured Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modules.map((module) => (
                <Link key={module.id} href={`/modules/${module.id}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <h3 className="font-bold text-lg text-blue-600 mb-2">{module.title}</h3>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
