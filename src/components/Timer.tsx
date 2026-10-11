import { Minus, Pause, PanelRight, Play, Plus, RefreshCw, Timer as TimerIcon } from 'lucide-react';
import { openPersistentTimerPanel, supportsPersistentTimerPanel } from '../utils/timerPanel';
import { usePersistentTimer, type TimerMode } from '../utils/usePersistentTimer';

interface TimerProps {
  variant?: 'popup' | 'panel';
}

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((part) => part.toString().padStart(2, '0')).join(':');
}

export function Timer({ variant = 'popup' }: TimerProps) {
  const { session, ready, selectMode, toggle, reset, adjustCountdown } = usePersistentTimer();
  const panelSupported = supportsPersistentTimerPanel();
  const finished = session.status === 'finished';
  const isRunning = session.status === 'running';
  const displayTime = session.mode === 'stopwatch' ? session.elapsedSeconds : session.remainingSeconds;
  const statusText = finished
    ? 'Time is up'
    : isRunning
      ? (variant === 'panel' ? 'Running in your side panel' : 'Running while you browse')
      : session.status === 'paused'
        ? 'Paused'
        : session.mode === 'stopwatch' ? 'Ready when you are' : 'Focus countdown';

  const startOrPause = () => {
    if (!isRunning && panelSupported && variant === 'popup') openPersistentTimerPanel();
    toggle();
  };

  const modes: TimerMode[] = ['stopwatch', 'countdown'];

  return (
    <section className={`app-timer-card app-surface border ${variant === 'panel' ? 'p-5 sm:p-6' : 'p-4'}`} data-variant={variant} aria-label="Timer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="app-timer-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
            <TimerIcon className="h-[19px] w-[19px]" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight">{variant === 'panel' ? 'QuickLaunch Timer' : 'Timer'}</h2>
            <p className="app-text-muted mt-0.5 flex items-center gap-1.5 text-xs">
              {isRunning && <span className="app-timer-live-dot" aria-hidden="true" />}
              {statusText}
            </p>
          </div>
        </div>
        {variant === 'popup' && panelSupported && (
          <button
            type="button"
            onClick={openPersistentTimerPanel}
            aria-label="Keep timer visible in the Chrome side panel"
            title="Keep timer visible in the Chrome side panel"
            className="app-control-hover app-text-muted app-focus rounded-2xl p-2 transition"
          >
            <PanelRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="app-timer-mode app-surface-soft mt-5 grid grid-cols-2 rounded-2xl p-1" role="group" aria-label="Timer mode">
        {modes.map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => selectMode(mode)}
            aria-pressed={session.mode === mode}
            className={`app-focus rounded-[18px] px-3 py-2 text-xs font-medium capitalize transition ${session.mode === mode ? 'app-timer-mode-active' : 'app-text-muted'}`}
          >
            {mode}
          </button>
        ))}
      </div>

      <div className="mt-5 flex min-h-[76px] items-center justify-center gap-2">
        {session.mode === 'countdown' && (
          <button
            type="button"
            onClick={() => adjustCountdown(-5)}
            disabled={!ready || isRunning}
            aria-label="Subtract five minutes"
            className="app-control-hover app-text-muted app-focus rounded-2xl p-2.5 transition disabled:opacity-35"
          >
            <Minus className="h-4 w-4" />
          </button>
        )}
        <output aria-live="polite" className={`app-timer-digits font-mono ${variant === 'panel' ? 'text-[32px]' : 'text-[38px]'} font-medium tabular-nums tracking-[-0.055em]`}>
          {formatTime(displayTime)}
        </output>
        {session.mode === 'countdown' && (
          <button
            type="button"
            onClick={() => adjustCountdown(5)}
            disabled={!ready || isRunning}
            aria-label="Add five minutes"
            className="app-control-hover app-text-muted app-focus rounded-2xl p-2.5 transition disabled:opacity-35"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-2.5">
        <button
          type="button"
          onClick={startOrPause}
          disabled={!ready || (finished && session.mode === 'countdown')}
          className="app-primary-button app-focus flex min-w-28 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={!ready}
          className="app-secondary-button app-focus flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>

      <p className="app-text-muted mt-3 text-center text-[11px] leading-relaxed">
        {panelSupported && variant === 'popup'
          ? 'Keeps running after this popup closes. The side panel stays beside your tabs.'
          : variant === 'panel'
            ? 'Timer progress is saved, even when this panel closes.'
            : 'Timer progress is saved when you close QuickLaunch.'}
      </p>
    </section>
  );
}
