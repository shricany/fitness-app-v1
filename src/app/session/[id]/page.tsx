'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';

interface Exercise {
  id: string;
  title: string;
  video_url: string;
  sequence_number: number;
}

interface Session {
  id: string;
  title: string;
  instructor_id: string;
  current_exercise_id: string;
  video_state: { isPlaying: boolean; currentTime: number };
  is_active: boolean;
  module_id: string;
  created_at: string;
}

interface Message {
  id: string;
  message: string;
  user_id: string;
  username?: string;
  created_at: string;
}

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const supabase = createClient();
  
  const [session, setSession] = useState<Session | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [exerciseProgress, setExerciseProgress] = useState<{[key: string]: number}>({});

  useEffect(() => {
    initializeSession();
  }, [sessionId]);

  // Separate effect to handle video state changes
  useEffect(() => {
    const currentEx = exercises.find(ex => ex.id === session?.current_exercise_id);
    console.log('🎬 Video sync effect triggered:', {
      hasVideoRef: !!videoRef,
      videoState: session?.video_state,
      currentExercise: currentEx?.title,
      isYoutube: currentEx?.video_url.includes('youtube')
    });
    
    if (videoRef && session?.video_state && currentEx && !currentEx.video_url.includes('youtube')) {
      console.log('🎯 Applying video state:', session.video_state);
      if (session.video_state.isPlaying) {
        videoRef.currentTime = session.video_state.currentTime || 0;
        videoRef.play().then(() => {
          console.log('✅ Video play successful');
        }).catch(e => {
          console.log('❌ Play failed (autoplay policy):', e.message);
          // Show user they need to click play
          if (e.name === 'NotAllowedError') {
            console.log('💡 User needs to interact with video first');
          }
        });
      } else {
        videoRef.pause();
        console.log('⏸️ Video paused');
      }
    }
  }, [session?.video_state, videoRef, exercises, session?.current_exercise_id]);

  const initializeSession = async () => {
    const user = await getCurrentUser();
    await loadSession(user);
    await loadMessages();
    
    // Auto-join session as participant if not instructor
    if (user && sessionId) {
      const { error } = await supabase
        .from('session_participants')
        .upsert({
          session_id: sessionId,
          user_id: user.id
        }, { onConflict: 'session_id,user_id' });
      
      if (error) console.log('Already a participant or error:', error.message);
    }
    
    setLoading(false);
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`session-${sessionId}`)
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'exercise_sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          console.log('🔄 Real-time session update received:', payload.new);
          const newSession = payload.new as Session;
          setSession(prev => {
            console.log('📊 Updating session state from:', prev?.video_state, 'to:', newSession.video_state);
            return newSession;
          });
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'session_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    return user;
  };

  const loadSession = async (user?: any) => {
    // Load session data
    const { data: sessionData } = await supabase
      .from('exercise_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionData) {
      setSession(sessionData);
      const userToCheck = user || currentUser;
      const instructorStatus = sessionData.instructor_id === userToCheck?.id;
      setIsInstructor(instructorStatus);
      console.log('Session loaded:', {
        sessionId: sessionData.id,
        instructorId: sessionData.instructor_id,
        currentUserId: userToCheck?.id,
        isInstructor: instructorStatus
      });
      
      // Load exercises for this session's module
      const { data: exerciseData } = await supabase
        .from('exercises')
        .select('*')
        .eq('module_id', sessionData.module_id)
        .order('sequence_number');
      
      if (exerciseData) {
        setExercises(exerciseData);
        
        // Set first exercise as current if none selected
        if (!sessionData.current_exercise_id && exerciseData.length > 0) {
          await supabase
            .from('exercise_sessions')
            .update({ current_exercise_id: exerciseData[0].id })
            .eq('id', sessionId);
        }
      }
    }
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('session_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    
    const username = currentUser.email?.split('@')[0] || 'User';
    
    const { error } = await supabase
      .from('session_messages')
      .insert({
        session_id: sessionId,
        user_id: currentUser.id,
        username: username,
        message: newMessage.trim()
      });
    
    if (!error) {
      setNewMessage('');
    }
  };

  const updateVideoState = async (isPlaying: boolean) => {
    console.log('updateVideoState called:', { 
      isInstructor, 
      isPlaying, 
      sessionId,
      currentUserId: currentUser?.id,
      sessionInstructorId: session?.instructor_id
    });
    
    if (!isInstructor) {
      console.log('Not instructor, aborting update');
      return;
    }
    
    // Get current time from video if available
    const currentTime = videoRef?.currentTime || 0;
    
    const { data, error } = await supabase
      .from('exercise_sessions')
      .update({
        video_state: { isPlaying, currentTime }
      })
      .eq('id', sessionId)
      .select();
    
    if (error) {
      console.error('Error updating video state:', error);
    } else {
      console.log('Video state updated successfully:', data);
      // Force immediate local update for instructor
      setSession(prev => prev ? {
        ...prev,
        video_state: { isPlaying, currentTime }
      } : null);
    }
  };

  const changeExercise = async (exerciseId: string) => {
    console.log('Change exercise called:', { isInstructor, exerciseId });
    if (!isInstructor) {
      console.log('Not instructor, cannot change exercise');
      return;
    }
    
    const { error } = await supabase
      .from('exercise_sessions')
      .update({
        current_exercise_id: exerciseId,
        video_state: { isPlaying: false, currentTime: 0 }
      })
      .eq('id', sessionId);
    
    if (error) {
      console.error('Error changing exercise:', error);
    } else {
      console.log('Exercise changed successfully');
    }
  };

  const endSession = async () => {
    if (!isInstructor) return;
    
    const { error } = await supabase
      .from('exercise_sessions')
      .update({ is_active: false })
      .eq('id', sessionId);
    
    if (!error) {
      window.location.href = '/';
    }
  };

  // Cleanup on tab close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Remove user from participants when they leave
      if (currentUser) {
        supabase
          .from('session_participants')
          .delete()
          .eq('session_id', sessionId)
          .eq('user_id', currentUser.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser, sessionId]);

  // Session timer
  useEffect(() => {
    if (!session?.created_at) return;
    
    const updateTimer = () => {
      const sessionStart = new Date(session.created_at).getTime();
      const now = Date.now();
      const elapsed = Math.floor((now - sessionStart) / 1000);
      const maxDuration = 15 * 60; // 15 minutes in seconds
      const remaining = Math.max(0, maxDuration - elapsed);
      
      setTimeRemaining(remaining);
      
      if (remaining === 0 && session.is_active) {
        // Session expired
        if (isInstructor) {
          endSession();
        }
      }
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    
    return () => clearInterval(timer);
  }, [session?.created_at, session?.is_active, isInstructor]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgress = async (exerciseId: string, progress: number) => {
    if (!currentUser) return;
    
    const { error } = await supabase
      .from('user_exercise_progress')
      .upsert({
        user_id: currentUser.id,
        session_id: sessionId,
        exercise_id: exerciseId,
        progress_percentage: Math.round(progress),
        completed_at: progress >= 90 ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      });
    
    if (!error) {
      setExerciseProgress(prev => ({
        ...prev,
        [exerciseId]: Math.round(progress)
      }));
      
      // Update streak if exercise completed
      if (progress >= 90) {
        await supabase.rpc('update_user_streak', { p_user_id: currentUser.id });
      }
    }
  };

  // Get current exercise
  const currentExercise = exercises.find(ex => ex.id === session?.current_exercise_id);

  // Track video progress
  useEffect(() => {
    if (!videoRef || !currentExercise) return;
    
    const handleTimeUpdate = () => {
      const progress = (videoRef.currentTime / videoRef.duration) * 100;
      if (!isNaN(progress)) {
        updateProgress(currentExercise.id, progress);
      }
    };
    
    videoRef.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoRef.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef, currentExercise]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading session...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">{session?.title}</h1>
                <div className="flex items-center gap-2">
                  {/* Session Timer */}
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    timeRemaining > 300 ? 'bg-green-100 text-green-800' :
                    timeRemaining > 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    ⏱️ {formatTime(timeRemaining)}
                  </div>
                  
                  {isInstructor && (
                    <>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Instructor
                      </span>
                      <button
                        onClick={endSession}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        End Session
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {currentExercise ? (
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">{currentExercise.title}</h2>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                    {currentExercise.video_url.includes('youtube') ? (
                      // YouTube iframe with sync indicator
                      <div className="relative w-full h-full">
                        <iframe
                          src={currentExercise.video_url + '?enablejsapi=1'}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                        {/* Manual sync indicator for YouTube */}
                        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded">
                          Instructor says: {session?.video_state?.isPlaying ? '▶️ PLAY' : '⏸️ PAUSE'}
                        </div>
                      </div>
                    ) : (
                      // HTML5 video (auto-controllable)
                      <video
                        className="w-full h-full"
                        controls
                        src={currentExercise.video_url}
                        ref={(video) => {
                          console.log('Video ref set:', !!video);
                          setVideoRef(video);
                        }}
                        onLoadedData={() => {
                          console.log('Video loaded, applying state:', session?.video_state);
                          // State will be applied by useEffect
                        }}
                      />
                    )}
                    
                    {/* Video State Overlay */}
                    {session?.video_state && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
                        {session.video_state.isPlaying ? '▶️ Playing' : '⏸️ Paused'}
                      </div>
                    )}
                    
                    {/* Autoplay Notice */}
                    {currentExercise && !currentExercise.video_url.includes('youtube') && session?.video_state?.isPlaying && (
                      <div className="absolute bottom-4 right-4 bg-blue-600 bg-opacity-90 text-white px-3 py-2 rounded text-sm">
                        📱 Click ▶️ if video doesn't auto-play
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-gray-500">No exercise selected</p>
                </div>
              )}

              {/* Debug Info */}
              <div className="mb-4 p-2 bg-yellow-100 rounded text-sm">
                <div>Role: {isInstructor ? '👨‍🏫 Instructor' : '👥 Participant'}</div>
                <div>Video State: {session?.video_state?.isPlaying ? '▶️ Playing' : '⏸️ Paused'}</div>
                <div>Current Exercise: {currentExercise?.title || 'None'}</div>
                <div>Participants will auto-sync when instructor controls video</div>
              </div>

              {/* Instructor Controls */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    console.log('Play button clicked, isInstructor:', isInstructor);
                    if (isInstructor) {
                      updateVideoState(true);
                    }
                  }}
                  className={`px-4 py-2 rounded flex items-center gap-2 ${
                    isInstructor 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ▶️ Play for All {!isInstructor && '(Instructor Only)'}
                </button>
                <button
                  onClick={() => {
                    console.log('Pause button clicked, isInstructor:', isInstructor);
                    if (isInstructor) {
                      updateVideoState(false);
                    }
                  }}
                  className={`px-4 py-2 rounded flex items-center gap-2 ${
                    isInstructor 
                      ? 'bg-red-500 text-white hover:bg-red-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  ⏸️ Pause for All {!isInstructor && '(Instructor Only)'}
                </button>
              </div>

              {/* Session Info & Premium Upgrade */}
              <div className="mb-4 space-y-2">
                <div className="p-3 bg-blue-100 rounded">
                  {currentExercise?.video_url.includes('youtube') ? (
                    <div className="text-sm">
                      📺 <strong>YouTube Video:</strong> Instructor controls show sync commands. Participants manually play/pause to follow.
                    </div>
                  ) : (
                    <div className="text-sm">
                      🎬 <strong>HTML5 Video:</strong> Instructor controls automatically sync for all participants.
                    </div>
                  )}
                </div>
                
                {timeRemaining < 300 && (
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded border border-purple-200">
                    <div className="text-sm">
                      ⚡ <strong>Session ending soon!</strong> Upgrade to Premium for unlimited session time.
                      <button className="ml-2 bg-purple-500 text-white px-2 py-1 rounded text-xs hover:bg-purple-600">
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Exercise List with Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exercises.map((exercise) => {
                  const progress = exerciseProgress[exercise.id] || 0;
                  const isCompleted = progress >= 90;
                  
                  return (
                    <div
                      key={exercise.id}
                      className={`p-4 rounded-lg border transition-colors relative ${
                        exercise.id === session?.current_exercise_id
                          ? 'bg-blue-100 border-blue-500'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      } ${isInstructor ? 'cursor-pointer' : 'cursor-default'}`}
                      onClick={() => isInstructor && changeExercise(exercise.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{exercise.title}</h3>
                        {isCompleted && <span className="text-green-500 text-lg">✓</span>}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">Exercise {exercise.sequence_number}</p>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{progress}% complete</span>
                        {isInstructor && (
                          <p className="text-xs text-blue-600">Click to switch</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chat Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Live Chat</h3>
            
            <div className="h-64 overflow-y-auto mb-4 border rounded p-3 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg) => {
                  const isCurrentUser = msg.user_id === currentUser?.id;
                  const displayName = isCurrentUser ? 'You' : (msg.username || 'User');
                  
                  return (
                    <div key={msg.id} className={`mb-3 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      <div className="text-xs text-gray-500 mb-1">
                        {displayName} • {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                      <div className={`text-sm p-2 rounded inline-block max-w-xs ${
                        isCurrentUser 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white border'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}