const database = require('../utils/database');

const criarUsuarioDB = async (usuarios) => {
	const { nome, email, senha } = usuarios;
	const query = {
		text: `INSERT INTO usuarios (
			email, 
			senha,
			nome
		) VALUES ($1, $2, $3) RETURNING *;`,
		values: [email, senha, nome],
	};
	const result = await database.query(query);

	return result.rows.shift();
};

/* const deletarUsuario = async (estado) => {
	if (!estado) {
		return null;
	}

	const query = `UPDATE usuarios SET deletado = $1 WHERE id = $2 RETURNING *`;
	const result = await database.query({
		text: query,
		values: [estado],
	});

	return result.rows.shift();
}; */

/* const atualizarUsuario = async (usuario) => {
	const { email, senha } = usuario;
	const query = {
		text: `UPDATE usuarios SET email = $1,
		senha = $2, WHERE id = $3
		RETURNING *`,
		values: [senha, email],
	};

	const result = await database.query(query);

	return result.rows.shift();
}; */

/* const obterUsuario = async (id = null) => {
	if (!id) {
		return null;
	}

	const query = `SELECT * FROM usuarios WHERE id = $1`;
	const result = await database.query({
		text: query,
		values: [id],
	});

	return result.rows.shift();
}; */

const buscarUsuarioPorEmail = async (email = null) => {
	if (!email) {
		return null;
	}

	const query = `SELECT * FROM usuarios WHERE email = $1 AND deletado = false`;
	const result = await database.query({
		text: query,
		values: [email],
	});

	return result.rows.shift();
};

/* const obterUsuarios = async (deletado = false) => {
	const query = `SELECT * FROM usuarios WHERE deletado = $1;`;
	const result = await database.query({
		text: query,
		values: [deletado],
	});

	return result.rows;
}; */

module.exports = {
	criarUsuarioDB,
	buscarUsuarioPorEmail,
};
/* deletarUsuario,
	atualizarUsuario,
	obterUsuario,
	obterUsuarios, */
