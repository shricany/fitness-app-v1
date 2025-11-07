import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { MOCK_MODULES } from './constants';
import { DumbbellIcon, ChartBarIcon, SparklesIcon, UsersIcon } from './components/icons';
import { AICoach } from './components/AICoach';
import { Dashboard } from './components/Dashboard';
import { WorkoutSession } from './components/WorkoutSession';
import { WorkoutModule } from './types';

// Mock Auth Context
const AuthContext = React.createContext({ isAuthenticated: false, login: () => {}, logout: () => {} });
const useAuth = () => React.useContext(AuthContext);

const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);
    return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

const PrivateRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};


// Components defined in the same file for simplicity
const Header: React.FC = () => {
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();

    // Do not show header on session pages for immersive experience
    if (!isAuthenticated || location.pathname.startsWith('/session')) return null;

    const navLinkClasses = "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeLinkClasses = "bg-gray-700 text-white";
    const inactiveLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

    return (
        <header className="bg-gray-800 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center space-x-2 text-white">
                            <DumbbellIcon className="h-8 w-8 text-cyan-400" />
                            <span className="font-bold text-xl">SyncFit</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/dashboard" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                                <ChartBarIcon className="w-5 h-5" />
                                <span>Dashboard</span>
                            </NavLink>
                            <NavLink to="/" end className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                                <span>Workouts</span>
                            </NavLink>
                             <NavLink to="/ai-coach" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
                                <SparklesIcon className="w-5 h-5" />
                                <span>AI Coach</span>
                            </NavLink>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <button onClick={logout} className="bg-gray-700 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-xl text-center">
                <DumbbellIcon className="h-12 w-12 text-cyan-400 mx-auto" />
                <h1 className="text-3xl font-bold mt-4 mb-6">Welcome to SyncFit</h1>
                <p className="text-gray-400 mb-8">Your journey to fitness starts now. Press the button below to simulate login.</p>
                <button
                    onClick={handleLogin}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
                >
                    Log In
                </button>
            </div>
        </div>
    );
};

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            <div 
                className="relative flex-grow flex flex-col items-center justify-center text-center p-8"
                style={{
                    backgroundImage: `linear-gradient(rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 1)), url('https://picsum.photos/seed/fitness/1920/1080')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <DumbbellIcon className="h-16 w-16 text-cyan-400" />
                <h1 className="text-5xl md:text-7xl font-extrabold mt-4">SyncFit</h1>
                <p className="text-lg md:text-2xl mt-4 max-w-2xl text-gray-300">
                    Your Ultimate Fitness Companion. Work out solo or team up with friends in real-time.
                </p>
                <Link to="/login" className="mt-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 shadow-lg text-lg">
                    Get Started
                </Link>
            </div>
            
            <div className="bg-gray-900 py-16">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-gray-800 rounded-full mb-4">
                                <DumbbellIcon className="w-10 h-10 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Solo Workouts</h3>
                            <p className="text-gray-400">Follow curated workout modules at your own pace.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-gray-800 rounded-full mb-4">
                                <UsersIcon className="w-10 h-10 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Group Sessions</h3>
                            <p className="text-gray-400">Create or join real-time sessions with friends.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-gray-800 rounded-full mb-4">
                                <SparklesIcon className="w-10 h-10 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI Fitness Coach</h3>
                            <p className="text-gray-400">Get personalized advice and motivation anytime.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WorkoutModuleCard: React.FC<{ module: WorkoutModule }> = ({ module }) => {
    const navigate = useNavigate();

    const startSession = (mode: 'SOLO' | 'GROUP') => {
        navigate(`/session/${module.id}`, { state: { mode } });
    };

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1 flex flex-col">
            <img src={module.imageUrl} alt={module.title} className="w-full h-48 object-cover"/>
            <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-semibold bg-cyan-500/20 text-cyan-300 py-1 px-2 rounded-full self-start">{module.type}</span>
                <h2 className="text-xl font-bold mt-2 mb-2">{module.title}</h2>
                <p className="text-gray-400 text-sm flex-grow">{module.description}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => startSession('SOLO')} className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors">
                        <DumbbellIcon className="w-4 h-4" />
                        <span>Start Solo</span>
                    </button>
                    <button onClick={() => startSession('GROUP')} className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-cyan-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors">
                        <UsersIcon className="w-4 h-4" />
                        <span>Create Group</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const WorkoutList: React.FC = () => {
    const modules = MOCK_MODULES;
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Workout Modules</h1>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl">Choose a workout to start by yourself, or create a group session to exercise with friends in real-time.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map(module => (
                    <WorkoutModuleCard key={module.id} module={module} />
                ))}
            </div>
        </div>
    );
};

export default function App() {
  return (
    <AuthProvider>
        <HashRouter>
            <MainApp />
        </HashRouter>
    </AuthProvider>
  );
}

const MainApp: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated ? (
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1">
                        <Routes>
                            <Route path="/" element={<PrivateRoute><WorkoutList /></PrivateRoute>} />
                            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            <Route path="/ai-coach" element={<PrivateRoute><div className="p-4 md:p-8"><AICoach /></div></PrivateRoute>} />
                            <Route path="/session/:id" element={<PrivateRoute><WorkoutSession /></PrivateRoute>} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                </div>
            ) : (
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<LandingPage />} />
                </Routes>
            )}
        </>
    );
};
