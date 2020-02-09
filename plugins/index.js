const { parse } = require('path');

const { readJSON, scan } = require('fs-nextra');

const plugins = [];

module.exports = async () => {
	const plInfo = await scan(__dirname, { depthLimit: 2, filter: (stats, dir) => {
		const file = parse(dir);
		return stats.isFile() && file.base === 'plugin.json' && file.ext === '.json' && file.name === 'plugin';
	} });
	const pl = plInfo.keys();

	for (const p of pl) {
		// eslint-disable-next-line no-await-in-loop
		plugins.push({ ...await readJSON(p), dir: parse(p).dir });
	}

	return plugins;
};
