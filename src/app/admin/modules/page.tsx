'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface Module {
  id: string;
  title: string;
  description: string;
  created_at: string;
  exercises?: Exercise[];
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: number;
}

export default function AdminModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseFormData, setExerciseFormData] = useState({ title: '', description: '', video_url: '', duration: 0, module_id: '' });
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    const { data } = await supabase
      .from('modules')
      .select(`
        *,
        exercises(*)
      `)
      .order('created_at', { ascending: false });
    
    if (data) setModules(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing module
      const { error } = await supabase
        .from('modules')
        .update(formData)
        .eq('id', editingId);
      
      if (!error) {
        setEditingId(null);
        resetForm();
        loadModules();
      }
    } else {
      // Create new module
      const { error } = await supabase
        .from('modules')
        .insert([formData]);
      
      if (!error) {
        resetForm();
        loadModules();
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const editModule = (module: Module) => {
    setFormData({ title: module.title, description: module.description });
    setEditingId(module.id);
    setShowForm(true);
  };

  const deleteModule = async (id: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);
      
      if (!error) loadModules();
    }
  };

  const addExercise = (moduleId: string) => {
    setExerciseFormData({ title: '', description: '', video_url: '', duration: 0, module_id: moduleId });
    setShowExerciseForm(true);
  };

  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingExerciseId) {
      const { error } = await supabase
        .from('exercises')
        .update(exerciseFormData)
        .eq('id', editingExerciseId);
      
      if (!error) {
        resetExerciseForm();
        loadModules();
      }
    } else {
      const { error } = await supabase
        .from('exercises')
        .insert([exerciseFormData]);
      
      if (!error) {
        resetExerciseForm();
        loadModules();
      }
    }
  };

  const resetExerciseForm = () => {
    setExerciseFormData({ title: '', description: '', video_url: '', duration: 0, module_id: '' });
    setShowExerciseForm(false);
    setEditingExerciseId(null);
  };

  const deleteExercise = async (id: string) => {
    if (confirm('Delete this exercise?')) {
      const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id);
      
      if (!error) loadModules();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Modules</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {showForm ? 'Cancel' : 'Add Module'}
            </button>
            <Link href="/admin/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Module Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Module' : 'Add New Module'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-24"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {editingId ? 'Update' : 'Create'} Module
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Exercise Form */}
        {showExerciseForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingExerciseId ? 'Edit Exercise' : 'Add New Exercise'}
            </h2>
            <form onSubmit={handleExerciseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={exerciseFormData.title}
                  onChange={(e) => setExerciseFormData({ ...exerciseFormData, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={exerciseFormData.description}
                  onChange={(e) => setExerciseFormData({ ...exerciseFormData, description: e.target.value })}
                  className="w-full border rounded px-3 py-2 h-24"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Video URL</label>
                <input
                  type="url"
                  value={exerciseFormData.video_url}
                  onChange={(e) => setExerciseFormData({ ...exerciseFormData, video_url: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
                <input
                  type="number"
                  value={exerciseFormData.duration}
                  onChange={(e) => setExerciseFormData({ ...exerciseFormData, duration: parseInt(e.target.value) })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {editingExerciseId ? 'Update' : 'Create'} Exercise
                </button>
                <button
                  type="button"
                  onClick={resetExerciseForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modules List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Existing Modules ({modules.length})</h2>
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{module.title}</h3>
                      <p className="text-gray-600 mt-1">{module.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Created: {new Date(module.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addExercise(module.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Add Exercise
                      </button>
                      <button
                        onClick={() => editModule(module)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteModule(module.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Exercises List */}
                  {module.exercises && module.exercises.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Exercises ({module.exercises.length})</h4>
                      <div className="space-y-2">
                        {module.exercises.map((exercise) => (
                          <div key={exercise.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <div>
                              <span className="font-medium">{exercise.title}</span>
                              <span className="text-gray-500 ml-2">({exercise.duration}s)</span>
                            </div>
                            <button
                              onClick={() => deleteExercise(exercise.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}