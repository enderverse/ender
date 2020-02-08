const { Event } = require('klasa');

module.exports = class extends Event {

	init() {
		if (!this.client.options.consoleEvents.debug) this.disable();
	}

	run(data) {
		if (!this.client.ready) return;

		this.client.emit('track', { ec: 'console', ea: 'debug' });
		this.client.console.debug(data);
	}

};
