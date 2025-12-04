const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Créer la GBov principale
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'icon/icns.png'),
    // Configuration pour affichage maximisé sans menu
    frame: true, // Garder le frame pour les boutons fermer/minimiser
    autoHideMenuBar: true, // Cacher automatiquement la barre de menu
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: true,
      webviewTag: true,
      // Permet les iframes et les inputs
      sandbox: false
    },
    show: false // Ne pas afficher jusqu'à ce que ready-to-show soit émis
  });

  // Charger l'application web
  mainWindow.loadURL('http://soussdev.atwebpages.com');

  // Afficher la GBov quand elle est prête
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize(); // Maximiser la GBov
    mainWindow.show();
    
    // Optionnel : ouvrir les outils de développement
    // mainWindow.webContents.openDevTools();
  });

  // Gérer la fermeture de la GBov
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Gérer les liens externes (les ouvrir dans le navigateur par défaut)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });

  // Permettre la navigation uniquement sur le domaine autorisé
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const allowedDomains = ['soussdev.atwebpages.com'];
    
    if (!allowedDomains.includes(parsedUrl.hostname)) {
      event.preventDefault();
      require('electron').shell.openExternal(navigationUrl);
    }
  });

  // Injecter du CSS pour s'assurer que les inputs et iframes fonctionnent
  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.insertCSS(`
      /* Assurer que les inputs fonctionnent correctement */
      input, textarea, select {
        -webkit-user-select: text !important;
        user-select: text !important;
        pointer-events: auto !important;
      }
      
      /* Assurer que les iframes fonctionnent */
      iframe {
        pointer-events: auto !important;
        border: 0;
      }
      
      /* Optimisations générales */
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    `);
  });
}

// Cette méthode sera appelée quand Electron aura fini de s'initialiser
app.whenReady().then(() => {
  // Supprimer complètement le menu de l'application
  Menu.setApplicationMenu(null);
  
  createWindow();

  // Sur macOS, il est courant de recréer une GBov quand l'icône du dock est cliquée
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quitter quand toutes les GBovs sont fermées, sauf sur macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});