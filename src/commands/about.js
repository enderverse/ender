const { Command } = require('../../src');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [ 'info' ],
			description: (language) => language.get(`COMMAND_${this.name.toUpperCase()}_DESCRIPTION`)
		});
	}

	async run(message) {
		return message.respond(message.guild.language.get('COMMAND_ABOUT'));
	}

};
