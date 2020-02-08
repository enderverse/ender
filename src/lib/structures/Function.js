const { Piece } = require('klasa');

class Function extends Piece {

	constructor(store, file, directory, options = {}) {
		super(store, file, directory, options);
	}

	run() {}

}

module.exports = Function;
