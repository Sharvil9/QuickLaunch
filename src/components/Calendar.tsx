import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long' });

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const today = new Date();
  const monthName = monthFormatter.format(currentDate);
  const year = currentDate.getFullYear();
  const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
  const isCurrentMonth = year === today.getFullYear() && currentDate.getMonth() === today.getMonth();

  const shiftMonth = (amount: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth() + amount, 1));
  };

  return (
    <div className="app-calendar-card app-surface border p-3.5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="app-calendar-month text-[11px] font-semibold uppercase tracking-[0.13em]">{monthName}</p>
          <h3 className="app-calendar-heading mt-0.5 text-[27px] font-semibold leading-none tracking-[-0.045em] tabular-nums">{year}</h3>
        </div>
        <div className="app-calendar-navigation mb-0.5 flex items-center gap-1 rounded-full p-0.5">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
            className="app-control-hover app-text-muted app-focus flex h-8 w-8 items-center justify-center rounded-full transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
            className="app-control-hover app-text-muted app-focus flex h-8 w-8 items-center justify-center rounded-full transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7" aria-hidden="true">
        {weekdayLabels.map((day, index) => (
          <span key={`${day}-${index}`} className="app-calendar-weekday py-1 text-center text-[10px] font-medium">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7" role="grid" aria-label={`${monthName} ${year}`}>
        {Array.from({ length: firstDayOfMonth }, (_, index) => (
          <span key={`empty-${index}`} className="mx-auto h-8 w-8" aria-hidden="true" />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <span
              key={day}
              role="gridcell"
              aria-current={isToday ? 'date' : undefined}
              aria-label={`${monthName} ${day}${isToday ? ', today' : ''}`}
              className={`app-calendar-day mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[12px] tabular-nums transition ${isToday ? 'app-calendar-today font-semibold' : 'app-calendar-date'}`}
            >
              {day}
            </span>
          );
        })}
      </div>

      <div className="app-calendar-footer mt-2.5 flex items-center justify-between border-t pt-2.5">
        <span className="app-text-muted text-[10px]">{isCurrentMonth ? 'Today' : `${monthName} ${year}`}</span>
        <button
          type="button"
          onClick={() => setCurrentDate(new Date())}
          disabled={isCurrentMonth}
          className="app-calendar-today-link app-focus rounded-full px-2.5 py-1 text-[10px] font-semibold transition disabled:pointer-events-none disabled:opacity-0"
        >
          Go to today
        </button>
      </div>
    </div>
  );
}
