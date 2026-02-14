const path = require('path');
const { FileService } = require('../fs/fileService');
const { createDefaultProject } = require('../sharedProjectSchema');
const { ProjectValidator } = require('../validators/projectValidator');

class ProjectController {
  constructor() {
    this.fileService = new FileService();
    this.validator = new ProjectValidator();
  }

  create(payload) {
    const project = createDefaultProject(payload);
    if (!project.rootPath) {
      throw new Error('rootPath is required for creating a project.');
    }
    this.save(project);
    return project;
  }

  open(rootPath) {
    const projectPath = path.join(rootPath, 'mcstudio.project.json');
    const project = this.fileService.readJson(projectPath);
    project.rootPath = rootPath;
    return project;
  }

  save(project) {
    const next = { ...project, updatedAt: new Date().toISOString() };
    const projectPath = path.join(next.rootPath, 'mcstudio.project.json');
    this.fileService.writeJson(projectPath, next);
    return next;
  }

  validate(project) {
    return this.validator.validate(project);
  }

  indexAssets(projectRoot) {
    const files = this.fileService.listFiles(projectRoot, ['.png', '.json', '.mcmeta', '.ogg', '.glsl']);
    return files.map((file) => ({ path: file, type: this.detectType(file) }));
  }

  detectType(file) {
    if (file.endsWith('.png')) return 'texture';
    if (file.endsWith('.glsl')) return 'shader';
    if (file.endsWith('.ogg')) return 'sound';
    if (file.endsWith('.mcmeta')) return 'metadata';
    return 'json';
  }
}

module.exports = { ProjectController };
