import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// FIX: Import YouTubeProps to correctly type the YouTube player options.
import YouTube, { YouTubeProps } from 'react-youtube';
import { MOCK_MODULES, MOCK_USERS } from '../constants';
import { WorkoutModule, Exercise, ChatMessage, User, SessionMode } from '../types';
import { ArrowUpIcon, PaperAirplaneIcon, PlayIcon, PauseIcon, ArrowLeftIcon } from './icons';

const ChatWindow: React.FC<{ messages: ChatMessage[]; onSendMessage: (msg: string) => void }> = ({ messages, onSendMessage }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSend = () => {
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg flex flex-col h-full">
            <h3 className="text-lg font-bold p-3 border-b border-gray-700">Group Chat</h3>
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {messages.map(msg => (
                    <div key={msg.id} className="flex items-start space-x-2">
                        <img src={msg.user.avatarUrl} alt={msg.user.name} className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="font-semibold text-sm text-cyan-400">{msg.user.name}</p>
                            <p className="text-sm">{msg.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-gray-700 flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                    placeholder="Type a message..."
                />
                <button onClick={handleSend} className="bg-cyan-600 text-white rounded-full p-2.5 hover:bg-cyan-500 transition">
                    <PaperAirplaneIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export const WorkoutSession: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [module, setModule] = useState<WorkoutModule | null>(null);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<any>(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const sessionMode = location.state?.mode === 'GROUP' ? SessionMode.GROUP : SessionMode.SOLO;
    const isHost = MOCK_USERS[0].id === 'user1'; // Mock current user is host

    useEffect(() => {
        const foundModule = MOCK_MODULES.find(m => m.id === id);
        if (foundModule) {
            setModule(foundModule);
            setTimer(foundModule.exercises[0].duration);
        }
    }, [id]);
    
    useEffect(() => {
        if (timer > 0 && isPlaying) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer, isPlaying]);

    const goToNextExercise = () => {
        if (module && currentExerciseIndex < module.exercises.length - 1) {
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.error("Error destroying YouTube player:", e);
                }
            }
            playerRef.current = null;
            setIsPlayerReady(false);

            // FIX: Defer the state update to the next event loop tick. This allows the player
            // to be fully destroyed before React re-renders, preventing the race condition
            // that causes the "circular structure" error.
            setTimeout(() => {
                const nextIndex = currentExerciseIndex + 1;
                setCurrentExerciseIndex(nextIndex);
                setTimer(module.exercises[nextIndex].duration);
            }, 0);
        }
    };
    
    const handleUpvote = (exerciseId: string) => {
        setUpvoted(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
    };

    const handleSendMessage = (message: string) => {
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            user: MOCK_USERS[0], // Mock current user
            message,
            timestamp: Date.now(),
        };
        setChatMessages(prev => [...prev, newMessage]);
    };
    
    const finishWorkout = () => {
        alert("Workout Complete! You're awesome!");
        navigate('/dashboard');
    }

    const handlePlayPause = () => {
        const player = playerRef.current;
        if (!player || timer === 0) return;
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }

    const onPlayerReady = (event: any) => {
        playerRef.current = event.target;
        // FIX: Mute the player programmatically on ready as 'mute' is not a valid playerVar.
        // This is necessary for autoplay to work in most browsers.
        event.target.mute();
        setIsPlayerReady(true);
    };

    if (!module) return <div className="text-center p-8">Loading workout...</div>;
    
    const currentExercise = module.exercises[currentExerciseIndex];
    const progress = timer > 0 ? (currentExercise.duration - timer) / currentExercise.duration * 100 : 100;
    const canControl = sessionMode === SessionMode.SOLO || isHost;
    
    const videoId = new URL(currentExercise.videoUrl).searchParams.get('v') || currentExercise.videoUrl.split('/').pop();
    
    // FIX: Add explicit type to youtubeOpts to prevent type errors with playerVars.
    const youtubeOpts: YouTubeProps['opts'] = {
        playerVars: {
            autoplay: 1,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            loop: 1,
            playlist: videoId,
        },
    };

    return (
        <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-4rem)]">
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 shadow-xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate('/')} className="flex items-center space-x-2 text-gray-300 hover:text-white transition">
                        <ArrowLeftIcon className="w-5 h-5"/>
                        <span>Leave Session</span>
                    </button>
                    <div className={`text-sm font-bold py-1 px-3 rounded-full ${sessionMode === SessionMode.GROUP ? 'bg-orange-500/30 text-orange-300' : 'bg-cyan-500/30 text-cyan-300'}`}>
                        {sessionMode} Mode
                    </div>
                </div>

                <div className="aspect-w-16 aspect-h-9 mb-4 relative rounded-lg overflow-hidden">
                    <YouTube
                        key={videoId}
                        videoId={videoId}
                        opts={youtubeOpts}
                        onReady={onPlayerReady}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onError={(e) => console.error('YouTube Player Error:', e)}
                        className="absolute top-0 left-0 w-full h-full"
                        iframeClassName="w-full h-full"
                    />
                     {!isPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                           <div className="text-center text-white">
                                {timer === 0 ? <p className="text-2xl font-bold">Finished!</p> : <p className="text-2xl font-bold">Paused</p>}
                           </div>
                        </div>
                     )}
                </div>
                
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl md:text-3xl font-bold">{currentExercise.title}</h2>
                        <span className="text-3xl font-mono text-cyan-400">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s linear' }}></div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4">
                    <button onClick={() => handleUpvote(currentExercise.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${upvoted[currentExercise.id] ? 'bg-cyan-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        <ArrowUpIcon className="w-5 h-5"/>
                        <span>Upvote</span>
                        <span className="text-sm text-gray-400">{currentExercise.upvotes + (upvoted[currentExercise.id] ? 1 : 0)}</span>
                    </button>
                   
                    <div className="flex items-center gap-4">
                        {(canControl) && (
                            <button onClick={handlePlayPause} disabled={timer === 0 || !isPlayerReady} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                                <span>{isPlaying ? 'Pause' : 'Play'}</span>
                            </button>
                        )}

                        {currentExerciseIndex < module.exercises.length - 1 ? (
                            <button onClick={goToNextExercise} disabled={!canControl} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition disabled:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                        ) : (
                            <button onClick={finishWorkout} disabled={!canControl} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition disabled:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed">Finish</button>
                        )}
                    </div>
                </div>
                 {!canControl && sessionMode === SessionMode.GROUP && (
                    <p className="text-center text-sm text-gray-400 mt-4">Waiting for the host to control the session.</p>
                )}
            </div>

            <div className="flex flex-col gap-8 h-full">
                {sessionMode === SessionMode.GROUP && (
                    <div className="bg-gray-800 rounded-lg p-4 shadow-xl">
                        <h3 className="text-lg font-bold mb-3">Group Members</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                            {MOCK_USERS.slice(0, 5).map(user => (
                                <div key={user.id} className="text-center">
                                    <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 mx-auto rounded-full border-2 border-cyan-500"/>
                                    <p className="text-xs mt-1 truncate">{user.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {sessionMode === SessionMode.GROUP ? (
                    <ChatWindow messages={chatMessages} onSendMessage={handleSendMessage} />
                ) : (
                     <div className="bg-gray-800 rounded-lg p-4 shadow-xl flex-1">
                        <h3 className="text-lg font-bold mb-3">Up Next</h3>
                        <ul className="space-y-2">
                           {module.exercises.slice(currentExerciseIndex + 1).map((ex, index) => (
                               <li key={ex.id} className={`p-2 rounded ${index === 0 ? 'bg-gray-700' : ''}`}>
                                   <p className="font-semibold">{ex.title}</p>
                                   <p className="text-sm text-gray-400">{Math.floor(ex.duration/60)}:{ (ex.duration%60).toString().padStart(2,'0')}</p>
                               </li>
                           ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};