import React from 'react';
import { Dumbbell } from 'lucide-react';
import { TrainingSchedule } from '../components/TrainingSchedule';

export function StrengthTraining() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Dumbbell className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Strength Training Schedule</h1>
        </div>
        
        <div className="prose max-w-none mb-6">
          <p className="text-gray-600">
            This comprehensive strength training program is designed to build muscle, increase strength, 
            and improve overall fitness. Each day focuses on different muscle groups to ensure proper 
            recovery and maximum gains.
          </p>
        </div>

        <TrainingSchedule type="strength" />
      </div>
    </div>
  );
}