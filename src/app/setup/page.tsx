'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function SetupPage() {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const testConnection = async () => {
    setIsLoading(true);
    setStatus('Testing connection...');
    
    try {
      const { data, error } = await supabase.from('modules').select('count');
      if (error) {
        setStatus(`❌ ${error.message}`);
      } else {
        setStatus('✅ Connection successful! Tables exist.');
      }
    } catch (err) {
      setStatus(`❌ ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Database Setup</h1>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Manual Setup Required</h2>
        <p className="mb-4">Please follow these steps:</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Go to <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 underline">Supabase Dashboard</a></li>
          <li>Select your project</li>
          <li>Navigate to SQL Editor</li>
          <li>Copy the SQL below and execute it</li>
          <li>Test the connection</li>
        </ol>
      </div>

      <button
        onClick={testConnection}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </button>

      {status && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <pre>{status}</pre>
        </div>
      )}

      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">SQL to Execute:</h3>
        <textarea
          readOnly
          className="w-full h-40 p-2 border rounded font-mono text-sm"
          value={`create table modules (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table exercises (
  id uuid default gen_random_uuid() primary key,
  module_id uuid references modules(id) on delete cascade not null,
  title text not null,
  video_url text,
  sequence_number integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table modules enable row level security;
alter table exercises enable row level security;

create policy "Allow read access to all authenticated users" on modules for select to authenticated using (true);
create policy "Allow read access to all authenticated users" on exercises for select to authenticated using (true);`}
        />
      </div>
    </div>
  );
}