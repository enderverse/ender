const { Event } = require('klasa');

module.exports = class extends Event {

	init() {
		if (!this.client.options.consoleEvents.error) this.disable();
	}

	run(err) {
		this.client.emit('track', { ec: 'console', ea: 'error' });
		this.client.console.error(err);
	}

};
