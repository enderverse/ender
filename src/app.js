const { resolve } = require('path');

const pluginList = require('../plugins.json');
const { Conf, Ender, plugins, util: { req } } = require('..');

const { readJSON } = require('fs-nextra');
const { PermissionLevels } = require('klasa');

const execa = require('execa');
const packageJSON = require('package-json');

const conf = new Conf();

const app = {
	commandLogging: conf.get('ENDER_BOT_LOG_LEVEL') >= 1,
	console: {
		// colors: {
		//     debug: { type: 'log', message: '', time: '' },
		//     error: { type: 'error', message: '', time: '' },
		//     log: { type: 'log', message: '', time: '' },
		//     verbose: { type: 'log', message: '', time: '' },
		//     warn: { type: 'warn', message: '', time: '' },
		//     wtf: { type: 'error', message: '', time: '' }
		// },
		stderr: process.stderr,
		stdout: process.stdout,
		timestamps: conf.get('FORMAT_DATETIME'),
		useColor: true,
		utc: false
	},
	consoleEvents: {
		debug: conf.get('LOG_LEVEL') >= 4,
		error: conf.get('LOG_LEVEL') >= 0,
		log: conf.get('LOG_LEVEL') >= 3,
		verbose: conf.get('LOG_LEVEL') >= 5,
		warn: conf.get('LOG_LEVEL') >= 2,
		wtf: conf.get('LOG_LEVEL') >= 1
	},
	disabledEvents: [ 'TYPING_START' ],
	fetchAllMembers: true,
	messageLogging: conf.get('ENDER_BOT_LOG_LEVEL') >= 2,
	permissionLevels: new PermissionLevels(50 + 1)
		.add(0, () => true)
		.add(5, ({ guild, member }) => guild && member.permissions.has('MANAGE_MESSAGES'), { fetch: true })
		.add(10, ({ guild, member }) => guild && (member.permissions.has('BAN_MEMBERS') || member.permissions.has('KICK_MEMBERS')), { fetch: true })
		.add(11, ({ guild, member }) => guild && member.roles.get(guild.settings.get('options.roles.moderator')), { fetch: true })
		.add(20, ({ guild, member }) => guild && member.permissions.has('MANAGE_GUILD'), { fetch: true })
		.add(25, ({ guild, member }) => guild && member.permissions.has('ADMINISTRATOR'), { fetch: true })
		.add(30, ({ guild, author }) => guild && guild.owner === author, { fetch: true })
		.add(40, ({ client, author }) => client.owners.has(author), { break: true })
		.add(50, ({ client, author }) => client.owners.has(author)),
	prefix: conf.get('ENDER_BOT_PREFIX'),
	production: conf.get('PRODUCTION'),
	settings: {
		gateways: {
			clientStorage: {
				provider: undefined,
				schema: require('./schemas/client.js')
			},
			guilds: {
				provider: undefined,
				schema: require('./schemas/guilds.js')
			},
			users: {
				provider: undefined,
				schema: require('./schemas/users.js')
			}
		}
	},
	shardCount: conf.get('BOT_SHARDS'),

	adminOnly: conf.get('ADMIN_ONLY'),
	server: {
		port: conf.get('ENDER_SERVER_PORT'),
		session: { secret: conf.get('ENDER_SERVER_SESSION_SECRET') }
	}
};

(async () => {
	console.log('[APP => PLUGINS] => Scanning for plugins...');

	const pkg = await readJSON(resolve(__dirname, '..', 'package.json'));
	const pkgDeps = Object.keys(pkg.dependencies);

	const pl = await plugins();

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

			Ender.use(require(plugin.dir), plugin);
		}
		/* eslint-enable max-depth */
	}

	const App = new Ender(app);

	App.init();
	App.start({ token: conf.get('DISCORD_TOKEN') });
})();
