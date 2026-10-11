import { useEffect, useState } from 'react';

const locations = [
  { city: 'New York', zone: 'America/New_York' },
  { city: 'London', zone: 'Europe/London' },
  { city: 'Kolkata', zone: 'Asia/Kolkata' },
  { city: 'Sydney', zone: 'Australia/Sydney' },
];

const clockFormatters = locations.map(({ zone }) => new Intl.DateTimeFormat('en-US', {
  timeZone: zone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
}));

const digitalFormatters = locations.map(({ zone }) => new Intl.DateTimeFormat('en-US', {
  timeZone: zone,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
  timeZoneName: 'short',
}));

const accessibleTimeFormatters = locations.map(({ zone }) => new Intl.DateTimeFormat('en-US', {
  timeZone: zone,
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
}));

function getTimePart(parts: Intl.DateTimeFormatPart[], type: 'hour' | 'minute' | 'second') {
  return Number(parts.find((part) => part.type === type)?.value ?? 0);
}

export function WorldClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2.5" aria-label="World clocks">
      {locations.map(({ city }, index) => {
        const parts = clockFormatters[index].formatToParts(now);
        const hour = getTimePart(parts, 'hour');
        const minute = getTimePart(parts, 'minute');
        const second = getTimePart(parts, 'second');
        const hourDegrees = ((hour % 12) * 30) + minute / 2;
        const minuteDegrees = minute * 6;
        const secondDegrees = second * 6;
        const digitalParts = digitalFormatters[index].formatToParts(now);
        const digitalHour = digitalParts.find((part) => part.type === 'hour')?.value ?? '12';
        const digitalMinute = digitalParts.find((part) => part.type === 'minute')?.value ?? '00';
        const dayPeriod = digitalParts.find((part) => part.type === 'dayPeriod')?.value ?? '';
        const timeZoneName = digitalParts.find((part) => part.type === 'timeZoneName')?.value ?? '';
        const accessibleTime = accessibleTimeFormatters[index].format(now);

        return (
          <article key={city} className="app-clock-widget app-surface border p-2.5">
            <div className="mb-2 flex items-center justify-between gap-1.5">
              <h3 className="truncate text-xs font-semibold tracking-tight">{city}</h3>
              <span className="app-clock-zone shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide">{timeZoneName}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="app-clock-face relative h-[62px] w-[62px] shrink-0 rounded-full" role="img" aria-label={`${city}, ${accessibleTime}`}>
                {[12, 3, 6, 9].map((number) => {
                  const angle = (number * 30) - 90;
                  const radians = (angle * Math.PI) / 180;
                  const x = Math.cos(radians) * 22;
                  const y = Math.sin(radians) * 22;
                  return (
                    <span
                      key={number}
                      className="app-gold-text absolute text-[8px] font-medium"
                      style={{
                        transform: 'translate(-50%, -50%)',
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    >
                      {number}
                    </span>
                  );
                })}

                {Array.from({ length: 12 }, (_, tick) => {
                  const angle = (tick * 30) - 90;
                  const radians = (angle * Math.PI) / 180;
                  const x = Math.cos(radians) * 27;
                  const y = Math.sin(radians) * 27;
                  return (
                    <span
                      key={tick}
                      aria-hidden="true"
                      className="app-clock-tick absolute h-1 w-[2px] rounded-full"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${tick * 30}deg)`,
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    />
                  );
                })}

                <span aria-hidden="true" className="app-clock-hour-hand absolute bottom-1/2 left-1/2 h-[14px] w-[3px] origin-bottom rounded-full" style={{ transform: `translateX(-50%) rotate(${hourDegrees}deg)` }} />
                <span aria-hidden="true" className="app-clock-minute-hand absolute bottom-1/2 left-1/2 h-[20px] w-[2px] origin-bottom rounded-full" style={{ transform: `translateX(-50%) rotate(${minuteDegrees}deg)` }} />
                <span aria-hidden="true" className="app-clock-second-hand absolute bottom-1/2 left-1/2 h-[23px] w-px origin-bottom" style={{ transform: `translateX(-50%) rotate(${secondDegrees}deg)` }} />
                <span aria-hidden="true" className="app-clock-center absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1 whitespace-nowrap">
                  <span className="app-clock-digital text-[19px] font-medium tabular-nums tracking-[-0.06em]">
                    {digitalHour}:{digitalMinute}
                  </span>
                  <span className="app-clock-period text-[10px] font-semibold">{dayPeriod}</span>
                </div>
                <p className="app-text-muted mt-0.5 text-[10px]">Local time</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
