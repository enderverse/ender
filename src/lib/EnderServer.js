const express = require('express');

const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');

const router = express.Router;

/**
 * The Server used by Ender
 * @class Server
 */
class EnderServer {

	/**
	 * Creates an instance of the Server
	 * @param {Client} client An instance of the Client
	 */
	constructor(client) {
		this.client = client;
		this.router = router;
		this.server = express();
	}

	/**
	 * Initialize the Server instance
	 * @returns {this}
	 */
	init() {
		this.server.set('view engine', 'ejs');
		this.server.set('x-powered-by', false);

		this.server.use(express.json());
		this.server.use(express.urlencoded({ extended: true }));

		this.server.use(helmet());

		this.server.use(session({ secret: this.client.options.server.session.secret, resave: false, saveUninitialized: false }));

		this.server.use(passport.initialize());
		this.server.use(passport.session());

		this.client.middlewares.forEach((middleware) => {
			this.server.use(middleware.run);
		});

		this.client.routes.forEach((route) => {
			this.server.use(route.route, route.run());
		});

		return this;
	}

	/**
	 * Closes the server
	 */
	close() {
		return new Promise((resolve, reject) => {
			if (this.http) {
				this.http.close((err) => {
					if (err) {
						if (this.client.listenerCount('serverError')) this.client.emit('serverError', err);
						else if (this.client.listenerCount('error')) this.client.emit('error', err);

						reject(err);
					}

					if (this.client.listenerCount('serverClosed')) this.client.emit('serverClosed');

					resolve();
				});
			}

			reject(new Error('No server started'));
		});
	}

	/**
	 * Starts the server
	 * @param {integer} port The port to use for the Server
	 */
	listen(port) {
		this.http = this.server.listen(port, () => this.client.console.log(`[SERVER] => Server started on port ${port}.`));
		this.port = port;

		this.http.on('error', (e) => {
			if (e.code === 'EADDRINUSE') {
				this.client.emit('error', '[SERVER] => Address already in use. Retrying...');
				setTimeout(() => {
					this.http.close(() => {
						this.http = this.server.listen(port, () => this.client.console.log(`[SERVER] => Server started on port ${port}.`));
						this.http.on('error', (e) => {
							if (e.code === 'EADDRINUSE') {
								this.http.close();
								this.client.emit('error', '[SERVER] => Failed to start server. Address is already in use.');
							}
						});
					});
				}, 1000 * 3);
			}

			if (this.client.listenerCount('serverError')) this.client.emit('serverError', e);
			else if (this.client.listenerCount('error')) this.client.emit('error', e);
		});

		if (this.client.listenerCount('serverStarted')) this.client.emit('serverStarted');
	}

	restart() {
		this.close(() => {
			this.init();
			this.listen(this.port);
		});
	}

}

module.exports = EnderServer;
