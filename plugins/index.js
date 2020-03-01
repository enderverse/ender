const { resolve } = require('path');

const { readJSON, scan } = require('fs-nextra');

module.exports = async () => {
	const pluginDirs = await scan(__dirname, { depthLimit: 1, filter: (stats) => stats.isDirectory() });
	const pluginsArray = [ ...pluginDirs.keys() ].slice(1);

	const plugins = Promise.all(pluginsArray.map(async (plugin) => {
		try {
			const plug = resolve(plugin, 'plugin.json');
			return { ...await readJSON(plug), dir: plugin };
		}
		catch (error) {
			if (error.code === 'ENOENT') console.log(`[PLUGINS] => The plugin at ${plugin} does not have a plugin.json file.`);
			return {};
		}
	}));

	return plugins;
};
