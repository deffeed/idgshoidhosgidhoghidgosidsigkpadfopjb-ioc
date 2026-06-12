import { useState, useCallback, useRef } from 'react';

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon: string;
  history: string[];
  historyIndex: number;
  loading: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  favicon: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultTabs: Tab[] = [
  {
    id: generateId(),
    title: 'Новая вкладка',
    url: '',
    favicon: '',
    history: [''],
    historyIndex: 0,
    loading: false,
  },
];

const defaultBookmarks: Bookmark[] = [
  { id: '1', title: 'Google', url: 'https://www.google.com', favicon: 'https://www.google.com/favicon.ico' },
  { id: '2', title: 'YouTube', url: 'https://www.youtube.com', favicon: 'https://www.youtube.com/favicon.ico' },
  { id: '3', title: 'GitHub', url: 'https://github.com', favicon: 'https://github.com/favicon.ico' },
  { id: '4', title: 'Wikipedia', url: 'https://wikipedia.org', favicon: 'https://wikipedia.org/favicon.ico' },
  { id: '5', title: 'Reddit', url: 'https://reddit.com', favicon: 'https://reddit.com/favicon.ico' },
  { id: '6', title: 'Hacker News', url: 'https://news.ycombinator.com', favicon: 'https://news.ycombinator.com/favicon.ico' },
];

export function useBrowser() {
  const [tabs, setTabs] = useState<Tab[]>(defaultTabs);
  const [activeTabId, setActiveTabId] = useState<string>(defaultTabs[0].id);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(defaultBookmarks);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'bookmarks' | 'history'>('bookmarks');
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const updateTab = useCallback((tabId: string, updates: Partial<Tab>) => {
    setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, ...updates } : t)));
  }, []);

  const navigateTo = useCallback(
    (url: string, tabId?: string) => {
      const targetId = tabId || activeTabId;
      let finalUrl = url.trim();
      if (!finalUrl) return;
      if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('file://')) {
        if (finalUrl.includes('.') && !finalUrl.includes(' ')) {
          finalUrl = 'https://' + finalUrl;
        } else {
          finalUrl = 'https://www.google.com/search?q=' + encodeURIComponent(finalUrl);
        }
      }

      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== targetId) return t;
          const newHistory = t.history.slice(0, t.historyIndex + 1);
          newHistory.push(finalUrl);
          return {
            ...t,
            url: finalUrl,
            history: newHistory,
            historyIndex: newHistory.length - 1,
            loading: true,
          };
        })
      );
    },
    [activeTabId]
  );

  const goBack = useCallback(
    (tabId?: string) => {
      const targetId = tabId || activeTabId;
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== targetId || t.historyIndex <= 0) return t;
          const newIndex = t.historyIndex - 1;
          return { ...t, url: t.history[newIndex], historyIndex: newIndex, loading: true };
        })
      );
    },
    [activeTabId]
  );

  const goForward = useCallback(
    (tabId?: string) => {
      const targetId = tabId || activeTabId;
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id !== targetId || t.historyIndex >= t.history.length - 1) return t;
          const newIndex = t.historyIndex + 1;
          return { ...t, url: t.history[newIndex], historyIndex: newIndex, loading: true };
        })
      );
    },
    [activeTabId]
  );

  const reload = useCallback(
    (tabId?: string) => {
      const targetId = tabId || activeTabId;
      const iframe = iframeRefs.current[targetId];
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.location.reload();
      }
      updateTab(targetId, { loading: true });
      setTimeout(() => updateTab(targetId, { loading: false }), 800);
    },
    [activeTabId, updateTab]
  );

  const addTab = useCallback(() => {
    const newTab: Tab = {
      id: generateId(),
      title: 'Новая вкладка',
      url: '',
      favicon: '',
      history: [''],
      historyIndex: 0,
      loading: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, []);

  const closeTab = useCallback(
    (tabId: string) => {
      setTabs((prev) => {
        if (prev.length <= 1) {
          const resetTab: Tab = {
            id: generateId(),
            title: 'Новая вкладка',
            url: '',
            favicon: '',
            history: [''],
            historyIndex: 0,
            loading: false,
          };
          setActiveTabId(resetTab.id);
          return [resetTab];
        }
        const newTabs = prev.filter((t) => t.id !== tabId);
        if (activeTabId === tabId) {
          const closedIndex = prev.findIndex((t) => t.id === tabId);
          const newActive = prev[closedIndex - 1] || newTabs[0];
          setActiveTabId(newActive.id);
        }
        return newTabs;
      });
    },
    [activeTabId]
  );

  const addBookmark = useCallback((title: string, url: string) => {
    const newBookmark: Bookmark = {
      id: generateId(),
      title,
      url,
      favicon: `https://www.google.com/s2/favicons?domain=${url}&sz=32`,
    };
    setBookmarks((prev) => [...prev, newBookmark]);
  }, []);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const canGoBack = activeTab.historyIndex > 0;
  const canGoForward = activeTab.historyIndex < activeTab.history.length - 1;

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    bookmarks,
    sidebarOpen,
    setSidebarOpen,
    sidebarTab,
    setSidebarTab,
    iframeRefs,
    navigateTo,
    goBack,
    goForward,
    reload,
    addTab,
    closeTab,
    addBookmark,
    removeBookmark,
    updateTab,
    canGoBack,
    canGoForward,
  };
}
