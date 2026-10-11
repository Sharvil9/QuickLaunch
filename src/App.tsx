import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Clock3, ExternalLink, Layers3, Moon, Pencil, Plus, Sparkles, Sun, Trash2 } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { LinkGrid } from './components/LinkGrid';
import { AddLinkModal } from './components/AddLinkModal';
import { LaunchGroupModal } from './components/LaunchGroupModal';
import { Timer } from './components/Timer';
import { WorkspaceMenu } from './components/WorkspaceMenu';
import { WorldClock } from './components/WorldClock';
import { Calendar } from './components/Calendar';
import { ShortcutIcon } from './components/ShortcutIcon';
import { readSetting, writeSetting } from './utils/storage';
import { openUrlInBackground } from './utils/openUrl';
import { reorderLinkList, type DropPosition } from './utils/reorderLinks';
import type { LaunchGroup, Link } from './types';
import { APP_PROTOCOLS } from './types';

const googleApps: Link[] = [
  { id: 'gcalendar', title: 'Google Calendar', url: 'https://calendar.google.com', category: 'Google', icon: './icons/apps/gcalendar.png' },
  { id: 'gmail', title: 'Gmail', url: 'https://mail.google.com', category: 'Google', icon: './icons/apps/gmail.png' },
  { id: 'gdrive', title: 'Google Drive', url: 'https://drive.google.com', category: 'Google', icon: './icons/apps/gdrive.png' },
  { id: 'gdocs', title: 'Google Docs', url: 'https://docs.google.com', category: 'Google', icon: './icons/apps/gdocs.png' },
  { id: 'gsheets', title: 'Google Sheets', url: 'https://sheets.google.com', category: 'Google', icon: './icons/apps/gsheets.png' },
  { id: 'gslides', title: 'Google Slides', url: 'https://slides.google.com', category: 'Google', icon: './icons/apps/gslides.png' },
  { id: 'gmeet', title: 'Google Meet', url: 'https://meet.google.com', category: 'Google', icon: './icons/apps/gmeet.png' },
  { id: 'gkeep', title: 'Google Keep', url: 'https://keep.google.com', category: 'Google', icon: './icons/apps/gkeep.png' },
  { id: 'gmaps', title: 'Google Maps', url: 'https://maps.google.com', category: 'Google', icon: './icons/apps/gmaps.png' },
  { id: 'gtranslate', title: 'Google Translate', url: 'https://translate.google.com', category: 'Google', icon: './icons/apps/gtranslate.png' },
  { id: 'gphotos', title: 'Google Photos', url: 'https://photos.google.com', category: 'Google', icon: './icons/apps/gphotos.png' },
  { id: 'gearth', title: 'Google Earth', url: 'https://earth.google.com/web/', category: 'Google', icon: './icons/apps/gearth.png' },
  { id: 'gpasswords', title: 'Google Password Manager', url: 'https://passwords.google.com', category: 'Google', icon: './icons/apps/gpasswords.png' }
];

const microsoftApps: Link[] = [
  { id: 'outlook', title: 'Outlook', url: 'https://outlook.office.com', category: 'Microsoft', icon: './icons/apps/outlook.png' },
  { id: 'onedrive', title: 'OneDrive', url: 'https://onedrive.live.com', category: 'Microsoft', icon: './icons/apps/onedrive.png' },
  { id: 'word', title: 'Word', url: 'https://www.office.com/launch/word', category: 'Microsoft', icon: './icons/apps/word.png' },
  { id: 'excel', title: 'Excel', url: 'https://www.office.com/launch/excel', category: 'Microsoft', icon: './icons/apps/excel.png' },
  { id: 'powerpoint', title: 'PowerPoint', url: 'https://www.office.com/launch/powerpoint', category: 'Microsoft', icon: './icons/apps/powerpoint.png' },
  { id: 'teams', title: 'Teams', url: 'https://teams.microsoft.com', category: 'Microsoft', icon: './icons/apps/teams.png' },
  { id: 'onenote', title: 'OneNote', url: 'https://www.office.com/launch/onenote', category: 'Microsoft', icon: './icons/apps/onenote.png' }
];

