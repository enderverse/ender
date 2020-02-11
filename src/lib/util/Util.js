const execa = require('execa');

class Util {

	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	static req(mod) {
		try {
			require.resolve(mod);
		}
		catch (error) {
			if (error.code === 'MODULE_NOT_FOUND') {
				// eslint-disable-next-line no-unused-vars
				execa(`yarn add ${mod}`).catch((error) => {
					throw new Error(`Something went wrong when trying to resolve '${mod}'.`);
				});
			}
			else { throw new Error(`Something went wrong when trying to resolve '${mod}'.`); }

			setImmediate(() => {});
		}

		try {
			return require(mod);
		}
		// eslint-disable-next-line no-unused-vars
		catch (error) {
			throw new Error(`Could not include "${mod}". Aborted.`);
		}
	}

}

module.exports = Util;
