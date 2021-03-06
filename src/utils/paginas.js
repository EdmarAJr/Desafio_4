/**
 * Essa parte do código não é minha, compreendi em parte como funcionava,
 * mas não tive tive condições para refatorá-lo como gostaria
 */

/**
 * Responsável por calcular a paginanção das listas.
 * @param {Array} lista
 * @param {number} itensPorPagina
 * @param {number} offset
 */
const calcularPaginas = (lista, itensPorPagina, offset) => {
	const paginaAtual = (offset % itensPorPagina) + 1;
	const paginasTotais = Math.ceil(lista.length / itensPorPagina);
	const itensDaPagina = lista.slice(
		offset,
		Number(offset) + Number(itensPorPagina)
	);

	return {
		paginaAtual,
		paginasTotais,
		itensDaPagina,
	};
};

module.exports = calcularPaginas;
