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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              Transform Your Fitness Journey
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              FitnessPro
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Track progress, join challenges, compete with friends, and achieve your fitness goals with our comprehensive platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                Start Free Trial
              </Link>
              <Link href="#features" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors">
                Explore Features
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">P</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Progress Tracking</h3>
              <p className="text-slate-600">Visual charts and analytics to monitor your fitness journey</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">C</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Weekly Challenges</h3>
              <p className="text-slate-600">Join community challenges and compete with others</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">S</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Daily Streaks</h3>
              <p className="text-slate-600">Build consistency with streak tracking and rewards</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold">S</span>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">Social Fitness</h3>
              <p className="text-slate-600">Connect with friends and share your achievements</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-slate-600">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">50K+</div>
                <div className="text-slate-600">Workouts Completed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                <div className="text-slate-600">User Satisfaction</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 text-slate-800">Ready to Transform Your Fitness?</h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">Join thousands of users who are already achieving their fitness goals</p>
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-xl text-xl font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
              Get Started Now
            </Link>
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
                Welcome back, <span className="text-blue-600">{user?.email?.split('@')[0]}</span>!
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
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold">M</span>
            </div>
            <h3 className="text-2xl font-bold text-blue-600">{modules?.length || 0}</h3>
            <p className="text-gray-600">Available Modules</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-orange-600 font-bold">W</span>
            </div>
            <h3 className="text-2xl font-bold text-orange-600">12</h3>
            <p className="text-gray-600">Workouts This Week</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">G</span>
            </div>
            <h3 className="text-2xl font-bold text-green-600">85%</h3>
            <p className="text-gray-600">Goal Achievement</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/modules" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white font-bold">P</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Programs</h3>
            <p className="text-blue-100">Structured workout plans</p>
          </Link>
          <Link href="/exercises" className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white font-bold">E</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Exercises</h3>
            <p className="text-green-100">Individual workouts</p>
          </Link>
          <Link href="/challenges" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white font-bold">C</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Challenges</h3>
            <p className="text-purple-100">Compete and achieve</p>
          </Link>
          <Link href="/leaderboard" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white font-bold">L</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
            <p className="text-orange-100">See your ranking</p>
          </Link>
          <Link href="/invites" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white font-bold">I</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Invites</h3>
            <p className="text-yellow-100">View invitations</p>
          </Link>
          <Link href="/dashboard" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3">
              <span className="text-white font-bold">D</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Dashboard</h3>
            <p className="text-orange-100">Track progress</p>
          </Link>
        </div>

        {/* Featured Modules */}
        {modules && modules.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Featured Programs
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
