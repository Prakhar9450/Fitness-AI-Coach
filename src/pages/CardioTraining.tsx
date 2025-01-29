import React from 'react';
import { Heart } from 'lucide-react';
import { TrainingSchedule } from '../components/TrainingSchedule';

export function CardioTraining() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Heart className="h-8 w-8 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Cardio Training Schedule</h1>
        </div>
        
        <div className="prose max-w-none mb-6">
          <p className="text-gray-600">
            This cardio training program is designed to improve cardiovascular endurance, burn calories, 
            and enhance overall stamina. The schedule includes a mix of high-intensity and steady-state 
            cardio exercises for optimal results.
          </p>
        </div>

        <TrainingSchedule type="cardio" />
      </div>
    </div>
  );
}