const jwt = require('jsonwebtoken');
const response = require('./response');
const Usuarios = require('../repositories/usuariosBancoDeDados');
const Senha = require('../utils/password');

require('dotenv').config();

const autenticar = async (ctx) => {
	const { email = null, senha = null } = ctx.request.body;
	if (!email || !senha) {
		return response(ctx, 400, {
			mensagem: 'Pedido de autenticação mal formatado',
		});
	}

	const usuario = await Usuarios.obterUsuarioPorEmail(email);

	if (usuario) {
		const comparison = await Senha.check(senha, usuario.senha);
		if (comparison) {
			const token = await jwt.sign(
				{ id: usuario.id, email: usuario.email },
				process.env.JWT_SECRET || 'cubosacademy',
				{
					expiresIn: '100d',
				}
			);
			return response(ctx, 200, { token });
		}
	}

	return response(ctx, 200, { mensagem: 'Email ou senha incorretos' });
};

module.exports = { autenticar };
