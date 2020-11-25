const jwt = require('jsonwebtoken');
const response = require('./response');
const Usuarios = require('../repositories/usuariosBancoDeDados');
const Password = require('../utils/password');

require('dotenv').config();

const autenticar = async (ctx) => {
	const { email = null, password = null } = ctx.request.body;
	if (!email || !password) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado auth' });
	}

	const usuario = await Usuarios.obterUsuarioPorEmail(email);

	if (usuario) {
		const comparison = await Password.check(password, usuario.senha);
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
