const response = require('./response');
const Clientes = require('../repositories/clientesBancoDeDados');
// eslint-disable-next-line no-unused-vars
//const { usuarios, clientes } = require('./base');

const buscarTodosClientes = async (ctx) => {
	const { offset = 0, limit = 10 } = ctx.params;
	const { userId } = ctx.state;

	const pedido = { idUsuario: userId, offset, limit };
	const clients = await Clientes.obterClientes(pedido);
	if (!clients) {
		return response(ctx, 404, {
			mensagem: 'não existe',
		});
	}
	const todosClientes = clients.map((clientes) => {
		return {
			nome: Clientes.nome,
			email: Clientes.email,
			contato: Clientes.contato,
		};
	});
	return response(ctx, 201, { todosClientes });
};

const obterClientes = async (ctx) => {
	const { id_usuario: idUsuario = null, cadastrado = true } = ctx.request.body;
	if (idUsuario) {
		const clientesDeUsuario = await Clientes.obterClientesDeUsuario(
			idUsuario
		);

		if (clientesDeUsuario.length >= 1) {
			return response(ctx, 200, clientesDeUsuario);
		}
		return response(ctx, 404, { message: 'Não Encontrado' });
	}
	const estaCadastrado = cadastrado === 'true';
	const cadastrados = await Clientes.obterClientesCadastrados(estaCadastrado);
	//console.log(ctx);
console.log(ctx.headers);
	return response(ctx, 200, cadastrados);
};

const obterCliente = (ctx) => {
	const { id = null } = ctx.params;
	if (id) {
		const clienteAtual = clientes[id - 1];
		if (clienteAtual) {
			return response(ctx, 200, clienteAtual);
		}

		return response(ctx, 404, { message: 'Cliente não encontrado' });
	}
	return response(ctx, 400, { message: 'Mal formatado obter cliente' });
};

const adicionarCliente = async (ctx) => {
	const { body } = ctx.request;

	if (
		!body.nome ||
		!body.email ||
		!body.cpf ||
		!body.contato ||
		!body.idUsuario
	) {
		return response(ctx, 400, {
			message: 'Pedido mal-formatado controller cliente',
		});
	}

	const existencia = await Clientes.verificarExistenciaDeCliente(body.cpf);

	if (existencia) {
		return response(ctx, 400, { message: 'Cliente já existente' });
	}

	const cliente = {
		nome: body.nome,
		cpf: body.cpf,
		email: body.email,
		contato: body.contato,
		idUsuario: body.idUsuario,
	};

	const result = await Clientes.adicionarCliente(cliente);

	return response(ctx, 201, result);
};

const atualizarCliente = async (ctx) => {
	const { id = null } = ctx.params;
	const {
		nome = null,
		email = null,
		cpf = null,
		contato = null,
		deletado = false,
	} = ctx.request.body;

	if (!nome && !email && !cpf && !contato) {
		return response(ctx, 400, { message: 'Pedido mal-formatado' });
	}

	if (id) {
		const clienteAtual = await Clientes.obterClient(id);
		if (clienteAtual) {
			const clienteAtualizado = {
				id: clienteAtual.id,
				nome: nome || clienteAtual.nome,
				email: email || clienteAtual.email,
				cpf: cpf || clienteAtual.cpf,
				contato: contato || clienteAtual.contato,
				deletado: deletado === false,
			};

			const result = await Clientes.atualizarCliente(clienteAtualizado);
			return response(ctx, 200, result);
		}
	}

	return response(ctx, 404, { message: 'Cliente não encontrado' });
};

module.exports = {
	obterClientes,
	obterCliente,
	adicionarCliente,
	atualizarCliente,
	buscarTodosClientes,
};
