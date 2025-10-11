'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminStats {
  total_users: number;
  sessions_today: number;
  total_completions: number;
  active_sessions: number;
  total_modules: number;
  total_exercises: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleData?.role !== 'admin') {
      router.push('/');
      return;
    }

    setIsAdmin(true);
    loadStats();
  };

  const loadStats = async () => {
    const { data } = await supabase
      .from('admin_stats')
      .select('*')
      .single();

    if (data) setStats(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link href="/" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Back to App
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{stats?.total_users || 0}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{stats?.sessions_today || 0}</div>
            <div className="text-gray-600">Sessions Today</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{stats?.total_completions || 0}</div>
            <div className="text-gray-600">Exercises Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">{stats?.active_sessions || 0}</div>
            <div className="text-gray-600">Active Sessions</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">{stats?.total_modules || 0}</div>
            <div className="text-gray-600">Total Modules</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-indigo-600">{stats?.total_exercises || 0}</div>
            <div className="text-gray-600">Total Exercises</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/modules" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-xl font-semibold mb-2">📚 Manage Modules</div>
            <div className="text-gray-600">Add, edit, or delete workout modules</div>
          </Link>
          
          <Link href="/admin/exercises" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-xl font-semibold mb-2">🎥 Manage Exercises</div>
            <div className="text-gray-600">Upload and manage exercise videos</div>
          </Link>
          
          <Link href="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="text-xl font-semibold mb-2">👥 User Management</div>
            <div className="text-gray-600">View users, roles, and activity</div>
          </Link>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-xl font-semibold mb-2">📊 Analytics</div>
            <div className="text-gray-600">Coming soon - detailed analytics</div>
          </div>
        </div>
      </div>
    </div>
  );
}