class ProjectValidator {
  validate(project) {
    const issues = [];
    if (!project.name) issues.push('Project name is required.');
    if (!/^[a-z0-9_\-]+$/.test(project.namespace || '')) issues.push('Namespace must match [a-z0-9_-].');
    if (project.minecraftVersion !== '1.20.1') issues.push('Only Minecraft 1.20.1 is currently supported.');
    if (!['forge', 'fabric'].includes(project.loader)) issues.push('Loader must be forge or fabric.');
    return {
      valid: issues.length === 0,
      issues
    };
  }
}

module.exports = { ProjectValidator };
