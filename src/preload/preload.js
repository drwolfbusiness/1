const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mcStudioApi', {
  createProject: (payload) => ipcRenderer.invoke('project:new', payload),
  openProject: () => ipcRenderer.invoke('project:open'),
  saveProject: (project) => ipcRenderer.invoke('project:save', project),
  validateProject: (project) => ipcRenderer.invoke('project:validate', project),
  indexAssets: (root) => ipcRenderer.invoke('assets:index', root),
  buildAllExports: (project) => ipcRenderer.invoke('exports:buildAll', project),
  loadPlugins: () => ipcRenderer.invoke('plugins:load'),
  registerPlugin: (pluginPath) => ipcRenderer.invoke('plugins:register', pluginPath),
  launchMinecraft: (options) => ipcRenderer.invoke('integration:launch', options),
  launchServer: (options) => ipcRenderer.invoke('integration:server', options)
});
