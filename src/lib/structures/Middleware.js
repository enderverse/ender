const { Piece } = require('klasa');

class Middleware extends Piece {

	constructor(store, file, directory, options = {}) {
		super(store, file, directory, options);

		this.priority = options.priority;
	}

	// eslint-disable-next-line no-unused-vars
	run(req, res, route) {
		throw new Error(`The run method has not been implemented by ${this.type}:${this.name}.`);
	}

}

module.exports = Middleware;
