export enum WorkoutType {
  YOGA = 'Yoga',
  HIIT = 'HIIT',
  TABATA = 'Tabata',
  STRENGTH = 'Strength',
}

export enum SessionMode {
  SOLO = 'Solo',
  GROUP = 'Group',
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Exercise {
  id: string;
  moduleId: string;
  title: string;
  duration: number; // in seconds
  videoUrl: string;
  upvotes: number;
}

export interface WorkoutModule {
  id: string;
  title: string;
  type: WorkoutType;
  description: string;
  imageUrl: string;
  exercises: Exercise[];
}

export interface ChatMessage {
  id: string;
  user: User;
  message: string;
  timestamp: number;
}

export interface WallPost {
  id:string;
  user: User;
  text: string;
  timestamp: number;
}

export interface DashboardData {
  userId: string;
  streak: number;
  completedWorkouts: number;
  totalTime: number; // in minutes
  workoutsPerWeek: { name: string; workouts: number }[];
  wallPosts: WallPost[];
}
