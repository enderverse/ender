const { Event } = require('klasa');

module.exports = class extends Event {

	init() {
		if (!this.client.options.consoleEvents.wtf) this.disable();
	}

	run(failure) {
		this.client.emit('track', { ec: 'console', ea: 'wtf' });
		this.client.console.wtf(failure);
	}

};
