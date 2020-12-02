const database = require('../utils/database');

const gerarCobranca = async (boleto) => {
	const {
		id_cliente,
		descricao,
		valor,
		vencimento,
		linkBoleto,
		codigo_boleto,
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
			id_cliente,
			descricao,
			valor,
			vencimento,
			linkBoleto,
			codigo_boleto,
			status,
		],
	};
	const resposta = await database.query(query);
	return resposta.rows.shift();
};

const listarCobrancas = async (idUsuario) => {
	const query = {
		text: `SELECT * 
			FROM cobrancas
			WEHRE id_do_cliente IN (
				SELECT id FROM clientes
					WHERE usuario_id = $1
			);`,
		values: [idUsuario],
	};

	const result = await database.query(query);
	return result.rows;
};

const quitarCobranca = async (cobrancaId) => {
	const query = {
		text: `UPDATE cobrancas
				SET status = pago //talvez criar a tabela com defaul pago false
				WHERE id = $1 RETURNING*;`,
		values: [cobrancaId],
	};
	const response = await database.query(query);
	return response.rows.shift();
};

module.exports = {
	gerarCobranca,
	listarCobrancas,
	quitarCobranca,
};
