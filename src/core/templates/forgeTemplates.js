function buildForgeMainClass(namespace, modName) {
  return `package ${namespace};

import net.minecraftforge.fml.common.Mod;

@Mod("${namespace}")
public class ${modName}Mod {
    public ${modName}Mod() {
    }
}
`;
}

function buildForgeModsToml(namespace, name) {
  return `modLoader="javafml"
loaderVersion="[47,)"
license="MIT"

[[mods]]
modId="${namespace}"
version="1.0.0"
displayName="${name}"
`;
}

module.exports = { buildForgeMainClass, buildForgeModsToml };
