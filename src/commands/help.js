const { Command } = require('../../src');
const { util: { isFunction } } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: [ '?', 'cmds', 'commands' ],
			description: (language) => language.get(`COMMAND_${this.name.toUpperCase()}_DESCRIPTION`),
			usage: '(Command:command)'
		});

		this.createCustomResolver('command', (arg, possible, message) => {
			if (!arg || arg === '') return undefined;
			return this.client.arguments.get('command').run(arg, possible, message);
		});
	}

	async run(message, [ command ]) {
		let prefix = message.guild.settings.get('prefix');
		// eslint-disable-next-line unicorn/explicit-length-check
		if (prefix.length && prefix.length > 1) prefix = prefix[0];

		if (command) {
			const info = [
				`**${prefix}${command.name}** => ${isFunction(command.description) ? command.description(message.language) : command.description}`,
				'',
				message.language.get('COMMAND_HELP_USAGE', command.usage.fullUsage(message)),
				`${message.language.get('COMMAND_HELP_EXTENDED')} ${isFunction(command.extendedHelp) ? command.extendedHelp(message.language) : command.extendedHelp}`
			].join('\n');
			return message.sendMessage(info);
		}

		const help = await this.buildHelp(prefix, message);
		const helpMessage = [];
		helpMessage.push(help.join('\n'));

		return message.channel.send(helpMessage, { split: { char: '\u200B' } });
	}


	async buildHelp(prefix, message) {
		const help = [];

		await Promise.all(this.client.commands.map((command) =>
			this.client.inhibitors.run(message, command, true)
				.then(() => {
					const description = isFunction(command.description) ? command.description(message.language) : command.description;
					help.push(`**${prefix}${command.name}** => ${description}`);
					help.sort();
				})
				.catch(() => {
					// noop
				})));

		return help;
	}

};
