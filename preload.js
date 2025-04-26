//preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Exponujte API do okna prohlížeče
contextBridge.exposeInMainWorld('electronAPI', {
    login: (credentials) => ipcRenderer.invoke('login', credentials),
    navigateTo: (page) => ipcRenderer.invoke('navigateTo', page),
    isAuthenticated: () => ipcRenderer.invoke('isAuthenticated'),
    getUser: () => ipcRenderer.invoke('getUser')
  });

  import { Titlebar } from "custom-electron-titlebar";

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implementation
  new Titlebar();
}); 

