import { useCallback, useEffect } from 'react';
import { useBrowser } from './hooks/useBrowser';
import { TabBar } from './components/TabBar';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { WebView } from './components/WebView';
import { SpeedDial } from './components/SpeedDial';

export default function App() {
  const {
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
  } = useBrowser();

  const handleNavigate = useCallback(
    (url: string) => {
      navigateTo(url);
    },
    [navigateTo]
  );

  const handleHome = useCallback(() => {
    updateTab(activeTabId, { url: '', history: [''], historyIndex: 0 });
  }, [activeTabId, updateTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 't') {
          e.preventDefault();
          addTab();
        } else if (e.key === 'w') {
          e.preventDefault();
          closeTab(activeTabId);
        } else if (e.key === 'l') {
          e.preventDefault();
          const input = document.querySelector('input[type="text"]') as HTMLInputElement;
          input?.focus();
          input?.select();
        }
      } else if (e.altKey) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goBack();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          goForward();
        }
      } else if (e.key === 'F5') {
        e.preventDefault();
        reload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addTab, closeTab, activeTabId, goBack, goForward, reload]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1e1e] text-white overflow-hidden select-none">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabClick={setActiveTabId}
        onTabClose={closeTab}
        onAddTab={addTab}
      />

      <Toolbar
        activeTab={activeTab}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onBack={goBack}
        onForward={goForward}
        onReload={reload}
        onNavigate={handleNavigate}
        onHome={handleHome}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onAddBookmark={addBookmark}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          activeTab={sidebarTab}
          bookmarks={bookmarks}
          tabs={tabs}
          onTabChange={setSidebarTab}
          onNavigate={handleNavigate}
          onRemoveBookmark={removeBookmark}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 relative overflow-hidden">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`absolute inset-0 ${tab.id === activeTabId ? 'z-10' : 'z-0 pointer-events-none opacity-0'}`}
            >
              {!tab.url ? (
                <SpeedDial onNavigate={handleNavigate} />
              ) : (
                <WebView
                  url={tab.url}
                  tabId={tab.id}
                  iframeRefs={iframeRefs}
                  onTitleChange={(title) => updateTab(tab.id, { title })}
                  onFaviconChange={(favicon) => updateTab(tab.id, { favicon })}
                  onLoadStart={() => updateTab(tab.id, { loading: true })}
                  onLoadEnd={() => updateTab(tab.id, { loading: false })}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
