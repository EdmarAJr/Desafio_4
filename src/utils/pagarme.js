/* eslint-disable camelcase */
const axios = require('axios').default;

require('dotenv').config();

const gerarBoleto = async (
	customer,
	amount,
	boleto_expiration_date,
	boleto_instructions
) => {
	try {
		const transaction = await axios.post(
			'https://api.pagar.me/1/transactions/',
			{
				amount,
				payment_method: 'boleto',
				customer,
				api_key: process.env.PAGARME_CHAVE_DE_ACESSO,
				boleto_expiration_date,
				boleto_instructions,
			}
		);
		return transaction.data;
	} catch (err) {
		console.log(err.response.data);
		return {
			status: 'error',
			data: {
				mensagem: 'Erro ao gerar boleto de cobraça',
			},
		};
	}
};

module.exports = { gerarBoleto };