const defaultCategories = ['AI Applications', 'Productivity', 'Development', 'Social Media', 'Entertainment'];

function LocalDateTime() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <p className="app-text-muted text-xs">
      {new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(now)}
      <span className="mx-1.5">·</span>
      {new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(now)}
    </p>
  );
}

const defaultLinks: Link[] = [
  {
    id: 'google-workspace',
    title: 'Google Workspace',
    url: '#',
    category: 'Productivity',
    icon: './icons/apps/google-workspace.png',
    subLinks: googleApps
  },
  {
    id: 'microsoft365',
    title: 'Microsoft 365',
    url: '#',
    category: 'Productivity',
    icon: './icons/apps/microsoft365.png',
    subLinks: microsoftApps
  },
  {
    id: 'wolframalpha',
    title: 'Wolfram|Alpha',
    url: 'https://www.wolframalpha.com',
    category: 'Productivity',
    icon: './icons/apps/wolframalpha.png'
  },
  {
    id: 'slack',
    title: 'Slack',
    url: 'https://app.slack.com/client/',
    category: 'Productivity',
    icon: './icons/apps/slack.png',
    isApp: true,
    appProtocol: APP_PROTOCOLS.SLACK
  },
  {
    id: 'zoom',
    title: 'Zoom Workplace',
    url: 'https://zoom.us',
    category: 'Productivity',
    icon: './icons/apps/zoom.png'
  },
  {
    id: 'obsidian',
    title: 'Obsidian',
    url: 'https://obsidian.md',
    category: 'Productivity',
    icon: './icons/apps/obsidian.jpg'
  },
  {
    id: 'notion',
    title: 'Notion',
    url: 'https://notion.so',
    category: 'Productivity',
    icon: './icons/apps/notion.png'
  },
  {
    id: 'jira',
    title: 'Jira',
    url: 'https://www.atlassian.com/software/jira',
    category: 'Productivity',
    icon: './icons/apps/jira.png'
  },
  {
    id: 'chatgpt',
    title: 'ChatGPT',
    url: 'https://chatgpt.com',
    category: 'AI Applications',
    icon: './icons/apps/chatgpt.png'
  },
  {
    id: 'gemini',
    title: 'Gemini',
    url: 'https://gemini.google.com',
    category: 'AI Applications',
    icon: './icons/apps/gemini.png'
  },
  {
    id: 'claude',
    title: 'Claude',
    url: 'https://claude.ai',
    category: 'AI Applications',
    icon: './icons/apps/claude.png'
  },
  {
    id: 'perplexity',
    title: 'Perplexity',
    url: 'https://www.perplexity.ai',
    category: 'AI Applications',
    icon: './icons/apps/perplexity.png'
  },
  {
    id: 'deepseek',
    title: 'DeepSeek',
    url: 'https://chat.deepseek.com',
    category: 'AI Applications',
    icon: './icons/apps/deepseek.png'
  },
  {
    id: 'groq',
    title: 'Groq',
    url: 'https://groq.com',
    category: 'AI Applications',
    icon: './icons/apps/groq.png'
  },
  {
    id: 'meta-ai',
    title: 'Meta AI',
    url: 'https://www.meta.ai',
    category: 'AI Applications',
    icon: './icons/apps/meta-ai.png'
  },
  {
    id: 'firefly',
    title: 'Adobe Firefly',
    url: 'https://firefly.adobe.com',
    category: 'AI Applications',
    icon: './icons/apps/firefly.png'
  },
  {
    id: 'notebooklm',
    title: 'Gemini Notebook',
    url: 'https://notebook.google/',
    category: 'AI Applications',
    icon: './icons/apps/notebooklm.png'
  },
  {
    id: 'instagram',
    title: 'Instagram',
    url: 'https://www.instagram.com',
    category: 'Social Media',
    icon: './icons/apps/instagram.png'
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    url: 'https://web.whatsapp.com',
    category: 'Social Media',
    icon: './icons/apps/whatsapp.png'
  },
  {
    id: 'twitter',
    title: 'X',
    url: 'https://x.com',
    category: 'Social Media',
    icon: './icons/apps/twitter.png'
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    url: 'https://linkedin.com',
    category: 'Social Media',
    icon: './icons/apps/linkedin.png'
  },
  {
    id: 'facebook',
    title: 'Facebook',
    url: 'https://facebook.com',
    category: 'Social Media',
    icon: './icons/apps/facebook.png'
  },
  {
    id: 'reddit',
    title: 'Reddit',
    url: 'https://reddit.com',
    category: 'Social Media',
    icon: './icons/apps/reddit.png'
  },
  {
    id: 'tiktok',
    title: 'TikTok',
    url: 'https://tiktok.com',
    category: 'Social Media',
    icon: './icons/apps/tiktok.png'
  },
  {
    id: 'telegram',
    title: 'Telegram',
    url: 'https://web.telegram.org',
    category: 'Social Media',
    icon: './icons/apps/telegram.png'
  },
  {
    id: 'discord',
    title: 'Discord',
    url: 'https://discord.com/app',
    category: 'Social Media',
    icon: './icons/apps/discord.png'
  },
  {
    id: 'tumblr',
    title: 'Tumblr',
    url: 'https://tumblr.com',
    category: 'Social Media',
    icon: './icons/apps/tumblr.png'
  },
  {
    id: 'threads',
    title: 'Threads',
    url: 'https://threads.net',
    category: 'Social Media',
    icon: './icons/apps/threads.png'
  },
  {
    id: 'youtube',
    title: 'YouTube',
    url: 'https://youtube.com',
    category: 'Entertainment',
    icon: './icons/apps/youtube.png'
  },
  {
    id: 'spotify',
    title: 'Spotify',
    url: 'https://open.spotify.com',
    category: 'Entertainment',
    icon: './icons/apps/spotify.png'
  },
  {
    id: 'netflix',
    title: 'Netflix',
    url: 'https://netflix.com',
    category: 'Entertainment',
    icon: './icons/apps/netflix.png'
  },
  {
    id: 'prime',
    title: 'Prime Video',
    url: 'https://primevideo.com',
    category: 'Entertainment',
    icon: './icons/apps/prime.png'
  },
  {
    id: 'hulu',
    title: 'Hulu',
    url: 'https://hulu.com',
    category: 'Entertainment',
    icon: './icons/apps/hulu.png'
  },
  {
    id: 'disney',
    title: 'Disney+',
    url: 'https://disneyplus.com',
    category: 'Entertainment',
    icon: './icons/apps/disney.png'
  },
  {
    id: 'jiohotstar',
    title: 'JioHotstar',
    url: 'https://www.hotstar.com/in',
    category: 'Entertainment',
    icon: './icons/apps/jiohotstar.png'
  },
  {
    id: 'twitch',
    title: 'Twitch',
    url: 'https://twitch.tv',
    category: 'Entertainment',
    icon: './icons/apps/twitch.png'
  },
  {
    id: 'github',
    title: 'GitHub',
    url: 'https://github.com',
    category: 'Development',
    icon: './icons/apps/github.png'
  },
  {
    id: 'stackoverflow',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    category: 'Development',
    icon: './icons/apps/stackoverflow.png'
  },
  {
    id: 'figma',
    title: 'Figma',
    url: 'https://figma.com',
    category: 'Development',
    icon: './icons/apps/figma.png',
    isApp: true,
    appProtocol: 'figma://'
  },
  {
    id: 'postman',
    title: 'Postman',
    url: 'https://postman.com',
    category: 'Development',
    icon: './icons/apps/postman.png'
  },
  {
    id: 'vscode',
    title: 'Visual Studio Code',
    url: 'https://vscode.dev',
    category: 'Development',
    icon: './icons/apps/vscode.png',
    isApp: true,
    appProtocol: APP_PROTOCOLS.VSCODE
  },
  {
    id: 'docker',
    title: 'Docker Hub',
    url: 'https://hub.docker.com',
    category: 'Development',
    icon: './icons/apps/docker.png'
  },
  {
    id: 'intellij',
    title: 'IntelliJ IDEA',
    url: 'https://jetbrains.com/idea',
    category: 'Development',
    icon: './icons/apps/intellij.png'
  },
  {
    id: 'jupyter',
    title: 'Jupyter',
    url: 'https://jupyter.org',
    category: 'Development',
    icon: './icons/apps/jupyter.png'
  }
];

