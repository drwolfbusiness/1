# Plugin API

Plugins are local `.js` files loaded from the app plugin directory.

## Plugin contract

```js
module.exports = {
  name: 'ExamplePlugin',
  version: '1.0.0',
  capabilities: ['ui:panel', 'generator:hook']
};
```

## Capability model
- `ui:panel`: plugin can request a custom sidebar/inspector view.
- `generator:hook`: plugin can extend export generation behavior.
- `validator:rule`: plugin can inject additional project validation rules.

## Installation flow
1. Place plugin JS file on local disk.
2. Invoke `registerPlugin(pluginPath)` via preload API.
3. The runtime copies plugin file into the local plugin root.
4. Use `loadPlugins()` to discover loaded plugin metadata.

## Security notes
- Plugins execute in the main process context.
- Only install trusted plugins.
- For enterprise deployment, sign plugin bundles and add hash validation before loading.
