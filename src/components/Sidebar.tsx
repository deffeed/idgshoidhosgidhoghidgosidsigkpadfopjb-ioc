import { useState, useEffect } from 'react';
import { Bookmark as BookmarkIcon, History, Trash2, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Bookmark, Tab } from '../hooks/useBrowser';

interface SidebarProps {
  open: boolean;
  activeTab: string;
  bookmarks: Bookmark[];
  tabs: Tab[];
  onTabChange: (tab: 'bookmarks' | 'history') => void;
  onNavigate: (url: string) => void;
  onRemoveBookmark: (id: string) => void;
  onClose?: () => void;
}

export function Sidebar({ open, activeTab, bookmarks, tabs, onTabChange, onNavigate, onRemoveBookmark, onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const history = tabs.flatMap((t) =>
    t.history
      .filter((url) => url)
      .map((url, i) => ({
        url,
        title: url,
        tabId: t.id,
        index: i,
      }))
  );

  const uniqueHistory = history.filter((item, index, self) =>
    index === self.findIndex((t) => t.url === item.url)
  ).slice(-30).reverse();

  return (
    <AnimatePresence>
      {open && (
        <>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={onClose}
            />
          )}
          <motion.div
            initial={{ width: 0, opacity: 0, x: isMobile ? -20 : 0 }}
            animate={{ width: 240, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: isMobile ? -20 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`flex-shrink-0 bg-[#1a1a1a] border-r border-[#333] overflow-hidden flex flex-col z-50 ${isMobile ? 'fixed left-0 top-[90px] bottom-0 shadow-2xl' : ''}`}
          >
          <div className="flex items-center h-10 border-b border-[#333]">
            <button
              onClick={() => onTabChange('bookmarks')}
              className={`flex-1 flex items-center justify-center gap-1.5 h-full text-xs font-medium transition-colors ${
                activeTab === 'bookmarks' ? 'text-[#ff4b4b] border-b-2 border-[#ff4b4b]' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <BookmarkIcon size={14} />
              Закладки
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`flex-1 flex items-center justify-center gap-1.5 h-full text-xs font-medium transition-colors ${
                activeTab === 'history' ? 'text-[#ff4b4b] border-b-2 border-[#ff4b4b]' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Clock size={14} />
              История
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {activeTab === 'bookmarks' && (
              <>
                {bookmarks.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    <BookmarkIcon size={24} className="mx-auto mb-2 opacity-50" />
                    Нет закладок
                  </div>
                )}
                {bookmarks.map((bookmark) => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                    onClick={() => onNavigate(bookmark.url)}
                  >
                    <img
                      src={bookmark.favicon}
                      alt=""
                      className="w-5 h-5 rounded flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%23666" stroke-width="2"%3E%3Ccircle cx="12" cy="12" r="10"/%3E%3C/svg%3E';
                      }}
                    />
                    <span className="flex-1 truncate text-xs text-gray-300">{bookmark.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(bookmark.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#444] text-gray-500 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                    <ExternalLink size={12} className="text-gray-600 opacity-0 group-hover:opacity-100" />
                  </motion.div>
                ))}
              </>
            )}

            {activeTab === 'history' && (
              <>
                {uniqueHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500 text-xs">
                    <History size={24} className="mx-auto mb-2 opacity-50" />
                    История пуста
                  </div>
                )}
                {uniqueHistory.map((item, idx) => (
                  <motion.div
                    key={`${item.url}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#2a2a2a] cursor-pointer transition-colors"
                    onClick={() => onNavigate(item.url)}
                  >
                    <History size={14} className="text-gray-500 flex-shrink-0" />
                    <span className="flex-1 truncate text-xs text-gray-300">{item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                  </motion.div>
                ))}
              </>
            )}
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
