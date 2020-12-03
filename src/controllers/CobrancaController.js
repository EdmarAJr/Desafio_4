const response = require('./response');
const Clientes = require('../repositories/clientesBancoDeDados');
const Cobrancas = require('../repositories/cobrancaBancoDeDados');
const Pagarme = require('../utils/pagarme');
const TestarCpf = require('../utils/testarCpf');

const gerarCobranca = async (ctx) => {
	const usuarioId = ctx.state.userId;

	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
		vencimento = null,
	} = ctx.request.body;

	if (!idDoCliente || !descricao || !valor || !vencimento) {
		return response(ctx, 400, {
			mensagem: 'Pedido de criação de cobrança mal formatado',
		});
	}
	/**
	 * Trata e valida o valor do amount */
	if (Number.isNaN(valor) || valor < 100) {
		return response(ctx, 400, { mensagem: 'Valor inválido' });
	}
	/**
	 * Trata e valida a data de vencimento */
	const validarData = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/;
	if (
		!validarData.test(vencimento) ||
		Number.isNaN(new Date(vencimento).getTime()) ||
		new Date().getTime() > new Date(vencimento).getTime()
	) {
		return response(ctx, 400, { mensagem: 'Data incorreta' });
	}

	const client = await Clientes.obterCliente('id', idDoCliente, usuarioId);

	if (!client) {
		return response(ctx, 400, { mensagem: 'Cliente sem registro' });
	}
	/**
	 * Trata e valida o CPF no formato 000.000.000-00 */
	const validarCpf = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/;
	if (!TestarCpf.testarCPF(client.cpf)) {
		return response(ctx, 400, { mensagem: 'Cpf inválido' });
	}

	if (!validarCpf.test(client.cpf) || !client.cpf) {
		return response(ctx, 400, {
			mensagem: 'Cpf mal formatado! Exemplo: xxx.xxx.xxx-xx',
		});
	}

	const customer = {
		type: 'individual',
		country: 'br',
		name: client.nome,
		email: client.email,
		external_id: String(client.id),
		documents: [
			{
				type: 'cpf',
				number: `${client.cpf}`,
			},
		],
	};
	const boletoPagarme = await Pagarme.gerarBoleto(
		valor,
		customer,
		vencimento
	);

	const boleto = {
		idCliente: boletoPagarme.customer.external_id,
		descricao,
		valor: boletoPagarme.amount,
		vencimento: boletoPagarme.boleto_expiration_date,
		linkBoleto: boletoPagarme.boleto_url,
		codigoBoleto: boletoPagarme.boleto_barcode,
		status: boletoPagarme.status,
	};

	const respostaBancoDeDados = await Cobrancas.gerarCobranca(boleto);

	const cobranca = {
		idDoCliente: respostaBancoDeDados.id_do_cliente,
		descricao: respostaBancoDeDados.descricao,
		valor: respostaBancoDeDados.valor,
		vencimento: respostaBancoDeDados.vencimento,
		linkDoBoleto: respostaBancoDeDados.link_do_boleto,
		status: respostaBancoDeDados.status,
	};
	return response(ctx, 201, { cobranca });
};
/*const controleDeCobrancas = async (ctx) => {
	const { cobrancasPorPagina = 10, offset = 0 } = ctx.query;
	const { userId } = ctx.state;

	const todasAscobrancas = await Cobrancas.controleDeCobrancasDB(userId);
	// const paginacao = calcularPaginas(
	// 	todasAscobrancas,
	// 	cobrancasPorPagina,
	// 	offset
	// );

	const boletosResposta = formatacaoRelatorios.formatarCobranca(
		paginacao['itensDaPagina']
	);

	const resposta = {
		paginaAtual: paginacao['paginaAtual'],
		totalDePaginas: paginacao['paginasTotais'],
		cobrancas: boletosResposta,
	};
	return response(ctx, 200, resposta);
};*/

const quitarCobranca = async (ctx) => {
	const { userId } = ctx.state;
	const { idDaCobranca } = ctx.request.body;

	if (!idDaCobranca || !typeof Number) {
		return response(ctx, 400, { mensagem: 'Formato da id inválido' });
	}
	const cobrancasPorUsuario = await Cobrancas.controleDeCobrancasDB(userId);
	const cobrancasUsuario = cobrancasPorUsuario.find(
		(cobrancas) => cobrancas.id === idDaCobranca
	);
	if (!cobrancasUsuario) {
		return response(ctx, 403, { mensagem: 'Id do usuário ausente' });
	}

	const cobranca = await Cobrancas.controleDeCobrancasDB(idDaCobranca); // um usuário está pegando a cobrança do outro

	if (!cobranca) {
		return response(ctx, 404, { mensagem: 'Cobrança não encontrada' });
	}

	if (cobranca.pago) {
		return response(ctx, 400, { mensagem: 'Boleto pago!' });
	}

	if (new Date().getTime() > new Date(cobranca.vencimento).getTime()) {
		return response(ctx, 400, { mensagem: 'Boleto vencido!' });
	}

	const cobrancaPaga = await Cobrancas.quitarCobranca(idDaCobranca);

	if (!cobrancaPaga) {
		return response(ctx, 404, {
			mensgem: 'Não foi possível localiza esta cobrança',
		});
	}
	return response(ctx, 200, { mensagem: 'cobrança paga com sucesso' });
};

module.exports = { gerarCobranca, controleDeCobrancas, quitarCobranca };
