const response = require('./response');
const Clientes = require('../repositories/clientesBancoDeDados');

const listarTodosClientes = async (ctx) => {
	const { offset = 0, clientesPorPagina, busca = null } = ctx.query;
	const { userId } = ctx.state;

	const pedido = {
		idUsuario: userId,
		busca,
		offset,
		limit: clientesPorPagina,
	};
	let clients;
	if (!busca) {
		clients = await Clientes.obterClientes(pedido);

		if (!clients.length === 0) {
			return response(ctx, 204, {
				mensagem: 'Clientes inexistentes!',
			});
		}
	} else {
		clients = await Clientes.obterUmCliente(pedido);

		if (clients.length === 0) {
			return response(ctx, 204, {
				mensagem: 'Busca por cliente não encontrada',
			});
		}
	}

	const todosClientes = clients.map((clientes) => {
		return {
			nome: clientes.nome,
			email: clientes.email,
			contato: clientes.contato,
		};
	});
	return response(ctx, 200, { clients: [...todosClientes] });
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
			message: 'Pedido mal formatado controller cliente',
		});
	}

	const existencia = await Clientes.verificarExistenciaDeCliente(body.cpf);

	if (existencia) {
		return response(ctx, 400, { message: 'Este cliente já existente' });
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

const editarCliente = async (ctx) => {
	const {
		id = null,
		nome = null,
		email = null,
		cpf = null,
		contato = null,
		deletado = false,
	} = ctx.request.body;

	if (!nome && !email && !cpf && !contato) {
		return response(ctx, 400, {
			message: 'Pedido para atualizar cliente mal-formatado ',
		});
	}

	if (id) {
		const clienteAtual = await Clientes.obterClientes(id);
		if (clienteAtual) {
			//console.log(clienteAtual);
			const clienteAtualizado = {
				id: clienteAtual.id,
				nome: nome || clienteAtual.nome,
				email: email || clienteAtual.email,
				cpf: cpf || clienteAtual.cpf,
				contato: contato || clienteAtual.contato,
				deletado: deletado === true,
			};
			const result = await Clientes.atualizarCliente(clienteAtualizado);
			//console.log(clienteAtualizado) o id está chegando null e sentando undefined;
			return response(ctx, 200, result);
		}
	}

	return response(ctx, 404, {
		message: 'Cliente informado para edição não encontrado',
	});
};

module.exports = {
	adicionarCliente,
	listarTodosClientes,
	editarCliente,
};
