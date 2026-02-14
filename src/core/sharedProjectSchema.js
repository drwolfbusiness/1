function createDefaultProject(input = {}) {
  const now = new Date().toISOString();
  return {
    name: input.name || 'NewProject',
    namespace: input.namespace || 'example',
    minecraftVersion: '1.20.1',
    loader: input.loader || 'forge',
    createdAt: now,
    updatedAt: now,
    rootPath: input.rootPath || '',
    dependencies: [],
    assets: [],
    items: [],
    blocks: [],
    entities: [],
    recipes: [],
    lootTables: [],
    animations: [],
    dimensions: [],
    biomes: [],
    worldgen: [],
    shaders: [],
    pluginData: {}
  };
}

module.exports = { createDefaultProject };
