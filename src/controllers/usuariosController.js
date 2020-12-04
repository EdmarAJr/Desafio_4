const response = require('./response');
const Usuarios = require('../repositories/usuariosBancoDeDados');
/**
 * Insere infomações sobre um usuário na tabela usuarios no banco dados.
 */
const criarUsuario = async (ctx) => {
	const { email = null, nome = null } = ctx.request.body;
	const { hash } = ctx.state;
	if (!email || !nome) {
		return response(ctx, 400, {
			message: 'Pedido mal-formatado ao adiconar Usuário controller',
		});
	}

	const existencia = await Usuarios.buscarUsuarioPorEmail(email);

	if (existencia) {
		return response(ctx, 400, { message: 'Usuário já existente' });
	}

	const usuario = {
		email,
		senha: hash,
		nome,
	};

	const result = await Usuarios.criarUsuarioDB(usuario);
	return response(ctx, 201, result);
};

module.exports = { criarUsuario };
