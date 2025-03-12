// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Exponujte API do okna prohlížeče
contextBridge.exposeInMainWorld('electronAPI', {
    login: (credentials) => ipcRenderer.invoke('login', credentials),
    navigateTo: (page) => ipcRenderer.invoke('navigateTo', page),
    isAuthenticated: () => ipcRenderer.invoke('isAuthenticated'),
    getUser: () => ipcRenderer.invoke('getUser')
  });