const { query } = require('../utils/database');
const database = require('../utils/database');

const now = async () => {
	const query = `SELECT now()`;
	// const query = await client.query('SELECT now();')
	const result = await database.query(query);

	return result;
};

module.exports = { now };
