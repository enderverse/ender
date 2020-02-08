const { Schema } = require('klasa');

module.exports = new Schema()
	.add('_', (schema) => {
		schema.add('legal', (schema) => {
			schema.add('privacy', (schema) => {
				schema.add('updated', 'number', { configurable: false });
				schema.add('version', 'number', { configurable: false });
			});
			schema.add('terms', (schema) => {
				schema.add('updated', 'number', { configurable: false });
				schema.add('version', 'number', { configurable: false });
			});
		});
		schema.add('updated', 'number', { configurable: false });
		schema.add('version', 'number', { configurable: false });
	})

	.add('client', (schema) => {
		schema.add('application', 'any', { configurable: false });
		schema.add('guilds', 'string', { array: true, configurable: false });
		schema.add('users', 'string', { array: true, configurable: false });
	})

	.add('analytics', 'any', { array: true })
	.add('blacklist', (schema) => {
		schema.add('guilds', 'guild', { array: true });
		schema.add('users', 'user', { array: true });
	})
	.add('schedules', 'any', { array: true });
