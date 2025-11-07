
import { User, WorkoutModule, WorkoutType, DashboardData } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user1', name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?u=user1' },
  { id: 'user2', name: 'Jordan', avatarUrl: 'https://i.pravatar.cc/150?u=user2' },
  { id: 'user3', name: 'Taylor', avatarUrl: 'https://i.pravatar.cc/150?u=user3' },
];

export const MOCK_MODULES: WorkoutModule[] = [
  {
    id: 'module1',
    title: 'Morning Yoga Flow',
    type: WorkoutType.YOGA,
    description: 'Start your day with a refreshing yoga session to awaken your body and mind.',
    imageUrl: 'https://picsum.photos/seed/yoga/600/400',
    exercises: [
      { id: 'ex1', moduleId: 'module1', title: 'Sun Salutation A', duration: 180, videoUrl: 'https://www.youtube.com/embed/t7W4p_bQz8E', upvotes: 120 },
      { id: 'ex2', moduleId: 'module1', title: 'Warrior II Pose', duration: 60, videoUrl: 'https://www.youtube.com/embed/40_izb_r-1s', upvotes: 95 },
      { id: 'ex3', moduleId: 'module1', title: 'Triangle Pose', duration: 60, videoUrl: 'https://www.youtube.com/embed/z428I8nwhWc', upvotes: 80 },
      { id: 'ex4', moduleId: 'module1', title: 'Savasana', duration: 300, videoUrl: 'https://www.youtube.com/embed/YpBUbf9-mJ4', upvotes: 150 },
    ],
  },
  {
    id: 'module2',
    title: 'Full Body HIIT Blast',
    type: WorkoutType.HIIT,
    description: 'A high-intensity interval training session designed to burn calories and build strength.',
    imageUrl: 'https://picsum.photos/seed/hiit/600/400',
    exercises: [
      { id: 'ex5', moduleId: 'module2', title: 'Jumping Jacks', duration: 60, videoUrl: 'https://www.youtube.com/embed/c4DAnQ6DtF8', upvotes: 250 },
      { id: 'ex6', moduleId: 'module2', title: 'High Knees', duration: 60, videoUrl: 'https://www.youtube.com/embed/D0rM2L9v5_w', upvotes: 210 },
      { id: 'ex7', moduleId: 'module2', title: 'Burpees', duration: 60, videoUrl: 'https://www.youtube.com/embed/auKl-0-s_Fw', upvotes: 300 },
      { id: 'ex8', moduleId: 'module2', title: 'Mountain Climbers', duration: 60, videoUrl: 'https://www.youtube.com/embed/nmwgirg2B5s', upvotes: 280 },
    ],
  },
  {
    id: 'module3',
    title: 'Tabata Power Core',
    type: WorkoutType.TABATA,
    description: '20 seconds of work, 10 seconds of rest. A quick and effective core workout.',
    imageUrl: 'https://picsum.photos/seed/tabata/600/400',
    exercises: [
      { id: 'ex9', moduleId: 'module3', title: 'Crunches', duration: 20, videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU', upvotes: 180 },
      { id: 'ex10', moduleId: 'module3', title: 'Leg Raises', duration: 20, videoUrl: 'https://www.youtube.com/embed/l4kQd9eWJmk', upvotes: 170 },
      { id: 'ex11', moduleId: 'module3', title: 'Plank', duration: 20, videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c', upvotes: 220 },
      { id: 'ex12', moduleId: 'module3', title: 'Bicycle Crunches', duration: 20, videoUrl: 'https://www.youtube.com/embed/9FGilxCkpgM', upvotes: 190 },
    ],
  },
];

export const MOCK_DASHBOARD_DATA: DashboardData = {
  userId: 'user1',
  streak: 12,
  completedWorkouts: 25,
  totalTime: 750,
  workoutsPerWeek: [
    { name: 'Mon', workouts: 2 },
    { name: 'Tue', workouts: 1 },
    { name: 'Wed', workouts: 3 },
    { name: 'Thu', workouts: 0 },
    { name: 'Fri', workouts: 2 },
    { name: 'Sat', workouts: 1 },
    { name: 'Sun', workouts: 0 },
  ],
  wallPosts: [
    { id: 'post1', user: MOCK_USERS[0], text: 'Just crushed the Full Body HIIT Blast! Feeling amazing!', timestamp: Date.now() - 86400000 },
    { id: 'post2', user: MOCK_USERS[1], text: 'Completed the Morning Yoga Flow. So peaceful.', timestamp: Date.now() - 172800000 },
    { id: 'post3', user: MOCK_USERS[0], text: 'Tabata Power Core was intense but worth it!', timestamp: Date.now() - 345600000 },
  ],
};
   