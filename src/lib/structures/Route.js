const { Piece } = require('klasa');

class Route extends Piece {

	constructor(store, file, directory, options = {}) {
		super(store, file, directory, options);

		this.authenticated = options.authenticated;
		this.route = options.route;
	}

	reload() {
		super.reload();

		this.client.server.restart();
	}

}

module.exports = Route;
