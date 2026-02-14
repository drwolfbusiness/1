const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { ProjectController } = require('../core/controllers/projectController');
const { ExportController } = require('../core/controllers/exportController');
const { PluginManager } = require('../core/plugins/pluginManager');
const { MinecraftIntegration } = require('../core/integration/minecraftIntegration');

const userDataRoot = app.getPath('userData');
const projectController = new ProjectController();
const exportController = new ExportController();
const pluginManager = new PluginManager(path.join(userDataRoot, 'plugins'));
const integration = new MinecraftIntegration();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 960,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    backgroundColor: '#1e1f22'
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
}

function registerIpc() {
  ipcMain.handle('project:new', async (_, payload) => projectController.create(payload));
  ipcMain.handle('project:open', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (result.canceled || !result.filePaths.length) return null;
    return projectController.open(result.filePaths[0]);
  });

  ipcMain.handle('project:save', async (_, project) => projectController.save(project));
  ipcMain.handle('project:validate', async (_, project) => projectController.validate(project));

  ipcMain.handle('assets:index', async (_, projectRoot) => projectController.indexAssets(projectRoot));

  ipcMain.handle('exports:buildAll', async (_, project) => exportController.buildAll(project));

  ipcMain.handle('plugins:load', async () => pluginManager.loadAll());
  ipcMain.handle('plugins:register', async (_, pluginPath) => pluginManager.install(pluginPath));

  ipcMain.handle('integration:launch', async (_, options) => integration.launchClient(options));
  ipcMain.handle('integration:server', async (_, options) => integration.launchServer(options));

  ipcMain.handle('file:read', async (_, filePath) => fs.readFileSync(filePath, 'utf-8'));
}

app.whenReady().then(() => {
  registerIpc();
  createWindow();
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
