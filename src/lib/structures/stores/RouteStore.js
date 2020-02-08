const Route = require('../Route');
const { Store } = require('klasa');

class RouteStore extends Store {

	constructor(client) {
		super(client, 'routes', Route);
	}

}

module.exports = RouteStore;
