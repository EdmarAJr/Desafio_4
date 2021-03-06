/* eslint-disable eqeqeq */
const testarCPF = (strCPF) => {
	let soma = 0;
	let resto = 0;

	const limparCPF = strCPF.replace(/[^\d]/g, '');

	for (let i = 1; i <= 9; i++) {
		soma += limparCPF.substring(i - 1, i) * (11 - i);
		resto = (soma * 10) % 11;
	}
	if (resto == 10 || resto == 11) resto = 0;
	if (resto != limparCPF.substring(9, 10)) return false;

	soma = 0;
	for (let i = 1; i <= 10; i++) {
		soma += limparCPF.substring(i - 1, i) * (12 - i);
		resto = (soma * 10) % 11;
	}
	if (resto == 10 || resto == 11) resto = 0;

	if (resto != limparCPF.substring(10, 11)) return false;
	return true;
};
module.exports = { testarCPF };
