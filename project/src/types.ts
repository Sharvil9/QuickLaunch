export interface Link {
  id: string;
  title: string;
  url: string;
  category: string;
  icon?: string;
  isApp?: boolean;
  appProtocol?: string;  // For custom protocol handlers
  appPath?: string;      // For direct app paths
  subLinks?: Link[];
}

export interface Timer {
  hours: number;
  minutes: number;
  seconds: number;
  isRunning: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface SearchResult {
  title: string;
  url: string;
  category: string;
}

// App protocols for common applications
export const APP_PROTOCOLS = {
  VSCODE: 'vscode://',
  FIGMA: 'figma://',
  SLACK: 'slack://',
  ZOOM: 'zoommtg://',
  DISCORD: 'discord://',
  SPOTIFY: 'spotify://',
  NOTION: 'notion://',
  TEAMS: 'msteams://',
  TELEGRAM: 'tg://',
  WHATSAPP: 'whatsapp://'
} as const;