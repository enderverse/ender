const Function = require('../Function');
const { Store } = require('klasa');

class FunctionStore extends Store {

	constructor(client) {
		super(client, 'functions', Function);
	}

}

module.exports = FunctionStore;
