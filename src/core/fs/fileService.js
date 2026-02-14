const fs = require('fs');
const path = require('path');

class FileService {
  ensureDir(target) {
    fs.mkdirSync(target, { recursive: true });
  }

  writeJson(target, data) {
    this.ensureDir(path.dirname(target));
    fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf-8');
  }

  readJson(target) {
    return JSON.parse(fs.readFileSync(target, 'utf-8'));
  }

  writeText(target, text) {
    this.ensureDir(path.dirname(target));
    fs.writeFileSync(target, text, 'utf-8');
  }

  listFiles(root, extensions = []) {
    const out = [];
    if (!fs.existsSync(root)) return out;
    const stack = [root];
    while (stack.length) {
      const current = stack.pop();
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        const nextPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(nextPath);
          continue;
        }
        if (!extensions.length || extensions.some((ext) => entry.name.endsWith(ext))) {
          out.push(nextPath);
        }
      }
    }
    return out;
  }
}

module.exports = { FileService };
