const { Piece } = require('klasa');

class Integration extends Piece {

	constructor(store, file, directory, options = {}) {
		super(store, file, directory, options);
	}

	run() {}

}

module.exports = Integration;
