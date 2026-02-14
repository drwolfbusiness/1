const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files = files.concat(walk(full));
    else if (entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

const jsFiles = walk(path.join(__dirname, '..', 'src'));
const violations = [];
for (const file of jsFiles) {
  const text = fs.readFileSync(file, 'utf-8');
  if (text.includes('\t')) violations.push(`${file}: tabs are not allowed`);
}

if (violations.length) {
  console.error(violations.join('\n'));
  process.exit(1);
}
console.log(`Lint pass. Checked ${jsFiles.length} files.`);
