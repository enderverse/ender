module.exports = {
	package: require('../package.json'),
	version: require('../package.json').version,

	// lib
	Ender: require('./lib/EnderClient'),
	EnderClient: require('./lib/EnderClient'),
	EnderServer: require('./lib/EnderServer'),
	Server: require('./lib/EnderServer'),

	// lib/client
	Client: require('./lib/client/Client'),

	// lib/errors
	EnderError: require('./lib/errors/Error'),
	Error: require('./lib/errors/Error'),

	// lib/structures
	Command: require('./lib/structures/Command'),
	Function: require('./lib/structures/Function'),
	Integration: require('./lib/structures/Integration'),
	Middleware: require('./lib/structures/Middleware'),
	Route: require('./lib/structures/Route'),

	// lib/structures/stores
	FunctionStore: require('./lib/structures/stores/FunctionStore'),
	IntegrationStore: require('./lib/structures/stores/IntegrationStore'),
	MiddlewareStore: require('./lib/structures/stores/MiddlewareStore'),
	RouteStore: require('./lib/structures/stores/RouteStore'),

	// lib/util
	Constants: require('./lib/util/Constants'),
	Util: require('./lib/util/Util'),
	util: require('./lib/util/Util'),

	// eslint-disable-next-line unicorn/import-index
	plugins: require('../plugins/index.js')
};

// eslint-disable-next-line import/no-unassigned-import
require('./app');
