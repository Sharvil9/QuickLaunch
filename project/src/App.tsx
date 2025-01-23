import React, { useState, useEffect } from 'react';
import { Plus, Search, Moon, Sun, Timer as TimerIcon, MessageCircle } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { LinkGrid } from './components/LinkGrid';
import { AddLinkModal } from './components/AddLinkModal';
import { Timer } from './components/Timer';
import { WorkspaceMenu } from './components/WorkspaceMenu';
import { FeedbackModal } from './components/FeedbackModal';
import { WorldClock } from './components/WorldClock';
import { Calendar } from './components/Calendar';
import { openApplication } from './utils/appDetection';
import type { Link } from './types';
import { APP_PROTOCOLS } from './types';

const googleApps: Link[] = [
  { id: 'gmail', title: 'Gmail', url: 'https://gmail.com', category: 'Google', icon: 'https://www.google.com/gmail/about/static/images/logo-gmail.png' },
  { id: 'gdrive', title: 'Drive', url: 'https://drive.google.com', category: 'Google', icon: 'https://ssl.gstatic.com/images/branding/product/2x/drive_2020q4_32dp.png' },
  { id: 'gdocs', title: 'Docs', url: 'https://docs.google.com', category: 'Google', icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' },
  { id: 'gsheets', title: 'Sheets', url: 'https://sheets.google.com', category: 'Google', icon: 'https://ssl.gstatic.com/docs/spreadsheets/favicon_jfk2.png' },
  { id: 'gslides', title: 'Slides', url: 'https://slides.google.com', category: 'Google', icon: 'https://ssl.gstatic.com/docs/presentations/images/favicon5.ico' },
  { id: 'gmeet', title: 'Meet', url: 'https://meet.google.com', category: 'Google', icon: 'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v1/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png' },
  { id: 'gkeep', title: 'Keep', url: 'https://keep.google.com', category: 'Google', icon: 'https://ssl.gstatic.com/keep/icon_2020q4v2_128.png' },
  { id: 'gmaps', title: 'Maps', url: 'https://maps.google.com', category: 'Google', icon: 'https://maps.google.com/favicon.ico' },
  { id: 'gtranslate', title: 'Translate', url: 'https://translate.google.com', category: 'Google', icon: 'https://translate.google.com/favicon.ico' },
  { id: 'gphotos', title: 'Photos', url: 'https://photos.google.com', category: 'Google', icon: 'https://photos.google.com/favicon.ico' },
  { id: 'gearth', title: 'Earth', url: 'https://earth.google.com/web/', category: 'Google', icon: 'https://earth.google.com/favicon.ico' },
  { id: 'gpasswords', title: 'Passwords', url: 'https://passwords.google.com', category: 'Google', icon: 'https://www.google.com/favicon.ico' }
];

const microsoftApps: Link[] = [
  { id: 'outlook', title: 'Outlook', url: 'https://outlook.office.com', category: 'Microsoft', icon: 'https://res.cdn.office.net/assets/mail/pwa/v1/pngs/favicon.png' },
  { id: 'onedrive', title: 'OneDrive', url: 'https://onedrive.live.com', category: 'Microsoft', icon: 'https://res.cdn.office.net/assets/onedrive/pwa/v1/pngs/favicon.png' },
  { id: 'word', title: 'Word', url: 'https://www.office.com/launch/word', category: 'Microsoft', icon: 'https://res.cdn.office.net/assets/word/pwa/v1/pngs/favicon.png' },
  { id: 'excel', title: 'Excel', url: 'https://www.office.com/launch/excel', category: 'Microsoft', icon: 'https://res.cdn.office.net/assets/excel/pwa/v1/pngs/favicon.png' },
  { id: 'powerpoint', title: 'PowerPoint', url: 'https://www.office.com/launch/powerpoint', category: 'Microsoft', icon: 'https://res.cdn.office.net/assets/powerpoint/pwa/v1/pngs/favicon.png' },
  { id: 'teams', title: 'Teams', url: 'https://teams.microsoft.com', category: 'Microsoft', icon: 'https://res.cdn.office.net/assets/teams/pwa/v1/pngs/favicon.png' },
  { id: 'onenote', title: 'OneNote', url: 'https://www.office.com/launch/onenote', category: 'Microsoft', icon: 'https://res.cdn.office.net/assets/onenote/pwa/v1/pngs/favicon.png' }
];

const defaultCategories = ['Productivity', 'AI Applications', 'Social Media', 'Entertainment', 'Development', 'Recent'];

const defaultLinks: Link[] = [
  {
    id: 'google-workspace',
    title: 'Google Workspace',
    url: '#',
    category: 'Productivity',
    icon: 'https://workspace.google.com/static/img/favicon.ico',
    subLinks: googleApps
  },
  {
    id: 'microsoft365',
    title: 'Microsoft 365',
    url: '#',
    category: 'Productivity',
    icon: 'https://www.microsoft.com/favicon.ico',
    subLinks: microsoftApps
  },
  {
    id: 'wolframalpha',
    title: 'Wolfram Alpha',
    url: 'https://www.wolframalpha.com',
    category: 'Productivity',
    icon: 'https://www.wolframalpha.com/favicon.ico'
  },
  {
    id: 'slack',
    title: 'Slack',
    url: 'https://slack.com',
    category: 'Productivity',
    icon: 'https://slack.com/favicon.ico',
    isApp: true,
    appProtocol: APP_PROTOCOLS.SLACK
  },
  {
    id: 'zoom',
    title: 'Zoom',
    url: 'https://zoom.us',
    category: 'Productivity',
    icon: 'https://zoom.us/favicon.ico'
  },
  {
    id: 'obsidian',
    title: 'Obsidian',
    url: 'https://obsidian.md',
    category: 'Productivity',
    icon: 'https://obsidian.md/favicon.ico'
  },
  {
    id: 'notion',
    title: 'Notion',
    url: 'https://notion.so',
    category: 'Productivity',
    icon: 'https://notion.so/favicon.ico'
  },
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    category: 'AI Applications',
    icon: 'https://chat.openai.com/favicon.ico'
  },
  {
    id: 'gemini',
    title: 'Gemini',
    url: 'https://gemini.google.com',
    category: 'AI Applications',
    icon: 'https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg'
  },
  {
    id: 'claude',
    title: 'Claude',
    url: 'https://claude.ai',
    category: 'AI Applications',
    icon: 'https://claude.ai/favicon.ico'
  },
  {
    id: 'perplexity',
    title: 'Perplexity',
    url: 'https://www.perplexity.ai',
    category: 'AI Applications',
    icon: 'https://www.perplexity.ai/favicon.ico'
  },
  {
    id: 'deepseek',
    title: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    category: 'AI Applications',
    icon: 'https://chat.deepseek.com/favicon.ico'
  },
  {
    id: 'groq',
    title: 'Groq',
    url: 'https://groq.com',
    category: 'AI Applications',
    icon: 'https://groq.com/favicon.ico'
  },
  {
    id: 'meta-ai',
    title: 'Meta AI',
    url: 'https://ai.meta.com',
    category: 'AI Applications',
    icon: 'https://ai.meta.com/favicon.ico'
  },
  {
    id: 'firefly',
    title: 'Adobe Firefly',
    url: 'https://firefly.adobe.com',
    category: 'AI Applications',
    icon: 'https://firefly.adobe.com/favicon.ico'
  },
  {
    id: 'instagram',
    title: 'Instagram',
    url: 'https://instagram.com',
    category: 'Social Media',
    icon: 'https://instagram.com/favicon.ico'
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    url: 'https://web.whatsapp.com',
    category: 'Social Media',
    icon: 'https://web.whatsapp.com/favicon.ico'
  },
  {
    id: 'twitter',
    title: 'Twitter',
    url: 'https://twitter.com',
    category: 'Social Media',
    icon: 'https://twitter.com/favicon.ico'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    category: 'Social Media',
    icon: 'https://linkedin.com/favicon.ico'
  },
  {
    id: 'facebook',
    title: 'Facebook',
    url: 'https://facebook.com',
    category: 'Social Media',
    icon: 'https://facebook.com/favicon.ico'
  },
  {
    id: 'reddit',
    title: 'Reddit',
    url: 'https://reddit.com',
    category: 'Social Media',
    icon: 'https://reddit.com/favicon.ico'
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    url: 'https://tiktok.com',
    category: 'Social Media',
    icon: 'https://tiktok.com/favicon.ico'
  },
  {
    id: 'telegram',
    title: 'Telegram',
    url: 'https://web.telegram.org',
    category: 'Social Media',
    icon: 'https://web.telegram.org/favicon.ico'
  },
  {
    id: 'discord',
    title: 'Discord',
    url: 'https://discord.com/app',
    category: 'Social Media',
    icon: 'https://discord.com/favicon.ico'
  },
  {
    id: 'tumblr',
    title: 'Tumblr',
    url: 'https://tumblr.com',
    category: 'Social Media',
    icon: 'https://tumblr.com/favicon.ico'
  },
  {
    id: 'threads',
    title: 'Threads',
    url: 'https://threads.net',
    category: 'Social Media',
    icon: 'https://threads.net/favicon.ico'
  },
  {
    id: 'youtube',
    title: 'YouTube',
    url: 'https://youtube.com',
    category: 'Entertainment',
    icon: 'https://youtube.com/favicon.ico'
  },
  {
    id: 'spotify',
    title: 'Spotify',
    url: 'https://open.spotify.com',
    category: 'Entertainment',
    icon: 'https://open.spotify.com/favicon.ico'
  },
  {
    id: 'netflix',
    title: 'Netflix',
    url: 'https://netflix.com',
    category: 'Entertainment',
    icon: 'https://netflix.com/favicon.ico'
  },
  {
    id: 'prime',
    title: 'Prime Video',
    url: 'https://primevideo.com',
    category: 'Entertainment',
    icon: 'https://primevideo.com/favicon.ico'
  },
  {
    id: 'hulu',
    title: 'Hulu',
    url: 'https://hulu.com',
    category: 'Entertainment',
    icon: 'https://hulu.com/favicon.ico'
  },
  {
    id: 'disney',
    title: 'Disney+',
    url: 'https://disneyplus.com',
    category: 'Entertainment',
    icon: 'https://disneyplus.com/favicon.ico'
  },
  {
    id: 'twitch',
    title: 'Twitch',
    url: 'https://twitch.tv',
    category: 'Entertainment',
    icon: 'https://twitch.tv/favicon.ico'
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com',
    category: 'Development',
    icon: 'https://github.com/favicon.ico'
  },
  {
    id: 'stackoverflow',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'Development',
    icon: 'https://stackoverflow.com/favicon.ico'
  },
  {
    id: 'figma',
    title: 'Figma',
    url: 'https://figma.com',
    category: 'Development',
    icon: 'https://figma.com/favicon.ico',
    isApp: true,
    appProtocol: 'figma://'
  },
  {
    id: 'postman',
    title: 'Postman',
    url: 'https://postman.com',
    category: 'Development',
    icon: 'https://postman.com/favicon.ico'
  },
  {
    id: 'vscode',
    title: 'VS Code',
    url: 'https://vscode.dev',
    category: 'Development',
    icon: 'https://code.visualstudio.com/favicon.ico',
    isApp: true,
    appProtocol: APP_PROTOCOLS.VSCODE
  },
  {
    id: 'jetbrains',
    title: 'JetBrains',
    url: 'https://jetbrains.com',
    category: 'Development',
    icon: 'https://jetbrains.com/favicon.ico'
  },
  {
    id: 'docker',
    title: 'Docker',
    url: 'https://docker.com',
    category: 'Development',
    icon: 'https://docker.com/favicon.ico'
  },
  {
    id: 'intellij',
    title: 'IntelliJ IDEA',
    url: 'https://jetbrains.com/idea',
    category: 'Development',
    icon: 'https://resources.jetbrains.com/storage/products/intellij-idea/img/meta/intellij-idea_logo_300x300.png'
  },
  {
    id: 'jupyter',
    title: 'Jupyter',
    url: 'https://jupyter.org',
    category: 'Development',
    icon: 'https://jupyter.org/favicon.ico'
  }
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [links, setLinks] = useState<Link[]>(defaultLinks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Link | null>(null);
  const [browserStartTime] = useState<Date>(new Date());
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [recentLinks, setRecentLinks] = useState<Link[]>([]);

  const extensionStyles = {
    position: 'fixed' as const,
    right: '20px',
    top: '20px',
    backgroundColor: darkMode ? 'rgb(17, 24, 39)' : 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    width: '400px',
    height: '600px',
    overflow: 'hidden'
  };

  useEffect(() => {
    const savedLinks = localStorage.getItem('quicklaunch-links');
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quicklaunch-links', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - browserStartTime.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setElapsedTime(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [browserStartTime]);

  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddLink = (newLink: Omit<Link, 'id'>) => {
    const link: Link = {
      ...newLink,
      id: Date.now().toString()
    };
    setLinks([...links, link]);
    setIsModalOpen(false);
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLinkClick = (link: Link) => {
    if (link.subLinks) {
      setSelectedWorkspace(link);
    } else {
      const updatedRecents = [link, ...recentLinks.filter(l => l.id !== link.id)].slice(0, 8);
      setRecentLinks(updatedRecents);
      
      if (link.isApp) {
        openApplication(link);
      } else {
        window.open(link.url, '_blank');
      }
    }
  };

  return (
    <div style={extensionStyles}>
      <div className={`h-full ${darkMode ? 'dark' : ''}`}>
        <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <SearchBar onSearch={setSearchQuery} darkMode={darkMode} />
              </div>
              <div className="flex items-center gap-2 ml-2">
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {elapsedTime}
                </div>
                <button
                  onClick={() => setShowTimer(!showTimer)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                >
                  <TimerIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {selectedWorkspace ? (
              <WorkspaceMenu
                workspace={selectedWorkspace}
                onClose={() => setSelectedWorkspace(null)}
                darkMode={darkMode}
              />
            ) : (
              <>
                <LinkGrid 
                  links={filteredLinks} 
                  onDelete={handleDeleteLink} 
                  onClick={handleLinkClick}
                  darkMode={darkMode}
                />
                
                {recentLinks.length > 0 && (
                  <div className="mt-6">
                    <h2 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Recent
                    </h2>
                    <div className="grid grid-cols-4 gap-3">
                      {recentLinks.map(link => (
                        <button
                          key={link.id}
                          onClick={() => handleLinkClick(link)}
                          className={`flex flex-col items-center p-3 rounded-lg ${
                            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                          }`}
                        >
                          <img src={link.icon} alt={link.title} className="w-8 h-8 mb-2" />
                          <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {link.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <WorldClock darkMode={darkMode} />
                </div>

                <div className="mt-6">
                  <Calendar darkMode={darkMode} />
                </div>
              </>
            )}
          </div>
        </div>

        {showTimer && <Timer onClose={() => setShowTimer(false)} darkMode={darkMode} />}

        <button
          onClick={() => setShowFeedback(true)}
          className="fixed bottom-4 right-4 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {isModalOpen && (
          <AddLinkModal
            onAdd={handleAddLink}
            onClose={() => setIsModalOpen(false)}
            categories={defaultCategories}
            darkMode={darkMode}
          />
        )}

        {showFeedback && (
          <FeedbackModal
            onClose={() => setShowFeedback(false)}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App;