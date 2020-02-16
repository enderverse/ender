const config = require('./config');
const pluginList = require('../plugins.json');
const { Ender, plugins, util: { req } } = require('..');

const { resolve } = require('path');

const { readJSON } = require('fs-nextra');

const dotenv = require('dotenv');
const dotenvParse = require('dotenv-parse-variables');
const execa = require('execa');
const packageJSON = require('package-json');

const env = dotenvParse(dotenv.config({ path: resolve(process.cwd(), '.env') }).parsed);

(async () => {
	// CONFIG
	console.log('[APP] => Loading config..');
	const app = config(env);

	// PLUGINS
	console.log('[APP => PLUGINS] => Scanning for plugins...');
	const pl = await plugins();

	const pkg = await readJSON(resolve(process.cwd(), 'package.json'));
	const pkgDeps = Object.keys(pkg.dependencies);


	if (pl.length > 0) {
		/* eslint-disable max-depth */
		console.log('[APP => PLUGINS] => Plugins found.');
		for (const plugin of pl) {
			if (!plugin.name) {
				console.log(`[APP => PLUGINS] => The plugin at '${plugin.dir}' doesn't define a name. A name is required. Skipping.`);
				continue;
			}

			if (!plugin.description) {
				console.log(`[APP => PLUGINS => ${plugin.name}] => Plugin doesn't define a description. A description is required. Skipping.`);
				continue;
			}

			if (!plugin.version) {
				console.log(`[APP => PLUGINS => ${plugin.name}] => Plugin doesn't define a version. A version is required. Skipping.`);
				continue;
			}

			// If the plugin isn't on our list, don't use it
			if (!pluginList[plugin.name]) continue;

			if (plugin.dependencies) {
				plugin.deps = [];
				const pluginDeps = Object.keys(plugin.dependencies);

				if (pluginDeps.length === 0) continue;

				console.log(`[APP => PLUGINS => ${plugin.name}] => Plugin requires dependencies.`);

				for (const dep of pluginDeps) {
					/* eslint-disable no-await-in-loop */
					console.log(`[APP => PLUGINS => ${plugin.name} => DEPENDENCIES] => Plugin depends on ${dep}.`);

					// If the dependency is already in package.json, skip.
					if (pkgDeps.includes(dep)) {
						console.log(`[APP => PLUGINS => ${plugin.name} => DEPENDENCIES] => ${dep} is a package dependency. Skipping.`);
						continue;
					}

					// Check if a version of the dependency is already installed and if so, skip.
					const d = req(dep, false);
					if (d) {
						console.log(`[APP => PLUGINS => ${plugin.name} => DEPENDENCIES] => ${dep} is already installed. Skipping.`);
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
					console.log(`[APP => PLUGINS => ${plugin.name} => DEPENDENCIES] => Installing ${dep}@${pluginDeps[dep]}...`);
					await execa.command(`yarn add ${dep}@${pluginDeps[dep]} --silent`, { cwd: process.cwd() }).catch((error) => {
						throw new Error(`An error occurred when trying to install '${dep}': ${error}`);
					});

					// Try to require the dependency
					req(dep);
					console.log(`[APP => PLUGINS => ${plugin.name} => DEPENDENCIES] => ${dep} is installed.`);

					/* eslint-enable no-await-in-loop */
				}
			}

			// eslint-disable-next-line security/detect-non-literal-require
			Ender.use(require(plugin.dir), plugin);
		}
		/* eslint-enable max-depth */
	}

	const App = new Ender(app);

	App.init();
	App.start({ token: env.DISCORD_TOKEN });
})();
