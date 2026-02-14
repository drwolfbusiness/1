# MC Studio 1.20.1

MC Studio is a local-first Electron desktop IDE for visual Minecraft content development targeting Minecraft **1.20.1**.

## Features implemented
- Project lifecycle management (create/open/save/validate).
- Visual module workspace covering 20 core feature domains.
- Real-time 3D preview panel using local WebGL rendering.
- Export system generating datapack/resourcepack/shaderpack ZIP artifacts and Forge/Fabric mod source projects.
- Local plugin loading with basic capability introspection.
- Minecraft process integration hooks for client/server launch.

## Folder structure

```text
src/
  main/
    main.js
  preload/
    preload.js
  core/
    controllers/
      projectController.js
      exportController.js
    engine/
      generationEngine.js
    fs/
      fileService.js
    integration/
      minecraftIntegration.js
    plugins/
      pluginManager.js
    templates/
      forgeTemplates.js
      fabricTemplates.js
    validators/
      projectValidator.js
    sharedProjectSchema.js
  renderer/
    index.html
    css/styles.css
    js/renderer.js
docs/
  plugin-api.md
scripts/
  lint.js
  test.js
```

## Run

```bash
npm install
npm start
```

## Build desktop binaries

```bash
npm run dist
```

## Integrity checks
- Validation enforces namespace format, loader values, and Minecraft target version.
- Export pipeline writes deterministic artifact paths to `builds/`.
