const { Client: DiscordClient } = require('discord.js');
const { KlasaClient, PermissionLevels, Schema, Stopwatch } = require('klasa');

/**
 * The extended Client used by Ender
 * @class Client
 * @extends external:KlasaClient
 */
class Client extends KlasaClient {

	/**
	 * Creates an instance of the Client
	 * @param {*} opts The options to pass on to KlasaClient
	 */
	constructor(opts) {
		super(opts);

		/**
		 * Whether or not the Client has been initialized
		 * @type {boolean}
		 */
		this.initialized = false;

		/**
		 * Whether or not the Client is ready
		 * @type {boolean}
		 */
		this.ready = false;

		/**
		 * An object of Schemas
		 * @type {Object}
		 */
		this.schemas = {
			client: new Schema(),
			guilds: new Schema(),
			users: new Schema()
		};

		/**
		 * Clears core directories sets from Klasa
		 */
		for (const store of this.pieceStores.values()) store.coreDirectories.clear();
	}

	/**
	 * Initialize the Client instance
	 * @returns {boolean} this.initialized
	 */
	async init() {
		const timer = new Stopwatch();

		if (this.options.settings && this.options.settings.gateways) {
			if (this.options.settings.gateways.clientStorage) this.schemas.client = this.options.settings.gateways.clientStorage.schema;
			if (this.options.settings.gateways.guilds) this.schemas.guilds = this.options.settings.gateways.guilds.schema;
			if (this.options.settings.gateways.users) this.schemas.users = this.options.settings.gateways.users.schema;
		}

		/**
		 * Set default schemas in KlasaClient
		 */
		KlasaClient.defaultClientSchema = this.schemas.client;
		KlasaClient.defaultGuildSchema = this.schemas.guilds;
		KlasaClient.defaultUserSchema = this.schemas.users;

		/**
		 * Set default permission levels in KlasaClient
		 */
		KlasaClient.defaultPermissionLevels = new PermissionLevels(50 + 1);

		/**
		 * Load piece stores
		 */
		await Promise.all(this.pieceStores.map(async (store) => {
			const count = await store.loadAll().catch((error) => {
				throw new Error(error);
			});
			const storeName = count === 1 ? store.name.slice(0, -1) : store.name;

			this.console.debug(`Loaded ${count} ${storeName}.`);
		}));
		this.emit('debug', 'Loaded all pieces.');

		/**
		 * Initialize providers
		 */
		await this.providers.init();
		this.emit('debug', 'Initialized providers.');

		/**
		 * Initialize gateways
		 */
		await this.gateways.init();
		this.emit('debug', 'Initialized gateways.');

		/**
		 * Log that everything has initialized in this client
		 */
		this.emit('log', `Client fully initialized in ${timer.stop()}.`);

		return this;
	}

	/**
	 * Login to Discord
	 * @param {string} token Discord bot token
	 */
	login(token) {
		DiscordClient.prototype.login.call(this, token);
	}

}

module.exports = Client;
