const { Command: KlasaCommand } = require('klasa');

class Command extends KlasaCommand {

	constructor(store, file, directory, options = {}) {
		super(store, file, directory, options);

		// this.description = this.client.languages.default.get(`COMMAND_${this.name.toUpperCase()}_DESCRIPTION`);

		// this.extendedHelp = this.client.languages.default.get(`COMMAND_${this.name.toUpperCase()}_EXTENDEDHELP`);

		this.plugin = options.plugin || undefined;
	}

}

module.exports = Command;
