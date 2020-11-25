/**
 * Este arquivo não é utilizado depois de integração com banco de dados.
 */
const usuario = {
	id: 1,
	email: 'trovador@gmail.com',
	senha: '102030',
	nome: 'Edmar',
	deletado: false,
};

const cliente = {
	id: 1,
	nome: 'Jânio Quadros',
	cpf: '11133354377',
	email: 'jango@import.com',
	contato: '71993474214',
	deletado: false,
};

const usuarios = [];
usuarios.push(usuario);

const clientes = [
	{
		nome: 'Jamile Sena',
		email: 'jam@yahool.com',
		cpf: '123456789',
		contato: '7199992188',
		usuario: 2,
	},
];
clientes.push(cliente);

module.exports = { usuarios, clientes };
