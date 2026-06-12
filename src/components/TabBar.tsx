import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Tab } from '../hooks/useBrowser';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onAddTab: () => void;
}

export function TabBar({ tabs, activeTabId, onTabClick, onTabClose, onAddTab }: TabBarProps) {
  return (
    <div className="flex items-center h-10 bg-[#1e1e1e] border-b border-[#333] select-none overflow-x-auto scrollbar-hide">
      <div className="flex items-center flex-1 min-w-0">
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <motion.div
                key={tab.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => onTabClick(tab.id)}
                className={`
                  group relative flex items-center gap-2 h-9 px-3 min-w-[140px] max-w-[220px] 
                  cursor-pointer rounded-t-lg mr-0.5 transition-colors
                  ${isActive ? 'bg-[#2a2a2a] text-white' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#252525] hover:text-gray-300'}
                `}
              >
                {tab.favicon && tab.url ? (
                  <img src={tab.favicon} alt="" className="w-4 h-4 rounded-sm flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-sm bg-[#444] flex-shrink-0" />
                )}
                <span className="flex-1 truncate text-xs font-medium">{tab.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#444] transition-opacity"
                >
                  <X size={12} />
                </button>
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ff4b4b]"
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <button
        onClick={onAddTab}
        className="flex-shrink-0 p-2 mx-1 text-gray-400 hover:text-white hover:bg-[#333] rounded transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
