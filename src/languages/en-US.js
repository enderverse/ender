const { Language } = require('klasa');

module.exports = class extends Language {

	constructor(...args) {
		super(...args);

		this.language = {
			DEFAULT: (key) => `${key} has not yet been localized.`,
			DEFAULT_LANGUAGE: 'Default Language',

			COMMAND_ABOUT: '**Ender**, developed by **tjrgg#0130**.',
			COMMAND_ABOUT_DESCRIPTION: 'Sends information about the bot.',
			COMMAND_HELP_DESCRIPTION: 'Sends help.',
			COMMAND_HELP_DM: '📥 | The list of commands you have access to has been sent to you via DM.',
			COMMAND_HELP_EXTENDED: 'Extended Help =>',
			COMMAND_HELP_NODM: '❌ | You have DMs disabled for this server. Enable DMs for this server and run the command again.',
			COMMAND_HELP_USAGE: (usage) => `Usage => ${usage}`,

			NO_COMMAND_DESCRIPTION: 'No description provided.',
			NO_COMMAND_EXTENDEDHELP: 'No extended help available.'
		};
	}

	async init() {
		await super.init();
	}

};
