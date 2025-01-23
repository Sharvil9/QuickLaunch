import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  darkMode: boolean;
}

export function Calendar({ darkMode }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth}>
          <ChevronLeft className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
        </button>
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button onClick={nextMonth}>
          <ChevronRight className={darkMode ? 'text-gray-300' : 'text-gray-700'} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div
            key={day}
            className={`text-center text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-8" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isToday = 
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={day}
              className={`h-8 flex items-center justify-center text-sm rounded-full
                ${isToday 
                  ? 'bg-blue-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}