const LINK_CATALOG_VERSION = 1;
const catalogAdditions = new Set(['notebooklm', 'jiohotstar']);
const builtInLinksById = new Map(
  defaultLinks.flatMap((link) => [link, ...(link.subLinks ?? [])]).map((link) => [link.id, link]),
);

function refreshBuiltInLinks(savedLinks: Link[]): Link[] {
  return savedLinks.map((savedLink) => {
    const builtInLink = builtInLinksById.get(savedLink.id);
    if (!builtInLink) return savedLink;

    const refreshed: Link = {
      ...savedLink,
      title: builtInLink.title,
      url: builtInLink.url,
      category: builtInLink.category,
      icon: builtInLink.icon,
    };
    if (savedLink.subLinks) {
      refreshed.subLinks = refreshBuiltInLinks(savedLink.subLinks);
    }
    return refreshed;
  });
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [links, setLinks] = useState<Link[]>(defaultLinks);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Link | null>(null);
  const [recentLinks, setRecentLinks] = useState<Link[]>([]);
  const [launchGroups, setLaunchGroups] = useState<LaunchGroup[]>([]);
  const [editingLaunchGroup, setEditingLaunchGroup] = useState<LaunchGroup | null>(null);
  const [isCreatingLaunchGroup, setIsCreatingLaunchGroup] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [hydrated, setHydrated] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      readSetting<Link[]>('links', defaultLinks),
      readSetting<boolean | null>('darkMode', null),
      readSetting<Link[]>('recentLinks', []),
      readSetting<LaunchGroup[]>('launchGroups', []),
      readSetting<number>('linksCatalogVersion', 0),
    ]).then(([savedLinks, savedDarkMode, savedRecentLinks, savedLaunchGroups, savedCatalogVersion]) => {
      if (cancelled) return;
      const existingLinks = refreshBuiltInLinks(Array.isArray(savedLinks) ? savedLinks : defaultLinks);
      if (savedCatalogVersion < LINK_CATALOG_VERSION) {
        const existingIds = new Set(existingLinks.map((link) => link.id));
        existingLinks.push(...defaultLinks.filter((link) => catalogAdditions.has(link.id) && !existingIds.has(link.id)));
        void writeSetting('linksCatalogVersion', LINK_CATALOG_VERSION);
      }
      setLinks(existingLinks);
      setDarkMode(savedDarkMode ?? window.matchMedia('(prefers-color-scheme: dark)').matches);
      setRecentLinks(refreshBuiltInLinks(Array.isArray(savedRecentLinks) ? savedRecentLinks : []));
      setLaunchGroups(Array.isArray(savedLaunchGroups) ? savedLaunchGroups : []);
      setHydrated(true);
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (hydrated) void writeSetting('links', links);
  }, [hydrated, links]);

  useEffect(() => {
    if (hydrated) void writeSetting('darkMode', darkMode);
  }, [darkMode, hydrated]);

  useEffect(() => {
    if (hydrated) void writeSetting('recentLinks', recentLinks);
  }, [hydrated, recentLinks]);

  useEffect(() => {
    if (hydrated) void writeSetting('launchGroups', launchGroups);
  }, [hydrated, launchGroups]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => searchInputRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const categories = useMemo(
    () => Array.from(new Set([...defaultCategories, ...links.map((link) => link.category)])),
    [links],
  );

  const searchMatches = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return links
      .flatMap((link) => link.subLinks ? [link, ...link.subLinks] : [link])
      .filter((link) => `${link.id} ${link.title} ${link.category} ${link.url}`.toLowerCase().includes(normalizedQuery));
  }, [links, searchQuery]);

  const visibleLinks = useMemo(() => searchQuery.trim()
      ? searchMatches
      : activeCategory === 'All'
        ? links
        : links.filter((link) => link.category === activeCategory), [activeCategory, links, searchMatches, searchQuery]);

  const launchableLinks = useMemo(() => links.flatMap((link) => link.subLinks ?? [link]), [links]);
  const launchableLinksById = useMemo(() => new Map(launchableLinks.map((link) => [link.id, link])), [launchableLinks]);
  const activeWorkspace = selectedWorkspace
    ? links.find((link) => link.id === selectedWorkspace.id) ?? selectedWorkspace
    : null;

  const handleAddLink = (newLink: Omit<Link, 'id'>) => {
    let normalizedUrl: URL;
    try {
      normalizedUrl = new URL(/^https?:\/\//i.test(newLink.url) ? newLink.url : `https://${newLink.url}`);
    } catch {
      return;
    }
    if (normalizedUrl.protocol !== 'https:' && normalizedUrl.protocol !== 'http:') return;

    const link: Link = {
      ...newLink,
      url: normalizedUrl.toString(),
      id: `custom-${Date.now()}`,
    };
    setLinks((currentLinks) => [...currentLinks, link]);
    setIsModalOpen(false);
  };

  const handleDeleteLink = useCallback((id: string) => {
    const removedLink = links.find((link) => link.id === id);
    const removedIds = new Set([id, ...(removedLink?.subLinks ?? []).map((link) => link.id)]);
    setLinks((currentLinks) => currentLinks.filter((link) => link.id !== id));
    setRecentLinks((currentLinks) => currentLinks.filter((link) => !removedIds.has(link.id)));
    setLaunchGroups((currentGroups) => currentGroups.map((group) => ({
      ...group,
      linkIds: group.linkIds.filter((linkId) => !removedIds.has(linkId)),
    })));
  }, [links]);

  const handleReorderShortcuts = useCallback((sourceId: string, targetId: string, position: DropPosition, targetCategory: string) => {
    setLinks((currentLinks) => reorderLinkList(currentLinks, sourceId, targetId, position, targetCategory));
  }, []);

  const handleReorderWorkspaceLinks = useCallback((workspaceId: string, sourceId: string, targetId: string, position: DropPosition, targetCategory: string) => {
    setLinks((currentLinks) => currentLinks.map((link) => link.id === workspaceId
      ? { ...link, subLinks: reorderLinkList(link.subLinks ?? [], sourceId, targetId, position, targetCategory) }
      : link));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((value) => !value);
  };

  const handleLinkClick = useCallback((link: Link) => {
    if (link.subLinks) {
      setSelectedWorkspace(link);
      return;
    }

    setRecentLinks((currentLinks) => [link, ...currentLinks.filter((item) => item.id !== link.id)].slice(0, 8));
    openUrlInBackground(link.url);
  }, []);

  const handleSaveLaunchGroup = (title: string, linkIds: string[]) => {
    const id = editingLaunchGroup?.id ?? `launch-group-${Date.now()}`;
    setLaunchGroups((currentGroups) => {
      const savedGroup = { id, title, linkIds };
      return editingLaunchGroup
        ? currentGroups.map((group) => group.id === id ? savedGroup : group)
        : [...currentGroups, savedGroup];
    });
    setEditingLaunchGroup(null);
    setIsCreatingLaunchGroup(false);
  };

  const handleLaunchGroup = (group: LaunchGroup) => {
    const selectedLinks = group.linkIds
      .map((linkId) => launchableLinksById.get(linkId))
      .filter((link): link is Link => Boolean(link));
    selectedLinks.forEach((link) => openUrlInBackground(link.url));
    setRecentLinks((currentLinks) => [
      ...selectedLinks,
      ...currentLinks.filter((recentLink) => !selectedLinks.some((link) => link.id === recentLink.id)),
    ].slice(0, 8));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSelectedWorkspace(null);
        searchInputRef.current?.focus();
      } else if (event.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        else if (isCreatingLaunchGroup || editingLaunchGroup) {
          setIsCreatingLaunchGroup(false);
          setEditingLaunchGroup(null);
        }
        else if (selectedWorkspace) setSelectedWorkspace(null);
        else if (searchQuery) setSearchQuery('');
      } else if (event.key === 'Enter' && document.activeElement === searchInputRef.current && searchMatches[0]) {
        event.preventDefault();
        handleLinkClick(searchMatches[0]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editingLaunchGroup, handleLinkClick, isCreatingLaunchGroup, isModalOpen, searchMatches, searchQuery, selectedWorkspace]);

  return (
    <main className="app-shell relative flex flex-col">
      <header className="app-header shrink-0 border-b px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="app-secondary-button flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl">
              <Sparkles className="app-gold-text h-[18px] w-[18px]" />
            </span>
            <div>
              <p className="app-accent-text text-[10px] font-bold uppercase tracking-[0.18em]">QuickLaunch</p>
              <LocalDateTime />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'} title="Toggle theme" className="app-control-hover app-text-muted app-focus rounded-full p-2 transition-colors">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button type="button" onClick={() => setIsModalOpen(true)} aria-label="Add shortcut" title="Add shortcut" className="app-primary-button app-focus rounded-xl p-2 transition">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <SearchBar
            onSearch={(query) => {
              setSearchQuery(query);
              if (query.trim()) setSelectedWorkspace(null);
            }}
            value={searchQuery}
            inputRef={searchInputRef}
          />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-6 p-4">
          <section aria-labelledby="shortcuts-heading">
            {activeWorkspace ? (
              <WorkspaceMenu
                workspace={activeWorkspace}
                onClose={() => setSelectedWorkspace(null)}
                onSelect={handleLinkClick}
                onReorder={handleReorderWorkspaceLinks}
              />
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <h1 id="shortcuts-heading" className="text-sm font-semibold tracking-wide">Shortcuts</h1>
                    <p className="app-text-muted mt-0.5 text-[11px]">Search or scroll. Drag to arrange.</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="app-text-muted text-[10px]">{links.length} saved</span>
                    <button type="button" onClick={() => setIsCreatingLaunchGroup(true)} className="app-secondary-button app-focus flex items-center gap-1 rounded-xl px-2.5 py-2 text-[11px] font-semibold transition">
                      <Layers3 className="h-3.5 w-3.5" /> New set
                    </button>
                  </div>
                </div>

                <div className="scrollbar-hide -mx-4 mb-4 flex gap-1.5 overflow-x-auto px-4 pb-1" aria-label="Shortcut categories">
                  {['All', ...categories].map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => { setActiveCategory(category); setSearchQuery(''); }}
                      aria-pressed={activeCategory === category && !searchQuery}
                      className="app-chip app-focus shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition"
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {launchGroups.length > 0 && !searchQuery && activeCategory === 'All' && (
                  <section className="mb-4" aria-labelledby="launch-sets-heading">
                    <h2 id="launch-sets-heading" className="app-eyebrow mb-2 flex items-center gap-1.5">
                      <Layers3 className="app-gold-text h-3.5 w-3.5" /> Launch sets
                    </h2>
                    <div className="space-y-2.5">
                      {launchGroups.map((group) => {
                        const groupLinks = group.linkIds
                          .map((linkId) => launchableLinksById.get(linkId))
                          .filter((link): link is Link => Boolean(link));
                        return (
                          <article key={group.id} className="app-surface rounded-2xl border p-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-medium">{group.title}</h3>
                                <p className="app-text-muted text-[11px]">{groupLinks.length} {groupLinks.length === 1 ? 'site' : 'sites'}</p>
                              </div>
                              <button type="button" onClick={() => handleLaunchGroup(group)} disabled={groupLinks.length === 0} className="app-primary-button app-focus flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50" title="Open all sites in background tabs">
                                <ExternalLink className="h-3.5 w-3.5" /> Open all
                              </button>
                            </div>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
                                {groupLinks.slice(0, 6).map((link) => <ShortcutIcon key={link.id} title={link.title} src={link.icon} size="small" />)}
                                {groupLinks.length > 6 && <span className="app-text-muted shrink-0 text-[10px]">+{groupLinks.length - 6}</span>}
                              </div>
                              <div className="flex shrink-0 items-center gap-0.5">
                                <button type="button" onClick={() => setEditingLaunchGroup(group)} aria-label={`Edit ${group.title}`} title="Edit launch set" className="app-control-hover app-text-muted app-focus rounded-lg p-1.5 transition">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" onClick={() => setLaunchGroups((currentGroups) => currentGroups.filter((item) => item.id !== group.id))} aria-label={`Delete ${group.title}`} title="Delete launch set" className="app-control-hover app-text-muted app-focus rounded-lg p-1.5 transition hover:text-red-500">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                )}

                {recentLinks.length > 0 && !searchQuery && activeCategory === 'All' && (
                  <div className="mb-5">
                    <h2 className="app-eyebrow mb-2">Recently opened</h2>
                    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
                      {recentLinks.map((link) => (
                        <button key={link.id} type="button" onClick={() => handleLinkClick(link)} className="app-surface app-focus flex shrink-0 items-center gap-2 rounded-2xl border px-2.5 py-2 text-xs transition">
                          <ShortcutIcon title={link.title} src={link.icon} size="small" />
                          <span className="max-w-24 truncate">{link.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <LinkGrid
                  links={visibleLinks}
                  onDelete={handleDeleteLink}
                  onClick={handleLinkClick}
                  onReorder={handleReorderShortcuts}
                  canReorder={!searchQuery.trim()}
                />
              </>
            )}
          </section>
          <section aria-labelledby="world-clocks-heading">
            <h2 id="world-clocks-heading" className="app-eyebrow mb-3 flex items-center gap-2">
              <Clock3 className="app-gold-text h-3.5 w-3.5" /> World clocks
            </h2>
            <WorldClock />
          </section>

          <section aria-labelledby="calendar-heading">
            <div className="mb-2 flex items-center justify-between">
              <h2 id="calendar-heading" className="app-eyebrow flex items-center gap-2">
                <CalendarDays className="app-gold-text h-3.5 w-3.5" /> Calendar
              </h2>
              <button type="button" onClick={() => openUrlInBackground('https://calendar.google.com')} className="app-accent-text app-focus rounded-lg px-2 py-1 text-[11px] font-semibold transition hover:bg-[var(--app-surface-hover)]">
                Open Google Calendar ↗
              </button>
            </div>
            <Calendar />
          </section>

          <Timer />
        </div>
      </div>

      {isModalOpen && (
        <AddLinkModal
          onAdd={handleAddLink}
          onClose={() => setIsModalOpen(false)}
          categories={categories}
        />
      )}

      {(isCreatingLaunchGroup || editingLaunchGroup) && (
        <LaunchGroupModal
          links={launchableLinks}
          group={editingLaunchGroup ?? undefined}
          onSave={handleSaveLaunchGroup}
          onClose={() => { setIsCreatingLaunchGroup(false); setEditingLaunchGroup(null); }}
        />
      )}
    </main>
  );
}

export default App;
