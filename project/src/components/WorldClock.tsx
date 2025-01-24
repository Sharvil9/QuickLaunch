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
          {/* Clock numbers */}
          {[12, 3, 6, 9].map((num) => {
            const angle = (num * 30) - 90; // Subtract 90 to start from 12 o'clock
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * 32;
            const y = Math.sin(radians) * 32;
            
            return (
              <div
                key={num}
                className={`absolute ${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs font-light`}
                style={{
                  transform: 'translate(-50%, -50%)',
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`
                }}
              >
                {num}
              </div>
            );
          })}
          
          {/* Clock markers */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) - 90;
            const radians = (angle * Math.PI) / 180;
            const x = Math.cos(radians) * 35;
            const y = Math.sin(radians) * 35;
            
            return (
              <div
                key={i}
                className={`absolute w-0.5 h-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-400'}`}
                style={{
                  transform: `rotate(${i * 30}deg)`,
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`
                }}
              />
            );
          })}

          {/* Clock hands */}
          <div
            className={`w-1 h-4 absolute origin-bottom ${darkMode ? 'bg-white' : 'bg-black'}`}
            style={{ transform: `rotate(${hourDegrees}deg)`, left: 'calc(50% - 1px)', bottom: '50%' }}
          />
          <div
            className={`w-0.5 h-6 absolute origin-bottom ${darkMode ? 'bg-white' : 'bg-black'}`}
            style={{ transform: `rotate(${minuteDegrees}deg)`, left: 'calc(50% - 0.5px)', bottom: '50%' }}
          />
          <div
            className="w-0.5 h-7 absolute origin-bottom bg-red-500"
            style={{ transform: `rotate(${secondDegrees}deg)`, left: 'calc(50% - 0.5px)', bottom: '50%' }}
          />
          
          {/* Center dot */}
          <div className={`w-2 h-2 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${darkMode ? 'bg-white' : 'bg-black'}`} />
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