const { contextBridge } = require('electron');

// Безопасный API для взаимодействия между renderer и main процессами
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});
