const fs = require('fs');
const path = require('path');

class PluginManager {
  constructor(pluginRoot) {
    this.pluginRoot = pluginRoot;
    fs.mkdirSync(pluginRoot, { recursive: true });
  }

  install(pluginPath) {
    const fileName = path.basename(pluginPath);
    const target = path.join(this.pluginRoot, fileName);
    fs.copyFileSync(pluginPath, target);
    return { installed: true, path: target };
  }

  loadAll() {
    const plugins = fs.readdirSync(this.pluginRoot).filter((file) => file.endsWith('.js'));
    return plugins.map((file) => {
      const fullPath = path.join(this.pluginRoot, file);
      delete require.cache[require.resolve(fullPath)];
      const plugin = require(fullPath);
      return {
        name: plugin.name || file,
        version: plugin.version || '1.0.0',
        capabilities: plugin.capabilities || []
      };
    });
  }
}

module.exports = { PluginManager };
