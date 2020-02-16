const { stderr, stdout } = process;

const { PermissionLevels } = require('klasa');

module.exports = (env) => {
	return {
		commandLogging: env.ENDER_BOT_LOG_LEVEL >= 1,
		console: {
			// colors: {
			//     debug: { type: 'log', message: '', time: '' },
			//     error: { type: 'error', message: '', time: '' },
			//     log: { type: 'log', message: '', time: '' },
			//     verbose: { type: 'log', message: '', time: '' },
			//     warn: { type: 'warn', message: '', time: '' },
			//     wtf: { type: 'error', message: '', time: '' }
			// },
			stderr,
			stdout,
			timestamps: env.FORMAT_DATETIME,
			useColor: env.LOG_COLOR || true,
			utc: false
		},
		consoleEvents: {
			debug: env.LOG_LEVEL >= 4,
			error: env.LOG_LEVEL >= 0,
			log: env.LOG_LEVEL >= 3,
			verbose: env.LOG_LEVEL >= 5,
			warn: env.LOG_LEVEL >= 2,
			wtf: env.LOG_LEVEL >= 1
		},
		disabledEvents: [ 'TYPING_START' ],
		fetchAllMembers: true,
		messageLogging: env.ENDER_BOT_LOG_LEVEL >= 2,
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
		prefix: env.ENDER_BOT_PREFIX,
		production: env.PRODUCTION,
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
		shardCount: env.BOT_SHARDS,

		adminOnly: env.ADMIN_ONLY,
		server: {
			port: env.ENDER_SERVER_PORT,
			session: { secret: env.ENDER_SERVER_SESSION_SECRET }
		}
	};
};
