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

## Quick Start (EN)

### 1) Requirements
- Node.js 18+
- npm 9+
- `zip` CLI available in PATH (used by export pipeline)

### 2) Install dependencies
```bash
npm install
```

### 3) Run desktop app
```bash
npm start
```

### 4) Run checks
```bash
npm run lint
npm test
```

### 5) Build desktop binaries
```bash
npm run dist
```

## ازاي اجرب المشروع؟ (AR)

### 1) المتطلبات
- Node.js إصدار 18 أو أعلى.
- npm إصدار 9 أو أعلى.
- أمر `zip` يكون متاح على الجهاز.

### 2) تثبيت الحزم
```bash
npm install
```

### 3) تشغيل البرنامج كـ Desktop App
```bash
npm start
```

### 4) اختبار سريع قبل التشغيل الكامل
لو عندك مشكلة في تحميل الحزم من npm، تقدر تتأكد إن المنطق الأساسي شغال بالأوامر دي:
```bash
node scripts/lint.js
node scripts/test.js
```

### 5) تجربة الواجهة فقط (بدون Electron)
ده مفيد لو عايز تشوف الـ UI بسرعة:
```bash
python3 -m http.server 4173 --directory src/renderer
```
وبعدين افتح:
`http://127.0.0.1:4173/index.html`

> ملاحظة: في وضع المتصفح العادي، وظائف Electron IPC مش هتشتغل لأن `window.mcStudioApi` متوفرة فقط داخل Electron.

## Integrity checks
- Validation enforces namespace format, loader values, and Minecraft target version.
- Export pipeline writes deterministic artifact paths to `builds/`.
