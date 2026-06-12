import { useEffect, useState, useRef } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebViewProps {
  url: string;
  tabId: string;
  iframeRefs: React.MutableRefObject<Record<string, HTMLIFrameElement | null>>;
  onTitleChange: (title: string) => void;
  onFaviconChange: (favicon: string) => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
}

export function WebView({ url, tabId, iframeRefs, onTitleChange, onFaviconChange, onLoadStart, onLoadEnd }: WebViewProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadKey, setLoadKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!url) {
      setError(null);
      return;
    }
    setError(null);
    onLoadStart();

    const timer = setTimeout(() => {
      onLoadEnd();
      const domain = new URL(url).hostname;
      onTitleChange(domain);
      onFaviconChange(`https://www.google.com/s2/favicons?domain=${domain}&sz=32`);
    }, 1500);

    return () => clearTimeout(timer);
  }, [url, tabId, onTitleChange, onFaviconChange, onLoadStart, onLoadEnd]);

  const handleRetry = () => {
    setLoadKey((k) => k + 1);
    setError(null);
    onLoadStart();
    setTimeout(() => onLoadEnd(), 1500);
  };

  if (!url) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#1e1e1e]">
      {error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-full text-center p-8"
        >
          <div className="w-16 h-16 rounded-full bg-[#ff4b4b]/10 flex items-center justify-center mb-4">
            <AlertTriangle size={28} className="text-[#ff4b4b]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Не удалось загрузить страницу</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-md">
            Сайт может запрещать отображение во фреймах (X-Frame-Options) или быть недоступен.
            Это ограничение безопасности современных браузеров.
          </p>
          <p className="text-xs text-gray-600 mb-4 font-mono bg-[#252525] px-3 py-2 rounded">{url}</p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 rounded-lg text-sm transition-colors"
          >
            <RefreshCw size={14} />
            Повторить
          </button>
        </motion.div>
      ) : (
        <>
          <iframe
            key={`${tabId}-${loadKey}`}
            ref={(el) => {
              iframeRefs.current[tabId] = el;
            }}
            src={url}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            className="w-full h-full border-0"
            title={`web-content-${tabId}`}
            onError={() => setError('Failed to load')}
          />
        </>
      )}
    </div>
  );
}
