/* eslint-disable camelcase */
const database = require('../utils/database');

const salvarBoleto = async (boleto) => {
	const { client_id, name, endereco, type, country } = boleto;
	const query = {
		text: `INSERT INTO boleto (
			client_id, 
			name, 
			endereco, 
			type, 
			country
			) VALUES ($1, $2, $3, $4, $5)`,
		values: [client_id, name, endereco, type, country],
	};

	const result = await database.query(query);
	return result.rows.shift();
};

module.exports = { salvarBoleto };
