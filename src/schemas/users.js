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
	});
