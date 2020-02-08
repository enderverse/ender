const { Event } = require('klasa');

module.exports = class extends Event {

	init() {
		if (!this.client.options.consoleEvents.warn) this.disable();
	}

	run(warning) {
		this.client.emit('track', { ec: 'console', ea: 'warn' });
		this.client.console.warn(warning);
	}

};
