// Preload script pour sécuriser l'application
const { contextBridge, ipcRenderer } = require('electron');

// Exposer des APIs sécurisées au renderer process si nécessaire
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemple d'API exposée (ajoutez selon vos besoins)
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});

// Améliorer la sécurité
window.addEventListener('DOMContentLoaded', () => {
  console.log('Application SoussDev chargée');
});