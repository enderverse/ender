exports.DEFAULTS = {
	commandMessageLifetime: 3600,
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
		timestamps: 'MM/DD/YYYY @ h:mm:ss.SS A',
		useColor: true,
		utc: false
	},
	consoleEvents: {
		debug: false,
		error: true,
		log: true,
		verbose: false,
		warn: false,
		wtf: true
	},
	createPiecesFolders: false,
	customPromptDefaults: {
		limit: 3,
		quotedStringSupport: false,
		time: 1000 * 60 * 1
	},
	disabledCorePieces: [],
	gateways: {
		clientStorage: {},
		guilds: {},
		users: {}
	},
	language: 'en-US',
	noPrefixDM: false,
	owners: [ '176610059684544512' ],
	quotedStringSupport: true,
	permissionLevels: undefined,
	pieceDefaults: {
		commands: {
			aliases: [],
			enabled: true,
			name: undefined,
			description: (language) => language.get('NO_COMMAND_DESCRIPTION'), extendedHelp: (language) => language.get('NO_COMMAND_EXTENDEDHELP'),
			deletable: false, guarded: false, hidden: false, nsfw: false,
			autoAliases: true, flagSupport: true, quotedStringSupport: false, promptLimit: 3, promptTime: 1000 * 60, subcommands: false,
			bucket: 1, cooldown: 0, cooldownLevel: 'author', permissionLevel: 0, runIn: [ 'dm', 'text' ],
			requiredPermissions: [], requiredSettings: [], requiredUpgrade: 0,
			usage: '', usageDelim: undefined
		},
		events: {
			enabled: true,
			once: false
		},
		extendables: {
			enabled: true
		},
		functions: {
			enabled: true
		},
		integrations: {
			enabled: true
		},
		middlewares: {
			enabled: true
		},
		monitors: {
			enabled: true,
			ignoreBlacklistedGuilds: false, ignoreBlacklistedUsers: false,
			ignoreBots: false, ignoreEdits: false, ignoreOthers: false, ignoreSelf: true, ignoreWebhooks: true
		},
		providers: {
			enabled: true
		},
		routes: {
			enabled: true
		},
		tasks: {
			enabled: true
		}
	},
	prefix: [ '/' ],
	prefixCaseInsensitive: true,
	preserveSettings: false,
	production: true,
	providers: { default: 'json' },
	readyMessage: (client) => `${client.user.username} ready. Serving ${client.guilds.size} ${client.guilds.size === 1 ? 'guild' : 'guilds'}.`,
	regexPrefix: undefined,
	schedule: { interval: 1000 * 15 },
	settings: {
		preserve: true,
		throwOnError: true
	},
	slowmode: false,
	slowmodeAggressive: false,
	typing: false,

	commandEditing: true,
	commandLogging: false,
	messageLogging: false,

	apiRequestMethod: 'sequential',
	disabledEvents: [ 'TYPING_START' ],
	fetchAllMembers: false,
	messageCacheLifetime: 60 * 30,
	messageCacheMaxSize: 500,
	messageCacheSweepInterval: 60 * 5,
	presence: undefined,

	adminOnly: false,
	analytics: { enabled: true, trackingId: undefined },
	commandCooldown: true,
	deleteCommand: true,
	deleteCommandResponse: true,
	integrations: {},
	server: { port: 3000 },
	statistics: true
};
