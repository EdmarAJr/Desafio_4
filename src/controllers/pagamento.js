const pagarme = require('../utils/pagarme');
const Clientes = require('../repositories/usuariosBancoDeDados');
const Boleto = require('../repositories/cobrancaBancoDeDados');
const response = require('./response');

const pagamento = async (ctx) => {
	const {
		value = 100,
		cardHolderName,
		cardCvv,
		cardNumber,
		cardExpiration,
		clientId,
	} = ctx.request.body;
	const { userId } = ctx.state;
	const client = await Clientes.obterClientes(clientId);
	console.log(client);
	if (client && client.deletado === false) {
		if (value >= 100) {
			const transaction = await pagarme.pay(value, {
				card_cvv: cardCvv,
				card_number: cardNumber,
				card_expiration_date: cardExpiration,
				card_holder_name: cardHolderName,
			});

			if (transaction.status === 'error') {
				return response(ctx, 400, 'Ação mal formatada');
			}

			await Clientes.atualizarSaldo(clientId, value);
			await Cartao.salvarCartao({
				client_id: userId,
				first_digits: transaction.card.first_digits,
				last_digits: transaction.card.last_digits,
				card_hash: transaction.card.id,
				brand: transaction.card.brand,
				holder_name: transaction.card.holder_name,
			});

			return response(ctx, 200, { mensagem: 'Transação com sucesso!' });
		}
	}
};

module.exports = { pagamento };
