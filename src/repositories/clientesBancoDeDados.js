/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const database = require('../utils/database');

/**
 * Insere infomações sobre um cliente na tabela clientes no banco dados.
 */
const criarClienteDB = async (cliente) => {
	const { nome, cpf, email, contato, idUsuario } = cliente;
	const query = {
		text: `INSERT INTO clientes (
			nome, 
			cpf, 
			email, 
			contato, 
			usuario_id
		) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
		values: [nome, cpf, email, contato, idUsuario],
	};

	const result = await database.query(query);

	return result.rows.shift();
};

/**
 * Edita infomações sobre um cliente específico na tabela clientes no banco dados.
 */
const editarClienteDB = async (cliente) => {
	const { nome, cpf, email, contato, id } = cliente;
	const query = {
		text: `UPDATE clientes 
				SET nome = $1, 
					cpf = $2, 
					email = $3, 
					contato = $4 
				WHERE id = $5 RETURNING *`,
		values: [nome, cpf, email, contato, id],
	};

	const result = await database.query(query);

	return result.rows.shift();
};

/**
 * Busca infomações sobre um cliente específico na tabela clientes no banco dados.
 */
const obterCliente = async (campo, valor, id_user) => {
	if (!campo) {
		return null;
	}

	const query = {
		text: `SELECT * 
			FROM clientes 
			WHERE ${campo} = $1 
				AND usuario_id = $2 
				AND deletado = FALSE`,
		values: [valor, id_user],
	};
	const result = await database.query(query);
	return result.rows.shift();
};

/**
 * Lista infomações sobre todos clientes de um usuário na tabela clientes no banco dados.
 */
const listarTodosClientesDB = async (
	pedido,
	idCobranca,
	idCliente,
	usuarioId
) => {
	const { idUsuario, clientesPorPagina = 10, offset } = pedido;
	const query = `SELECT * 
					FROM clientes 
					WHERE deletado = false
						AND usuario_id = $1 
					LIMIT $2
					OFFSET $3`;
	const result = await database.query({
		text: query,
		values: [idUsuario, clientesPorPagina, offset],
	});

	return result.rows;
};

/**
 * Busca infomações sobre um cliente específico na tabela clientes no banco dados.
 */
const obterQuandoTiverBuscaDB = async (pedido) => {
	const { idUsuario, busca, clientesPorPagina = 10, offset } = pedido;
	if (!pedido) {
		return null;
	}
	const query = `SELECT * 
					FROM clientes 
					WHERE deletado = false 
						AND usuario_id = $1 
						AND (nome ILIKE $2 
							OR email ILIKE $2
							OR cpf LIKE $2) 
					LIMIT $3 
					OFFSET $4`;
	const result = await database.query({
		text: query,
		values: [idUsuario, `%${busca}%`, clientesPorPagina, offset],
	});

	return result.rows;
};

/**
 * Verificar se existem infomações sobre um cliente na tabela clientes no banco dados.
 */
const verificarExistenciaDeCliente = async (cpf = null) => {
	if (!cpf) {
		return null;
	}

	const query = `SELECT * 
					FROM clientes 
					WHERE cpf = $1 AND deletado = false`;
	const result = await database.query({
		text: query,
		values: [cpf],
	});

	return result.rows.shift();
};

/**
 * Busca por infomações sobre um cliente cadastado na tabela clientes no banco dados.
 */
const obterClientesCadastrados = async (id) => {
	const query = `SELECT * 
					FROM clientes 
					WHERE id = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows;
};

module.exports = {
	criarClienteDB,
	editarClienteDB,
	obterCliente,
	listarTodosClientesDB,
	obterQuandoTiverBuscaDB,
	verificarExistenciaDeCliente,
	obterClientesCadastrados,
};
