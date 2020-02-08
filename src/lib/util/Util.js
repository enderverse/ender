const { execSync } = require('child_process');

class Util {

	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	static req(module) {
		try {
			require.resolve(module);
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			execSync(`yarn add ${module}`);
			setImmediate(() => {});
		}

		try {
			return require(module);
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			throw new Error(`Could not include "${module}". Aborted.`);
		}
	}

}

module.exports = Util;
