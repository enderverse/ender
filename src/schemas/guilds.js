const { Schema } = require('klasa');

module.exports = new Schema()
	.add('_', (schema) => {
		schema.add('legal', (schema) => {
			schema.add('privacy', (schema) => {
				schema.add('accepted', 'boolean', { configurable: false });
				schema.add('timestamp', 'number', { configurable: false });
			});
			schema.add('terms', (schema) => {
				schema.add('accepted', 'boolean', { configurable: false });
				schema.add('timestamp', 'number', { configurable: false });
			});
		});
	})

	.add('alerts', (schema) => {
		schema.add('alerts', 'any', { array: true, configurable: false });
		schema.add('config', 'any', { array: true, configurable: false });
	})
	.add('analytics', 'any', { array: true })
	.add('filter', (schema) => {
		schema.add('config', 'any', { array: true, configurable: false });
	})
	.add('history', (schema) => {
		schema.add('commands', 'any', { array: true, configurable: false });
		schema.add('messages', 'any', { array: true, configurable: false });
	})
	.add('hooks', (schema) => {
		schema.add('incoming', 'any', { array: true, configurable: false });
		schema.add('outgoing', 'any', { array: true, configurable: false });
	})

	.add('options', (schema) => {
		schema.add('language', 'language');
		schema.add('roles', (schema) => {
			schema.add('muted', 'role');
		});
	});
