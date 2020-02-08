const Middleware = require('../Middleware');
const { Store } = require('klasa');

class MiddlewareStore extends Store {

	constructor(client) {
		super(client, 'middlewares', Middleware);
	}

}

module.exports = MiddlewareStore;
