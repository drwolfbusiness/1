const path = require('path');
const { execFileSync } = require('child_process');
const { GenerationEngine } = require('../engine/generationEngine');
const { FileService } = require('../fs/fileService');

class ExportController {
  constructor() {
    this.engine = new GenerationEngine();
    this.fs = new FileService();
  }

  buildAll(project) {
    const outputDir = path.join(project.rootPath, 'builds');
    this.fs.ensureDir(outputDir);

    const datapackDir = this.engine.generateDataPack(project, outputDir);
    const resourcepackDir = this.engine.generateResourcePack(project, outputDir);
    const shaderpackDir = this.engine.generateShaderPack(project, outputDir);
    const forgeDir = this.engine.generateForgeProject(project, outputDir);
    const fabricDir = this.engine.generateFabricProject(project, outputDir);

    const datapackZip = this.zipFolder(datapackDir, path.join(outputDir, 'datapack.zip'));
    const resourceZip = this.zipFolder(resourcepackDir, path.join(outputDir, 'resourcepack.zip'));
    const shaderZip = this.zipFolder(shaderpackDir, path.join(outputDir, 'shaderpack.zip'));

    return {
      outputDir,
      artifacts: { datapackZip, resourceZip, shaderZip, forgeDir, fabricDir }
    };
  }

  zipFolder(folderPath, targetZip) {
    execFileSync('zip', ['-rq', targetZip, '.'], { cwd: folderPath });
    return targetZip;
  }
}

module.exports = { ExportController };
