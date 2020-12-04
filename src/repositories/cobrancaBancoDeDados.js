const Database = require('../utils/database');

const gerarCobrancaDB = async (boleto) => {
	const {
		idCliente,
		descricao,
		valor,
		vencimento,
		linkBoleto,
		codigoBoleto,
		status,
	} = boleto;
	const query = {
		text: `INSERT INTO cobrancas (
			id_do_cliente, 
			descricao, 
			valor, 
			vencimento,
			link_do_boleto,
			codigo_de_barras,
			status
			) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
		values: [
			idCliente,
			descricao,
			valor,
			vencimento,
			linkBoleto,
			codigoBoleto,
			status,
		],
	};
	const resposta = await Database.query(query);
	return resposta.rows.shift();
};

const controleDeCobrancasDB = async (idUsuario) => {
	const query = {
		text: `SELECT * 
			FROM cobrancas
			WHERE id_do_cliente IN (
				SELECT id FROM clientes
					WHERE usuario_id = $1
			);`,
		values: [idUsuario],
	};
	const result = await Database.query(query);
	return result.rows;
};

const buscarUmaCobrancaDB = async (idDaCobranca) => {
	const query = {
		text: `SELECT * 
				FROM cobrancas
				WHERE id = $1;`,
		values: [idDaCobranca],
	};

	const result = await Database.query(query);
	return result.rows.shift();
};

const quitarCobrancaDB = async (idDaCobranca) => {
	const query = {
		text: `UPDATE cobrancas
				SET status = 'PAGO'
				WHERE id = $1 RETURNING*;`,
		values: [idDaCobranca],
	};
	const response = await Database.query(query);
	return response.rows.shift();
};

module.exports = {
	gerarCobrancaDB,
	controleDeCobrancasDB,
	buscarUmaCobrancaDB,
	quitarCobrancaDB,
};
