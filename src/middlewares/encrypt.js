const response = require('../controllers/response');

const Password = require('../utils/password');

const encrypt = async (ctx, netx) => {
	const { senha = null } = ctx.request.body;

	if (!senha) {
		return response(ctx, 400, { mensagem: 'Pedido mal formatado encrypt' });
	}
	const hash = await Password.encrypt(senha);

	ctx.state.hash = hash;

	return netx();
};

module.exports = { encrypt };
