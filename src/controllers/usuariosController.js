const response = require('./response');
const Usuarios = require('../repositories/usuariosBancoDeDados');

const adicionarUsuario = async (ctx) => {
	const { email = null, nome = null } = ctx.request.body;
	const { hash } = ctx.state;
	if (!email || !nome) {
		return response(ctx, 400, {
			message: 'Pedido mal-formatado ao adiconar Usuário controller',
		});
	}

	const existencia = await Usuarios.obterUsuarioPorEmail(email);

	if (existencia) {
		return response(ctx, 400, { message: 'Usuário já existente' });
	}

	const usuario = {
		email,
		senha: hash,
		nome,
	};

	const result = await Usuarios.adicionarUsuario(usuario);
	return response(ctx, 201, result);
};

module.exports = {
	adicionarUsuario,
};

/*const Clientes = require('../repositories/clientesBancoDeDados');*/

/* const obterUsuarios = async (ctx) => {
	const result = await Usuarios.obterUsuarios();
	return response(ctx, 200, result);
};

const obterUsuario = async (ctx) => {
	const { id = null } = ctx.params;
	if (id) {
		const result = await Usuarios.obterUsuario(id);
		if (result) {
			return response(ctx, 200, result);
		}
		return response(ctx, 404, { message: 'usuario não encontrado' });
	}

	return response(ctx, 400, { message: 'Mal formatado' });
}; */


/* const atualizarUsuario = async (ctx) => {
	const { id = null } = ctx.params;
	const { nome, sobrenome, email, senha } = ctx.request.body;

	if (!nome && !sobrenome && !email && !senha) {
		return response(ctx, 400, 'Pedido mal-formatado');
	}

	if (id) {
		const usuarioAtual = await Usuarios.obterUsuario(id);
		if (usuarioAtual) {
			const usuarioAtualizado = {
				...usuarioAtual,
				email: email ? email : usuarioAtual.email,
				senha: senha ? senha : usuarioAtual.senha,
				nome: nome ? nome : usuarioAtual.nome,
			};

			const result = await Usuarios.atualizarUsuario(usuarioAtualizado);
			return response(ctx, 200, result);
		}
		return response(ctx, 404, { message: 'usuario não encontrado' });
	}
	return response(ctx, 404, { message: 'usuario não encontrado' });
}; */

/* const deletarUsuario = async (ctx) => {
	const { id = null } = ctx.params;
	const { estado } = ctx.request.body;

	if (typeof estado !== 'boolean') {
		return response(ctx, 400, { message: 'Pedido mal-formatado' });
	}

	if (id) {
		const usuarioAtual = await Usuarios.obterUsuario(id);
		const clientesUsuario = await Clientes.obterClientesDeUsuario(id);
		if (usuarioAtual) {
			if (estado === true && clientesUsuario.length > 0) {
				return response(ctx, 403, { message: 'Ação proibida' });
			}

			const result = await Usuarios.deletarusuario(id, true);

			return response(ctx, 200, result);
		}
	}

	return response(ctx, 404, { message: 'Usuário não encontrado' });
}; */


