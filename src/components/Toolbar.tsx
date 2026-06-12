import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Star, Lock, Search, Menu, Globe } from 'lucide-react';
import type { Tab } from '../hooks/useBrowser';

interface ToolbarProps {
  activeTab: Tab;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onNavigate: (url: string) => void;
  onHome: () => void;
  onToggleSidebar: () => void;
  onAddBookmark: (title: string, url: string) => void;
  sidebarOpen: boolean;
}

export function Toolbar({
  activeTab,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onReload,
  onNavigate,
  onHome,
  onToggleSidebar,
  onAddBookmark,
  sidebarOpen,
}: ToolbarProps) {
  const [inputValue, setInputValue] = useState(activeTab.url || '');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(activeTab.url || '');
  }, [activeTab.url, activeTab.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onNavigate(inputValue);
    }
  };

  const handleBookmark = () => {
    if (activeTab.url) {
      onAddBookmark(activeTab.title || activeTab.url, activeTab.url);
      setIsBookmarked(true);
      setTimeout(() => setIsBookmarked(false), 1500);
    }
  };

  const isSecure = activeTab.url.startsWith('https://');

  return (
    <div className="flex items-center gap-1.5 h-11 px-2 bg-[#1e1e1e] border-b border-[#333]">
      <button
        onClick={onToggleSidebar}
        className={`p-2 rounded-lg transition-colors ${sidebarOpen ? 'text-[#ff4b4b] bg-[#ff4b4b]/10' : 'text-gray-400 hover:text-white hover:bg-[#333]'}`}
      >
        <Menu size={16} />
      </button>

      <div className="w-px h-5 bg-[#333] mx-1" />

      <button
        onClick={onBack}
        disabled={!canGoBack}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
      >
        <ArrowLeft size={16} />
      </button>
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 transition-colors"
      >
        <ArrowRight size={16} />
      </button>
      <button
        onClick={onReload}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
      >
        <RotateCw size={16} className={activeTab.loading ? 'animate-spin' : ''} />
      </button>
      <button
        onClick={onHome}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#333] transition-colors"
      >
        <Home size={16} />
      </button>

      <form onSubmit={handleSubmit} className="flex-1 mx-2">
        <div className="flex items-center gap-2 h-8 px-3 bg-[#2a2a2a] rounded-full border border-[#3a3a3a] focus-within:border-[#ff4b4b]/50 focus-within:bg-[#323232] transition-all">
          {activeTab.url ? (
            isSecure ? (
              <Lock size={13} className="text-green-400 flex-shrink-0" />
            ) : (
              <Globe size={13} className="text-gray-500 flex-shrink-0" />
            )
          ) : (
            <Search size={13} className="text-gray-500 flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Введите адрес или поисковый запрос"
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none min-w-0"
          />
          {activeTab.loading && (
            <div className="w-3 h-3 border-2 border-[#ff4b4b] border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
        </div>
      </form>

      <button
        onClick={handleBookmark}
        className={`p-2 rounded-lg transition-colors ${isBookmarked ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-white hover:bg-[#333]'}`}
      >
        <Star size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
