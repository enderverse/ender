const Integration = require('../Integration');
const { Store } = require('klasa');

class IntegrationStore extends Store {

	constructor(client) {
		super(client, 'integrations', Integration);
	}

}

module.exports = IntegrationStore;
