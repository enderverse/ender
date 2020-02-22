const { Ender, plugins: scan } = require('..');
const config = require('./config');
const plugins = require('./plugins');

const { resolve } = require('path');

const { readJSON } = require('fs-nextra');

const dotenv = require('dotenv');
const dotenvParse = require('dotenv-parse-variables');
const lowdb = require('lowdb');
const lowdbFileSync = require('lowdb/adapters/FileSync');

const env = dotenvParse(dotenv.config({ path: resolve(process.cwd(), '.env') }).parsed);

// eslint-disable-next-line new-cap
const db = lowdb(new lowdbFileSync(resolve(process.cwd(), 'data', 'local.json')));
db.defaults({ plugins: [] }).write();

(async () => {
	// PACKAGE
	const pkg = await readJSON(resolve(process.cwd(), 'package.json'));
	const pkgDeps = Object.keys(pkg.dependencies);

	// PLUGINS
	await plugins(db, pkgDeps, await scan());

	await new Ender(config(env)).start({ token: env.DISCORD_TOKEN });
})();
