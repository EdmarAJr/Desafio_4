const testarCPF = async (strCPF) => {
	let soma = 0;
	let resto;

	if (strCPF === '00000000000') return false;

	for (let i = 1; i <= 9; i++)
		soma += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
	resto = (soma * 10) % 11;

	if (resto === 10 || resto == 11) resto = 0;
	if (resto !== parseInt(strCPF.substring(9, 10))) return false;

	soma = 0;
	for (let i = 1; i <= 10; i++)
		// eslint-disable-next-line radix
		soma += parseInt(strCPF.substring(i - 1, i)) * (12 - i);
	resto = (soma * 10) % 11;

	if (resto === 10 || resto == 11) resto = 0;
	// eslint-disable-next-line radix
	if (resto !== parseInt(strCPF.substring(10, 11))) return false;
	return true;
};
module.exports = { testarCPF };
