const { Event } = require('klasa');

module.exports = class extends Event {

	init() {
		if (!this.client.options.consoleEvents.log) this.disable();
	}

	run(data) {
		this.client.emit('track', { ec: 'console', ea: 'log' });
		this.client.console.log(data);
	}

};
