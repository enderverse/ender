const Client = require('../lib/client/Client');
const EnderServer = require('../lib/EnderServer');
const FunctionStore = require('../lib/structures/stores/FunctionStore');
const IntegrationStore = require('../lib/structures/stores/IntegrationStore');
const MiddlewareStore = require('../lib/structures/stores/MiddlewareStore');
const RouteStore = require('../lib/structures/stores/RouteStore');
const { DEFAULTS } = require('../lib/util/Constants');

const Ender = require('..');

const { util: { isFunction, isObject, mergeDefault } } = require('klasa');
const pWaitFor = require('p-wait-for');

const plugins = [];

/**
 * @description The main Ender class
 * @class EnderClient
 * @extends {Client}
 */
class EnderClient extends Client {

	/**
	 * Creates an instance of Ender.
	 * @param {Object} [opts={}] The options to pass to the Client
	 * @memberof EnderClient
	 */
	constructor(opts = {}) {
		if (!isObject(opts)) throw new TypeError('The Ender options must be an object.');

		// Merge local options with default options
		opts = mergeDefault(DEFAULTS, opts);

		super(opts);

		this.Ender = {};

		/**
		 * The package information for Ender
		 * @type {Object}
		 */
		this.package = Ender.package;

		/**
		 * The plugin information for Ender
		 * @type {Object}
		 */
		this.plugins = {};

		/**
		 * The state of Ender
		 * @type {string}
		 */
		this.state = '';

		// Create stores
		this.functions = new FunctionStore(this);
		this.integrations = new IntegrationStore(this);
		this.middlewares = new MiddlewareStore(this);
		this.routes = new RouteStore(this);

		// Register stores
		this.registerStore(this.functions);
		this.registerStore(this.integrations);
		this.registerStore(this.middlewares);
		this.registerStore(this.routes);

		// Load in plugins
		for (const plugin of plugins) {
			this.plugins[plugin.info.name] = plugin.info;
			plugin.mod.call(this);
		}
	}

	/**
	 * Initialize the Ender instance
	 * @memberof EnderClient
	 * @returns {Promise}
	 */
	async init() {
		this.console.log('Ender initializing...');

		// Create server instance
		this.server = new EnderServer(this);

		// Initialize the client and server
		await super.init();
		if (this.server && this.server.init) await this.server.init();

		this.initialized = true;

		return this.initialized;
	}

	/**
	 * Emits an event
	 * @param {string} event the event name
	 * @param {any} args arguments to pass to the event
	 * @memberof EnderClient
	 */
	emit(event, ...args) {
		super.emit(event, ...args);
	}

	/**
	 * Login to Discord
	 * @param {string} token Discord Bot Token
	 * @memberof EnderClient
	 */
	async login(token) {
		// Wait for client to be initialized
		await pWaitFor(() => this.initialized);

		super.login(token);
	}

	/**
	 * Start the bot and server
	 * @param {string} token the Discord bot token
	 * @memberof EnderClient
	 */
	async start({ token } = {}) {
		if (!token) throw new Error('No token specified');

		this.Ender = {
			client: await this.login(token),
			server: this.server.listen(this.options.server.port)
		};
	}

	/**
	 * Wait until the Ender instance is ready
	 * @memberof EnderClient
	 * @returns {Promise}
	 */
	async wait() {
		const ready = this.initialized && this.ready;
		await pWaitFor(() => ready);
	}

	/**
	 * Cache a plugin to be loaded upon construction of the EnderClient instance
	 * @param {Object} mod The module
	 * @memberof EnderClient
	 * @returns {this}
	 */
	static use(mod, pl) {
		const plugin = mod[this.plugin];

		// If we don't have a plugin, check to see if it's a plugin for Klasa
		if (!plugin && mod[Client.plugin]) return Client.use(mod);

		// If we have a plugin, but the plugin isn't a function, something is wrong
		if (!isFunction(plugin)) throw new TypeError('The provided module does not include a plugin function');

		// If we have a plugin, cache it so that it can be loaded in when this instance is created
		plugins.push({ info: pl, mod: plugin });

		return this;
	}

}

module.exports = EnderClient;

/**
 * The Symbol used for Ender plugins
 * @type {Symbol}
 * @memberof EnderClient
 */
EnderClient.plugin = Symbol('EnderPlugin');
