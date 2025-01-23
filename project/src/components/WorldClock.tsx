import React, { useState, useEffect } from 'react';

interface WorldClockProps {
  darkMode: boolean;
}

export function WorldClock({ darkMode }: WorldClockProps) {
  const [times, setTimes] = useState({
    newYork: new Date(),
    london: new Date(),
    kolkata: new Date(),
    sydney: new Date()
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
      setTimes({
        newYork: new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' })),
        london: new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' })),
        kolkata: new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })),
        sydney: new Date(now.toLocaleString('en-US', { timeZone: 'Australia/Sydney' }))
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderClock = (time: Date, city: string) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourDegrees = (hours % 12) * 30 + minutes / 2;
    const minuteDegrees = minutes * 6;
    const secondDegrees = seconds * 6;

    return (
      <div className="flex flex-col items-center">
        <div className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {city}
        </div>
        <div className={`w-20 h-20 rounded-full relative ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {/* Clock face */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Hour hand */}
            <div
              className={`w-1 h-4 absolute origin-bottom ${darkMode ? 'bg-white' : 'bg-black'}`}
              style={{ transform: `rotate(${hourDegrees}deg)` }}
            />
            {/* Minute hand */}
            <div
              className={`w-0.5 h-6 absolute origin-bottom ${darkMode ? 'bg-white' : 'bg-black'}`}
              style={{ transform: `rotate(${minuteDegrees}deg)` }}
            />
            {/* Second hand */}
            <div
              className="w-0.5 h-7 absolute origin-bottom bg-red-500"
              style={{ transform: `rotate(${secondDegrees}deg)` }}
            />
            {/* Center dot */}
            <div className={`w-2 h-2 rounded-full absolute ${darkMode ? 'bg-white' : 'bg-black'}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {renderClock(times.newYork, 'New York')}
      {renderClock(times.london, 'London')}
      {renderClock(times.kolkata, 'Kolkata')}
      {renderClock(times.sydney, 'Sydney')}
    </div>
  );
}