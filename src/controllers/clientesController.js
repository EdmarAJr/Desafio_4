/* eslint-disable dot-notation */
const response = require('./response');
const Clientes = require('../repositories/clientesBancoDeDados');
const TestarCpf = require('../utils/testarCpf');
const Cobrancas = require('../repositories/cobrancaBancoDeDados');
/* Estas duas funções foram o meu gargalo de conhecimento. 
Elas não são minhas. Usei para terminar o desafio */
const Paginas = require('../utils/paginas');
const { formatarClientes } = require('../utils/relatorio');

/**
 * Cria cliente e verifica se o CPF é válido
 */
const criarCliente = async (ctx) => {
	const { body } = ctx.request;

	if (
		!body.nome ||
		!body.cpf ||
		!body.email ||
		!body.contato ||
		!body.idUsuario
	) {
		return response(ctx, 400, {
			message: 'Pedido mal formatado controller cliente',
		});
	}

	/**
	 * Trata e valida o CPF no formato 000.000.000-00 */
	const validarCpf = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;
	if (!TestarCpf.testarCPF(body.cpf)) {
		return response(ctx, 400, { mensagem: 'Cpf inválido' });
	}

	if (!validarCpf.test(body.cpf) || !body.cpf) {
		return response(ctx, 400, {
			mensagem: 'Cpf mal formatado! Exemplo: xxx.xxx.xxx-xx',
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

	const result = await Clientes.criarClienteDB(cliente);

	return response(ctx, 201, result);
};

/**
 *Lista todos clientes a existência por usuário
 */
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
		clients = await Clientes.listarTodosClientesDB(pedido);

		if (!clients.length === 0) {
			return response(ctx, 204, {
				mensagem: 'Clientes inexistentes!',
			});
		}
	} else {
		clients = await Clientes.obterQuandoTiverBuscaDB(pedido);

		if (clients.length === 0) {
			return response(ctx, 204, {
				mensagem: 'Busca por cliente não encontrada',
			});
		}
	}
	const cobrancas = await Cobrancas.controleDeCobrancasDB(userId);
	const paginacao = Paginas(clients, clientesPorPagina, offset);
	const clientesFomatados = formatarClientes(
		paginacao['itensDaPagina'],
		cobrancas
	);

	return response(ctx, 200, {
		paginaAtual: paginacao.paginaAtual,
		totalDePaginas: paginacao.paginasTotais,
		clientes: clientesFomatados,
	});
};

/**
 * Edita clientes mediante a busca
 */
const editarCliente = async (ctx) => {
	const {
		id = null,
		nome = null,
		cpf = null,
		email = null,
		contato = null,
		deletado = false,
	} = ctx.request.body;

	if (id && !nome && !cpf && !email && !contato) {
		return response(ctx, 400, {
			message: 'Pedido para atualizar cliente mal-formatado ',
		});
	}

	if (id) {
		const clienteAtual = await Clientes.obterClientesCadastrados(id);
		if (clienteAtual) {
			const clienteAtualizado = {
				id,
				nome: nome || clienteAtual.nome,
				cpf: cpf || clienteAtual.cpf,
				email: email || clienteAtual.email,
				contato: contato || clienteAtual.contato,
				deletado,
			};
			const result = await Clientes.editarClienteDB(clienteAtualizado);
			return response(ctx, 200, result);
		}
	}

	return response(ctx, 404, {
		message: 'Cliente informado para edição não encontrado',
	});
};

module.exports = {
	criarCliente,
	listarTodosClientes,
	editarCliente,
};
