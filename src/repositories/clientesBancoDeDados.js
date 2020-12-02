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

	const query = `UPDATE clientes 
					SET deletado = $1 
					WHERE id = $2 RETURNING *`;
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
const obterCliente = async (campo, valor, id_user) => {
	if (!campo) {
		return null;
	}

	const query = {
		text: `SELECT * FROM clientes WHERE ${campo} = $1 AND usuario_id = $2 AND deletado = FALSE`,
		values: [valor, id_user],
	};
	const result = await database.query(query);
	return result.rows.shift();
};

const obterClientes = async (pedido, idCobranca, idCliente, usuarioId) => {
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

const obterUmCliente = async (pedido) => {
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

const obterClientesDeUsuario = async (id = null) => {
	if (!id) {
		return null;
	}

	const query = `SELECT * 
					FROM clientes 
					WHERE usuario_id = $1 
						AND deletado = false`;
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

	const query = `SELECT * 
					FROM clientes 
					WHERE cpf = $1 AND deletado = false`;
	const result = await database.query({
		text: query,
		values: [cpf],
	});

	return result.rows.shift();
};

const obterClientesCadastrados = async (cadastrado = true) => {
	const query = `SELECT * 
					FROM clientes 
					WHERE deletado = false 
						AND cadastrado = $1`;
	const result = await database.query({
		text: query,
		values: [cadastrado],
	});
	return result.rows;
};

module.exports = {
	adicionarCliente,
	obterCliente,
	obterClientes,
	obterUmCliente,
	verificarExistenciaDeCliente,
	atualizarCliente,
	obterClientesDeUsuario,
	obterClientesCadastrados,
};

// deletarCliente,
