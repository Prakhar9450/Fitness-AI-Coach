import React from 'react';
import { Cog as Yoga } from 'lucide-react';
import { TrainingSchedule } from '../components/TrainingSchedule';

export function FlexibilityTraining() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Yoga className="h-8 w-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Flexibility Training Schedule</h1>
        </div>
        
        <div className="prose max-w-none mb-6">
          <p className="text-gray-600">
            This flexibility training program focuses on improving range of motion, reducing muscle tension, 
            and enhancing overall mobility. The schedule includes stretching routines, yoga poses, and 
            mobility exercises for a well-rounded approach.
          </p>
        </div>

        <TrainingSchedule type="flexibility" />
      </div>
    </div>
  );
}