const axios = require('axios').default;

require('dotenv').config();

const pay = async (amount, boleto) => {
	try {
		const transaction = await axios.post(
			'https://api.pagar.me/1/transactions/',
			{
				amount,
				...boleto,
				payment_method: 'boleto',
				api_key: process.env.PAGARME_KEY,
				postback_url: 'http://requestb.in/pkt7pgpk',
				customer: {
					type: 'individual',
					country: 'br',
					name: 'Aardvark Silva',
					documents: [
						{
							type: 'cpf',
							number: '00000000000',
						},
					],
				},
			}
		);
		return transaction.data;
	} catch (err) {
		console.log(err.response.data);
		return {
			status: 'error',
			data: {
				mensagem: 'Erro no Pagamento',
			},
		};
	}
};

module.exports = { pay };
