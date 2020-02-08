/**
 * @description The main error class for Ender
 * @class EnderError
 * @extends {Error}
 */
class EnderError extends Error {

	/**
	 * Creates an instance of EnderError.
	 * @param {string} [message] The message of the error
	 * @param {Object} [name=null] The name of the error
	 * @memberof Error
	 */
	constructor(message, name = null) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = name || 'EnderError';
		this.message = message;
	}

}

module.exports = EnderError;
