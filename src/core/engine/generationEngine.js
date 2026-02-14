const path = require('path');
const { FileService } = require('../fs/fileService');
const { buildForgeMainClass, buildForgeModsToml } = require('../templates/forgeTemplates');
const { buildFabricModJson, buildFabricMainClass } = require('../templates/fabricTemplates');

class GenerationEngine {
  constructor() {
    this.fs = new FileService();
  }

  generateDataPack(project, outputDir) {
    const base = path.join(outputDir, 'datapack');
    this.fs.writeJson(path.join(base, 'pack.mcmeta'), { pack: { pack_format: 15, description: `${project.name} datapack` } });
    this.fs.writeJson(path.join(base, 'data', project.namespace, 'recipes', 'generated_recipe.json'), {
      type: 'minecraft:crafting_shapeless',
      ingredients: [{ item: 'minecraft:stone' }],
      result: { item: 'minecraft:diamond', count: 1 }
    });
    return base;
  }

  generateResourcePack(project, outputDir) {
    const base = path.join(outputDir, 'resourcepack');
    this.fs.writeJson(path.join(base, 'pack.mcmeta'), { pack: { pack_format: 15, description: `${project.name} resource pack` } });
    this.fs.writeJson(path.join(base, 'assets', project.namespace, 'models', 'item', 'generated_item.json'), {
      parent: 'item/generated',
      textures: { layer0: `${project.namespace}:item/generated_item` }
    });
    return base;
  }

  generateShaderPack(project, outputDir) {
    const base = path.join(outputDir, 'shaderpack');
    this.fs.writeText(path.join(base, 'shaders', 'example.fsh'), 'void main() { gl_FragColor = vec4(1.0); }');
    return base;
  }

  generateForgeProject(project, outputDir) {
    const base = path.join(outputDir, 'forge-mod');
    const className = project.name.replace(/[^a-zA-Z0-9]/g, '');
    const pkgPath = project.namespace.replace(/\./g, '/');
    this.fs.writeText(path.join(base, 'src', 'main', 'java', pkgPath, `${className}Mod.java`), buildForgeMainClass(project.namespace, className));
    this.fs.writeText(path.join(base, 'src', 'main', 'resources', 'META-INF', 'mods.toml'), buildForgeModsToml(project.namespace, project.name));
    return base;
  }

  generateFabricProject(project, outputDir) {
    const base = path.join(outputDir, 'fabric-mod');
    const pkgPath = project.namespace.replace(/\./g, '/');
    this.fs.writeJson(path.join(base, 'src', 'main', 'resources', 'fabric.mod.json'), buildFabricModJson(project.namespace, project.name));
    this.fs.writeText(path.join(base, 'src', 'main', 'java', pkgPath, `${project.namespace}Mod.java`), buildFabricMainClass(project.namespace));
    return base;
  }
}

module.exports = { GenerationEngine };
