import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Dumbbell, Target, History, Calendar, Activity, ChevronRight, Play, LogOut, MessageSquare, Heart, StretchVertical as Stretch } from 'lucide-react';
import { supabase } from './lib/supabase';
import { generateWorkoutPlan } from './lib/gemini';
import { Auth } from './components/Auth';
import { Analytics } from './components/Analytics';
import { AIChatAssistant } from './components/AIChatAssistant';
import { StrengthTraining } from './pages/StrengthTraining';
import { CardioTraining } from './pages/CardioTraining';
import { FlexibilityTraining } from './pages/FlexibilityTraining';

interface WorkoutPlan {
  name: string;
  duration: string;
  intensity: string;
  exercises: string[];
}

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userGoal, setUserGoal] = useState('strength');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [progressData, setProgressData] = useState([]);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    if (!session?.user?.id) return;

    const { data: metrics } = await supabase
      .from('progress_metrics')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: true });

    if (metrics) {
      setProgressData(metrics);
    }

    const { data: workouts } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('completed', false)
      .limit(1)
      .single();

    if (workouts) {
      setWorkoutPlan({
        name: workouts.name,
        duration: '45 minutes',
        intensity: 'Moderate',
        exercises: workouts.exercises || []
      });
    }
  };

  const handleGoalChange = async (goal: string) => {
    setUserGoal(goal);
    try {
      const plan = await generateWorkoutPlan(goal, 'intermediate');
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          user_id: session.user.id,
          name: `${goal.charAt(0).toUpperCase() + goal.slice(1)} Training`,
          date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setWorkoutPlan({
        name: data.name,
        duration: '45 minutes',
        intensity: 'Moderate',
        exercises: plan.split('\n').filter(Boolean)
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const renderTrainingButton = (to: string, icon: React.ReactNode, label: string) => (
    <Link
      to={to}
      className="w-full p-3 rounded-lg flex items-center justify-between bg-gray-50 text-gray-700 hover:bg-gray-100"
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5" />
    </Link>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Fitness Coach</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowChat(!showChat)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Chat Assistant</span>
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {showChat ? (
            <AIChatAssistant />
          ) : (
            <Routes>
              <Route path="/" element={
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Stats & Training Links */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Stats Overview */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4">Today's Overview</h2>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-indigo-50 rounded-xl">
                          <Activity className="h-6 w-6 text-indigo-600 mb-2" />
                          <p className="text-sm text-gray-600">Daily Progress</p>
                          <p className="text-2xl font-bold text-indigo-600">75%</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl">
                          <Target className="h-6 w-6 text-purple-600 mb-2" />
                          <p className="text-sm text-gray-600">Weekly Goal</p>
                          <p className="text-2xl font-bold text-purple-600">4/5</p>
                        </div>
                        <div className="p-4 bg-pink-50 rounded-xl">
                          <History className="h-6 w-6 text-pink-600 mb-2" />
                          <p className="text-sm text-gray-600">Streak</p>
                          <p className="text-2xl font-bold text-pink-600">12 days</p>
                        </div>
                      </div>
                    </div>

                    {/* Training Programs */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4">Training Programs</h2>
                      <div className="space-y-3">
                        {renderTrainingButton("/strength", <Dumbbell className="h-5 w-5 text-indigo-600" />, "Strength Training")}
                        {renderTrainingButton("/cardio", <Heart className="h-5 w-5 text-red-600" />, "Cardio Training")}
                        {renderTrainingButton("/flexibility", <Stretch className="h-5 w-5 text-purple-600" />, "Flexibility Training")}
                      </div>
                    </div>

                    <Analytics progressData={progressData} />
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4">Fitness Goals</h2>
                      <div className="space-y-3">
                        {['strength', 'cardio', 'flexibility'].map((goal) => (
                          <button
                            key={goal}
                            onClick={() => handleGoalChange(goal)}
                            className={`w-full p-3 rounded-lg flex items-center justify-between ${
                              userGoal === goal ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="capitalize">{goal} Training</span>
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">HIIT Workout</p>
                              <p className="text-sm text-gray-500">Tomorrow, 9:00 AM</p>
                            </div>
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Yoga Session</p>
                              <p className="text-sm text-gray-500">Wed, 10:30 AM</p>
                            </div>
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="/strength" element={<StrengthTraining />} />
              <Route path="/cardio" element={<CardioTraining />} />
              <Route path="/flexibility" element={<FlexibilityTraining />} />
            </Routes>
          )}
        </main>
      </div>
    </Router>
  );
}

export default App;