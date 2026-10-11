import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TimerPanel } from './components/TimerPanel';
import './index.css';

document.documentElement.dataset.surface = 'timer-panel';

createRoot(document.getElementById('timer-root')!).render(
  <StrictMode>
    <TimerPanel />
  </StrictMode>,
);
