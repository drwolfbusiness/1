const os = require('os');
const path = require('path');
const fs = require('fs');
const { ProjectController } = require('../src/core/controllers/projectController');
const { ExportController } = require('../src/core/controllers/exportController');

const root = path.join(os.tmpdir(), 'mcstudio-test-project');
fs.rmSync(root, { recursive: true, force: true });
fs.mkdirSync(root, { recursive: true });

const projectController = new ProjectController();
const exportController = new ExportController();

let project = projectController.create({
  name: 'TestProject',
  namespace: 'testmod',
  loader: 'forge',
  rootPath: root
});

const validation = projectController.validate(project);
if (!validation.valid) throw new Error(`Expected valid project: ${validation.issues.join(', ')}`);

project = projectController.save(project);
const exported = exportController.buildAll(project);
if (!fs.existsSync(exported.artifacts.datapackZip)) throw new Error('datapack.zip missing');
if (!fs.existsSync(exported.artifacts.resourceZip)) throw new Error('resourcepack.zip missing');
if (!fs.existsSync(exported.artifacts.shaderZip)) throw new Error('shaderpack.zip missing');

console.log('Test pass: project creation, validation, save, and exports are functional.');
