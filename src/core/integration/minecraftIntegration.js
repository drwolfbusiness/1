const { spawn } = require('child_process');

class MinecraftIntegration {
  launchClient(options) {
    return this.launchProcess(options.javaPath || 'java', ['-jar', options.clientJar, '--version', '1.20.1']);
  }

  launchServer(options) {
    return this.launchProcess(options.javaPath || 'java', ['-jar', options.serverJar, 'nogui']);
  }

  launchProcess(command, args) {
    const child = spawn(command, args, { stdio: 'pipe' });
    return new Promise((resolve) => {
      const logs = [];
      child.stdout.on('data', (data) => logs.push(data.toString()));
      child.stderr.on('data', (data) => logs.push(data.toString()));
      child.on('close', (code) => resolve({ code, logs }));
    });
  }
}

module.exports = { MinecraftIntegration };
