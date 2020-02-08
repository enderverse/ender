const { resolve } = require('path');

const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

class Conf extends Map {

	constructor(path) {
		super();

		let env = dotenv.config({ path: resolve(process.cwd(), path || '.env') }).parsed;
		env = dotenvParseVariables(env);

		// eslint-disable-next-line guard-for-in
		for (const key in env) {
			this.set(key, env[key]);
		}

		this.ready = true;
	}

}

module.exports = Conf;
