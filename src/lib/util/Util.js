const execa = require('execa');

class Util {

	constructor() {
		throw new Error('This class may not be initiated with new');
	}

	static req(mod, install = true) {
		try {
			require.resolve(mod);
		}
		catch (error) {
			if (install && error.code === 'MODULE_NOT_FOUND') {
				// eslint-disable-next-line no-unused-vars
				execa.command(`yarn add ${mod} --silent`, { cwd: process.cwd() }).catch((error) => {
					throw new Error(`Something went wrong when trying to install '${mod}'.`);
				});
			}
			else { throw new Error(`Couldn't resolve '${mod}'.`); }

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
