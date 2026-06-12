import { useState } from 'react';
import { Plus, X, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpeedDialItem {
  id: string;
  title: string;
  url: string;
  color: string;
}

const defaultItems: SpeedDialItem[] = [
  { id: '1', title: 'Google', url: 'https://www.google.com', color: '#4285f4' },
  { id: '2', title: 'YouTube', url: 'https://www.youtube.com', color: '#ff0000' },
  { id: '3', title: 'GitHub', url: 'https://github.com', color: '#333' },
  { id: '4', title: 'Wikipedia', url: 'https://wikipedia.org', color: '#3366cc' },
  { id: '5', title: 'Reddit', url: 'https://reddit.com', color: '#ff4500' },
  { id: '6', title: 'Twitter', url: 'https://twitter.com', color: '#1da1f2' },
  { id: '7', title: 'Amazon', url: 'https://amazon.com', color: '#ff9900' },
  { id: '8', title: 'Netflix', url: 'https://netflix.com', color: '#e50914' },
];

interface SpeedDialProps {
  onNavigate: (url: string) => void;
}

export function SpeedDial({ onNavigate }: SpeedDialProps) {
  const [items, setItems] = useState<SpeedDialItem[]>(defaultItems);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleAdd = () => {
    if (newTitle && newUrl) {
      const colors = ['#ff4b4b', '#4285f4', '#34a853', '#fbbc04', '#ff6d00', '#aa00ff', '#00bfa5', '#ff4081'];
      setItems((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          title: newTitle,
          url: newUrl.startsWith('http') ? newUrl : 'https://' + newUrl,
          color: colors[Math.floor(Math.random() * colors.length)],
        },
      ]);
      setNewTitle('');
      setNewUrl('');
      setShowAdd(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 bg-[#1e1e1e]">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff4b4b] to-[#ff8f4b] mb-4 shadow-lg shadow-[#ff4b4b]/20">
            <Globe size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">OperaX Browser</h1>
          <p className="text-sm text-gray-500">Быстрый доступ к вашим любимым сайтам</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative"
            >
              <button
                onClick={() => onNavigate(item.url)}
                className="w-full flex flex-col items-center gap-2 p-4 rounded-xl bg-[#252525] hover:bg-[#2f2f2f] border border-[#333] hover:border-[#444] transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: item.color }}
                >
                  {item.title[0].toUpperCase()}
                </div>
                <span className="text-xs text-gray-300 truncate w-full text-center">{item.title}</span>
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="absolute -top-1 -right-1 p-1 rounded-full bg-[#333] text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </motion.div>
          ))}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: items.length * 0.05 }}
            onClick={() => setShowAdd(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#252525] hover:bg-[#2f2f2f] border border-dashed border-[#444] hover:border-[#ff4b4b]/50 transition-all"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-dashed border-[#555] text-gray-500">
              <Plus size={20} />
            </div>
            <span className="text-xs text-gray-500">Добавить</span>
          </motion.button>
        </div>

        {showAdd && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-xl bg-[#252525] border border-[#333]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Добавить сайт</span>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Название"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full h-9 px-3 bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-[#ff4b4b]/50"
              />
              <input
                type="text"
                placeholder="URL (например, google.com)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full h-9 px-3 bg-[#1e1e1e] border border-[#3a3a3a] rounded-lg text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-[#ff4b4b]/50"
              />
              <button
                onClick={handleAdd}
                className="w-full h-9 bg-[#ff4b4b] hover:bg-[#ff3333] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Добавить
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
