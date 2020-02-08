const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, {
			emitter: process
		});
		if (this.client.options.production) this.unload();
	}

	run(error) {
		this.client.console.error(`Uncaught Rejection: \n${error.stack || error}`);
	}

};
