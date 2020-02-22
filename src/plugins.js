const { Ender, util: { req } } = require('..');
const pluginList = require('../plugins.json');

const execa = require('execa');
const packageJSON = require('package-json');

module.exports = async (db, pkgDeps, plugins) => {
	const localPlugins = db.get('plugins').map('name').value();

	console.log('[PLUGINS] => Scanning for plugins...');

	if (plugins.length > 0) {
		/* eslint-disable max-depth */
		console.log('[PLUGINS] => Plugins found.');
		for (const plugin of plugins) {
			if (!plugin.name) {
				console.log(`[PLUGINS] => The plugin at '${plugin.dir}' doesn't define a name. A name is required. Skipping.`);
				continue;
			}

			if (!plugin.description) {
				console.log(`[PLUGINS => ${plugin.name}] => Plugin doesn't define a description. A description is required. Skipping.`);
				continue;
			}

			if (!plugin.version) {
				console.log(`[PLUGINS => ${plugin.name}] => Plugin doesn't define a version. A version is required. Skipping.`);
				continue;
			}

			// If the plugin isn't on our list, don't use it
			if (!pluginList[plugin.name]) continue;

			// Check local database to see if we know about the plugin
			if (!localPlugins.includes(plugin.name)) {
				db.get('plugins').push({ name: plugin.name, description: plugin.description, version: plugin.version }).write();
			}

			const pluginDeps = Object.keys(plugin.dependencies || {});
			if (pluginDeps.length > 0) {
				console.log(`[PLUGINS => ${plugin.name}] => Plugin requires dependencies.`);

				for (const dep of pluginDeps) {
					/* eslint-disable no-await-in-loop, security/detect-object-injection */
					console.log(`[PLUGINS => ${plugin.name} => DEPENDENCIES] => Plugin depends on ${dep}.`);

					// If the dependency is already in package.json, skip.
					if (pkgDeps.includes(dep)) {
						console.log(`[PLUGINS => ${plugin.name} => DEPENDENCIES] => ${dep} is a package dependency. Skipping.`);
						continue;
					}

					// Check if a version of the dependency is already installed and if so, skip.
					const d = req(dep, false);
					if (d) {
						console.log(`[PLUGINS => ${plugin.name} => DEPENDENCIES] => ${dep} is already installed. Skipping.`);
						continue;
					}

					// Validate that a dependency is a valid package
					await packageJSON(dep, { version: plugin.dependencies[dep] }).catch((error) => {
						if (error.name === 'PackageNotFoundError') {
							throw new Error(`'${dep}' is not a recognized package.`);
						}

						if (error.name === 'VersionNotFoundError') {
							throw new Error(`Unable to find a version of '${dep}' matching '${plugin.dependencies[dep]}'.`);
						}

						throw new Error(`An unknown error occurred: ${error}`);
					});

					// If the dependency is a valid package, it needs to be added in order for the plugin to work properly
					console.log(`[PLUGINS => ${plugin.name} => DEPENDENCIES] => Installing ${dep}@${pluginDeps[dep]}...`);
					await execa.command(`yarn add ${dep}@${pluginDeps[dep]} --silent`, { cwd: process.cwd() }).catch((error) => {
						throw new Error(`An error occurred when trying to install '${dep}': ${error}`);
					});

					// Try to require the dependency
					req(dep);
					console.log(`[PLUGINS => ${plugin.name} => DEPENDENCIES] => ${dep} is installed.`);

					/* eslint-enable no-await-in-loop, security/detect-object-injection */
				}
			}

			// eslint-disable-next-line security/detect-non-literal-require
			Ender.use(require(plugin.dir), plugin);
		}
		/* eslint-enable max-depth */
	}
};

