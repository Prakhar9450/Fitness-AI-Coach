import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateWeeklySchedule } from "../lib/gemini";

interface DaySchedule {
  day: string;
  content: string;
  isExpanded: boolean;
}

interface TrainingScheduleProps {
  type: "strength" | "cardio" | "flexibility";
}

export function TrainingSchedule({ type }: TrainingScheduleProps) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedule();
  }, [type]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await generateWeeklySchedule(type);
      const days = response.split(/Day \d+:/g).filter(Boolean);

      setSchedule(
        days.map((content, index) => ({
          day: `Day ${index}`,
          content: content.trim(),
          isExpanded: false,
        }))
      );
    } catch (err) {
      setError("Failed to load schedule. Please try again.");
      console.error("Error fetching schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (index: number) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === index ? { ...day, isExpanded: !day.isExpanded } : day
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {schedule.map((day, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => toggleDay(index)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center space-x-4">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">{day.day}</h3>
            </div>
            {day.isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>

          {day.isExpanded && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="prose max-w-none">
                {day.content.split("\n").map((line, i) => (
                  <p key={i} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
