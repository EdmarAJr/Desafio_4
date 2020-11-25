const database = require('../utils/database');

const adicionarCliente = async (cliente) => {
	const { nome, email, cpf, contato, usuario } = cliente;
	const query = {
		text: `INSERT INTO clientes (
			nome, 
			email, 
			cpf, 
			contato, 
			usuario_id
		) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
		values: [nome, email, cpf, contato, usuario],
	};

	const result = await database.query(query);

	return result.rows.shift();
};

/* const deletarCliente = async (id, estado) => {
	if (!estado) {
		return null;
	}

	const query = `UPDATE clientes SET deletado = $1 WHERE id = $2 RETURNING *`;
	const result = await database.query({
		text: query,
		values: [estado, id],
	});

	return result.rows.shift();
}; */

const atualizarCliente = async (cliente) => {
	const { id, nome, email, cpf, contato, cadastrado } = cliente;
	const query = {
		text: `UPDATE clientes 
			SET nome = $1, 
			email = $2, 
			cpf = $3, 
			contato = $4, 
			cadastrado = $5 
				WHERE id = $6 RETURNING *`,
		values: [nome, email, cpf, contato, cadastrado, id],
	};

	const result = await database.query(query);

	return result.rows.shift();
};

const obterCliente = async (pedido = null) => {
	const { id_usuario, busca, limit, offset } = pedido;
	if (!pedido) {
		return null;
	}

	const query = `SELECT * FROM clientes WHERE deletado = false AND (nome ILIKE = %$2% OR email LIKE %$2% OR cpf LIKE %$2%) LIMIT $3 OFFSET $4`;
	const result = await database.query({
		text: query,
		values: [pedido],
	});

	return result.rows.shift();
};

const obterClientes = async (pedido) => {
	const { idUsuario, offset, limit = 10 } = pedido;

	const query = `SELECT * 
		FROM clientes 
			WHERE deletado = false
				AND usuario_id = $1 
			LIMIT $2
			OFFSET $3`;
	const result = await database.query({
		text: query,
		values: [idUsuario, limit, offset],
	});

	return result.rows;
};

const obterClientesDeUsuario = async (id = null) => {
	if (!id) {
		return null;
	}

	const query = `SELECT * FROM clientes WHERE usuario_id = $1 AND deletado = false`;
	const result = await database.query({
		text: query,
		values: [id],
	});
	return result.rows.shift();
};

const verificarExistenciaDeCliente = async (cpf = null) => {
	if (!cpf) {
		return null;
	}

	const query = `SELECT * FROM clientes WHERE cpf = $1 AND deletado = false`;
	const result = await database.query({
		text: query,
		values: [cpf],
	});

	return result.rows.shift();
};

const obterClientesCadastrados = async (cadastrado = true) => {
	const query = `SELECT * FROM clientes WHERE deletado = false AND cadastrado = $1`;
	const result = await database.query({
		text: query,
		values: [cadastrado],
	});
	return result.rows;
};

module.exports = {
	adicionarCliente,
	obterClientes,
	verificarExistenciaDeCliente,
	atualizarCliente,
	obterClientesDeUsuario,
	obterClientesCadastrados,
};


// deletarCliente,
