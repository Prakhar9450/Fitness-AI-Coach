import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressData {
  date: string;
  value: number;
  type: string;
}

interface AnalyticsProps {
  progressData: ProgressData[];
}

export function Analytics({ progressData }: AnalyticsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Progress Analytics</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#6366f1" name="Progress" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}