import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon, Play, Pause, RefreshCw } from 'lucide-react';
import type { Timer as TimerType } from '../types';

interface TimerProps {
  onClose: () => void;
  darkMode: boolean;
}

export function Timer({ onClose, darkMode }: TimerProps) {
  const [timer, setTimer] = useState<TimerType>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isRunning: false
  });
  const [isStopwatch, setIsStopwatch] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning) {
      interval = setInterval(() => {
        if (isStopwatch) {
          setTimer(prev => {
            const newSeconds = prev.seconds + 1;
            const newMinutes = prev.minutes + Math.floor(newSeconds / 60);
            const newHours = prev.hours + Math.floor(newMinutes / 60);
            
            return {
              hours: newHours,
              minutes: newMinutes % 60,
              seconds: newSeconds % 60,
              isRunning: true
            };
          });
        } else {
          setTimer(prev => {
            if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
              return { ...prev, isRunning: false };
            }

            let newSeconds = prev.seconds - 1;
            let newMinutes = prev.minutes;
            let newHours = prev.hours;

            if (newSeconds < 0) {
              newSeconds = 59;
              newMinutes--;
            }
            if (newMinutes < 0) {
              newMinutes = 59;
              newHours--;
            }

            return {
              hours: newHours,
              minutes: newMinutes,
              seconds: newSeconds,
              isRunning: true
            };
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, isStopwatch]);

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setTimer({ hours: 0, minutes: 0, seconds: 0, isRunning: false });
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <div className={`fixed right-4 bottom-4 rounded-lg shadow-lg p-4 w-64
      ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <TimerIcon className="w-4 h-4" />
          <span className="font-medium">{isStopwatch ? 'Stopwatch' : 'Timer'}</span>
        </div>
        <button 
          onClick={onClose}
          className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ×
        </button>
      </div>
      
      <div className="text-center mb-4">
        <div className="text-3xl font-mono">
          {formatTime(timer.hours)}:{formatTime(timer.minutes)}:{formatTime(timer.seconds)}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
        >
          {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          onClick={resetTimer}
          className={`p-2 rounded-full ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}