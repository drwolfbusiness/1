const modules = [
  'Project Management', 'Item Editor', 'Block Editor', 'Entity Designer', 'Recipe Builder',
  'Loot Table Designer', 'Texture & Model Studio', 'Animation Suite', 'Creative Inventory Manager',
  '3D Rendering Preview', 'Mod Generators', 'Plugin Framework', 'World Generation Studio',
  'Biome Designer', 'Dimension Creator', 'Shader Pack Tools', 'NBT Editor',
  'Minecraft Integration', 'Multiplayer Test Tools', 'Export System'
];

const state = {
  project: null,
  selectedModule: 'Project Management'
};

function setStatus(message) {
  document.getElementById('statusBar').textContent = message;
}

function renderNav() {
  const nav = document.getElementById('moduleNav');
  nav.innerHTML = '';
  modules.forEach((name) => {
    const el = document.createElement('div');
    el.className = 'module-item';
    el.textContent = name;
    el.onclick = () => {
      state.selectedModule = name;
      renderEditor();
    };
    nav.appendChild(el);
  });
}

function renderEditor() {
  const host = document.getElementById('editorHost');
  const project = state.project || {
    name: '', namespace: 'example', loader: 'forge', minecraftVersion: '1.20.1'
  };

  host.innerHTML = `
    <h3>${state.selectedModule}</h3>
    <div class="form-grid">
      <div><label>Project Name</label><input id="projectName" value="${project.name}" /></div>
      <div><label>Namespace</label><input id="namespace" value="${project.namespace}" /></div>
      <div><label>Loader</label><select id="loader"><option value="forge">Forge</option><option value="fabric">Fabric</option></select></div>
      <div><label>Minecraft Version</label><input id="mcVersion" value="${project.minecraftVersion}" disabled /></div>
      <div><label>JSON Payload</label><textarea id="modulePayload">{}</textarea></div>
    </div>
    <button id="applyModuleBtn">Apply to ${state.selectedModule}</button>
  `;
  document.getElementById('loader').value = project.loader;

  document.getElementById('applyModuleBtn').onclick = () => {
    const payload = document.getElementById('modulePayload').value;
    let parsed = {};
    try {
      parsed = JSON.parse(payload);
    } catch {
      setStatus('Invalid JSON payload.');
      return;
    }

    state.project = {
      ...(state.project || {}),
      name: document.getElementById('projectName').value,
      namespace: document.getElementById('namespace').value,
      loader: document.getElementById('loader').value,
      minecraftVersion: '1.20.1',
      [state.selectedModule.replace(/[^a-zA-Z0-9]/g, '_')]: parsed
    };
    document.getElementById('inspectorOutput').textContent = JSON.stringify(state.project, null, 2);
    setStatus(`${state.selectedModule} updated.`);
  };
}

async function createProject() {
  const rootPath = prompt('Project folder path (absolute):', '/tmp/mcstudio-project');
  if (!rootPath) return;
  state.project = await window.mcStudioApi.createProject({
    name: 'MyModProject',
    namespace: 'mymod',
    loader: 'forge',
    rootPath
  });
  renderEditor();
  setStatus(`Project created at ${rootPath}`);
}

async function saveProject() {
  if (!state.project) return setStatus('No project loaded.');
  state.project = await window.mcStudioApi.saveProject(state.project);
  setStatus('Project saved.');
}

async function validateProject() {
  if (!state.project) return setStatus('No project loaded.');
  const result = await window.mcStudioApi.validateProject(state.project);
  document.getElementById('inspectorOutput').textContent = JSON.stringify(result, null, 2);
  setStatus(result.valid ? 'Validation passed.' : `Validation failed: ${result.issues.join(', ')}`);
}

async function exportAll() {
  if (!state.project) return setStatus('No project loaded.');
  const result = await window.mcStudioApi.buildAllExports(state.project);
  document.getElementById('inspectorOutput').textContent = JSON.stringify(result, null, 2);
  setStatus(`Export completed in ${result.outputDir}`);
}

function setupCommandPalette() {
  const input = document.getElementById('commandInput');
  const output = document.getElementById('commandOutput');
  input.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    if (cmd === 'validate') await validateProject();
    else if (cmd === 'export') await exportAll();
    else if (cmd === 'plugins') {
      const plugins = await window.mcStudioApi.loadPlugins();
      output.textContent = JSON.stringify(plugins, null, 2);
      setStatus('Plugins loaded.');
    } else {
      output.textContent = `Unknown command: ${cmd}`;
    }
  });
}

function setupPreview() {
  const canvas = document.getElementById("previewCanvas");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    setStatus("WebGL unavailable in this environment.");
    return;
  }

  function render(time) {
    const t = time * 0.001;
    canvas.width = canvas.clientWidth;
    canvas.height = 220;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.12 + Math.sin(t) * 0.05, 0.13, 0.17 + Math.cos(t) * 0.05, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function wireActions() {
  document.getElementById('newProjectBtn').onclick = createProject;
  document.getElementById('saveProjectBtn').onclick = saveProject;
  document.getElementById('validateBtn').onclick = validateProject;
  document.getElementById('exportBtn').onclick = exportAll;
  document.getElementById('assetSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    for (const item of document.querySelectorAll('.module-item')) {
      item.style.display = item.textContent.toLowerCase().includes(term) ? '' : 'none';
    }
  });
}

renderNav();
renderEditor();
wireActions();
setupCommandPalette();
setupPreview();
setStatus('MC Studio loaded.');
