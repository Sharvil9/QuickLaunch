import { useCallback, useEffect, useRef, useState } from 'react';
import { readSetting, subscribeToSetting, writeSetting } from './storage';

export type TimerMode = 'stopwatch' | 'countdown';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface TimerSession {
  mode: TimerMode;
  status: TimerStatus;
  elapsedSeconds: number;
  remainingSeconds: number;
  startedAt: number | null;
  updatedAt: number;
}

const STORAGE_KEY = 'timerSession';
const DEFAULT_COUNTDOWN_SECONDS = 25 * 60;

const freshSession = (): TimerSession => ({
  mode: 'stopwatch',
  status: 'idle',
  elapsedSeconds: 0,
  remainingSeconds: DEFAULT_COUNTDOWN_SECONDS,
  startedAt: null,
  updatedAt: Date.now(),
});

function isTimerSession(value: unknown): value is TimerSession {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<TimerSession>;
  return (candidate.mode === 'stopwatch' || candidate.mode === 'countdown')
    && (candidate.status === 'idle' || candidate.status === 'running' || candidate.status === 'paused' || candidate.status === 'finished')
    && Number.isFinite(candidate.elapsedSeconds)
    && Number.isFinite(candidate.remainingSeconds)
    && (candidate.startedAt === null || Number.isFinite(candidate.startedAt))
    && Number.isFinite(candidate.updatedAt);
}

export function readTimerAt(session: TimerSession, now: number): TimerSession {
  if (session.status !== 'running' || session.startedAt === null) return session;

  const elapsedSinceStart = Math.max(0, Math.floor((now - session.startedAt) / 1000));
  if (session.mode === 'stopwatch') {
    return { ...session, elapsedSeconds: session.elapsedSeconds + elapsedSinceStart };
  }

  const remainingSeconds = Math.max(0, session.remainingSeconds - elapsedSinceStart);
  return remainingSeconds === 0
    ? { ...session, status: 'finished', remainingSeconds: 0, startedAt: null }
    : { ...session, remainingSeconds };
}

export function usePersistentTimer() {
  const [session, setSession] = useState<TimerSession>(freshSession);
  const [now, setNow] = useState(() => Date.now());
  const [ready, setReady] = useState(false);
  const sessionRef = useRef(session);
  const receivedStorageChange = useRef(false);

  const persist = useCallback((next: TimerSession) => {
    sessionRef.current = next;
    setSession(next);
    void writeSetting(STORAGE_KEY, next);
  }, []);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = subscribeToSetting<TimerSession>(STORAGE_KEY, (stored) => {
      if (!mounted || !isTimerSession(stored)) return;
      receivedStorageChange.current = true;
      sessionRef.current = stored;
      setSession(stored);
    });

    void readSetting<TimerSession | undefined>(STORAGE_KEY, undefined).then((stored) => {
      if (!mounted || receivedStorageChange.current || !isTimerSession(stored)) return;
      sessionRef.current = stored;
      setSession(stored);
    }).finally(() => {
      if (mounted) setReady(true);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session.status !== 'running') return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [session.status]);

  const current = readTimerAt(session, now);

  useEffect(() => {
    if (session.mode !== 'countdown' || session.status !== 'running' || current.status !== 'finished') return;
    persist({ ...current, updatedAt: Date.now() });
  }, [current, now, persist, session.mode, session.status]);

  const selectMode = useCallback((mode: TimerMode) => {
    const at = Date.now();
    const snapshot = readTimerAt(sessionRef.current, at);
    const status = snapshot.status === 'running'
      ? 'paused'
      : snapshot.status === 'finished' ? 'idle' : snapshot.status;
    persist({ ...snapshot, mode, status, startedAt: null, updatedAt: at });
    setNow(at);
  }, [persist]);

  const toggle = useCallback(() => {
    const at = Date.now();
    const snapshot = readTimerAt(sessionRef.current, at);
    if (snapshot.status === 'running') {
      persist({ ...snapshot, status: 'paused', startedAt: null, updatedAt: at });
    } else if (snapshot.mode === 'stopwatch' || snapshot.remainingSeconds > 0) {
      persist({ ...snapshot, status: 'running', startedAt: at, updatedAt: at });
    }
    setNow(at);
  }, [persist]);

  const reset = useCallback(() => {
    const at = Date.now();
    const previous = sessionRef.current;
    persist({
      ...previous,
      status: 'idle',
      elapsedSeconds: 0,
      remainingSeconds: DEFAULT_COUNTDOWN_SECONDS,
      startedAt: null,
      updatedAt: at,
    });
    setNow(at);
  }, [persist]);

  const adjustCountdown = useCallback((minutes: number) => {
    const at = Date.now();
    const snapshot = readTimerAt(sessionRef.current, at);
    if (snapshot.status === 'running') return;
    persist({
      ...snapshot,
      status: snapshot.status === 'finished' ? 'idle' : snapshot.status,
      remainingSeconds: Math.max(60, snapshot.remainingSeconds + minutes * 60),
      startedAt: null,
      updatedAt: at,
    });
    setNow(at);
  }, [persist]);

  return {
    session: current,
    ready,
    selectMode,
    toggle,
    reset,
    adjustCountdown,
  };
}
