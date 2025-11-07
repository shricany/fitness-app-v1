
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MOCK_DASHBOARD_DATA } from '../constants';
import { DashboardData, WallPost } from '../types';
import { ChartBarIcon } from './icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
    <div className="bg-gray-700 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const WallOfFamePost: React.FC<{ post: WallPost }> = ({ post }) => (
  <div className="bg-gray-800 p-4 rounded-lg flex items-start space-x-4">
    <img src={post.user.avatarUrl} alt={post.user.name} className="w-10 h-10 rounded-full"/>
    <div>
      <p className="font-bold">{post.user.name}</p>
      <p className="text-gray-300">{post.text}</p>
      <p className="text-xs text-gray-500 mt-1">{new Date(post.timestamp).toLocaleString()}</p>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const data: DashboardData = MOCK_DASHBOARD_DATA;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Current Streak" value={`${data.streak} Days`} icon={<div className="text-orange-400 text-2xl">🔥</div>} />
        <StatCard title="Workouts Completed" value={data.completedWorkouts} icon={<div className="text-green-400 text-2xl">✓</div>} />
        <StatCard title="Total Time" value={`${data.totalTime} min`} icon={<div className="text-blue-400 text-2xl">⏱️</div>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center"><ChartBarIcon className="w-6 h-6 mr-2 text-cyan-400"/>Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.workoutsPerWeek} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="name" stroke="#A0AEC0" />
              <YAxis stroke="#A0AEC0" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                cursor={{ fill: '#2D3748' }}
              />
              <Legend />
              <Bar dataKey="workouts" fill="#38B2AC" name="Workouts" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-xl font-bold mb-4">🏆 Wall of Fame</h2>
          <div className="space-y-4 overflow-y-auto flex-1 max-h-80 pr-2">
            {data.wallPosts.map(post => (
              <WallOfFamePost key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
   