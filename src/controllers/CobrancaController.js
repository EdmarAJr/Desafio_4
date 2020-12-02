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
console.log(client.cpf);
//rescrever o teste de cpf
	/**
	 * Trata e valida o CPF no formato 000.000.000-00 */
	// const validarCpf = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}$/;
	// if (!TestarCpf.testarCPF(client.cpf)) {
	// 	return response(ctx, 400, { mensagem: 'Cpf inválido' });
	// } if (!validarCpf.test(client.cpf) || !client.cpf) {
	// 	return response(ctx, 400, {
	// 		mensagem: 'Cpf mal formatado! Exemplo: xxx.xxx.xxx-xx',
	// 	});
	// }

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
		id_cliente: boletoPagarme.customer.external_id,
		descricao: 'cobrança feita',
		valor: boletoPagarme.amount,
		vencimento: boletoPagarme.boleto_expiration_date,
		link_do_boleto: boletoPagarme.boleto_url,
		codigo_boleto: boletoPagarme.boleto_barcode,
		status: boletoPagarme.status,
	};
	const respostaBancoDeDados = await Cobrancas.gerarCobranca(boleto);

	const cobranca = {
		idDoCliente: respostaBancoDeDados.id_do_Cliente,
		descricao: respostaBancoDeDados.descricao,
		vencimento: respostaBancoDeDados.vencimento,
		linkBoleto: respostaBancoDeDados.link_do_boleto,
		status: respostaBancoDeDados.status,
	};
	return response(ctx, 201, { cobranca });
};

module.exports = { gerarCobranca };
