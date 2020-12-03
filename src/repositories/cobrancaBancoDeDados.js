const database = require('../utils/database');

const gerarCobranca = async (boleto) => {
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
	const resposta = await database.query(query);
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
	const result = await database.query(query);
	return result.rows;
};

const quitarCobranca = async (idDaCobranca) => {
	const query = {
		text: `UPDATE cobrancas
				SET status = 'PAGO'
				WHERE id = $1 RETURNING*;`,
		values: [idDaCobranca],
	};
	const response = await database.query(query);
	return response.rows.shift();
};

module.exports = {
	gerarCobranca,
	controleDeCobrancasDB,
	quitarCobranca,
};
