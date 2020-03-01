const { Ender } = require('..');
const pluginList = require('../plugins.json');

module.exports = async (db, pkgDeps, plugins) => {
	plugins = plugins.filter((p) => p.name);

	if (plugins.length > 0) {
		for (const plugin of plugins) {
			if (!plugin.name || plugin.name === '') {
				console.log(`[PLUGINS] => The plugin at '${plugin.dir}' doesn't define a name. A name is required. Skipping.`);
				continue;
			}

			if (!plugin.description || plugin.description === '') {
				console.log(`[PLUGINS => ${plugin.name}] => Plugin doesn't define a description. A description is required. Skipping.`);
				continue;
			}

			if (!plugin.version || plugin.version === '') {
				console.log(`[PLUGINS => ${plugin.name}] => Plugin doesn't define a version. A version is required. Skipping.`);
				continue;
			}

			// If the plugin isn't on our list, don't use it
			if (!pluginList[plugin.name]) continue;

			// eslint-disable-next-line security/detect-non-literal-require
			Ender.use(require(plugin.dir), plugin);
		}
	}
};

