/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
const database = require('./database');

const schema = {
	1: `CREATE TABLE IF NOT EXISTS users (
    		id SERIAL PRIMARY KEY,
    		email VARCHAR(255) NOT NULL,
			senha VARCHAR(255) NOT NULL,
			nome TEXT NOT NULL,
			deletado BOOL DEFAULT FALSE
	);`,
	2: `CREATE TABLE IF NOT EXISTS clientes (
			id SERIAL PRIMARY KEY,
			nome TEXT NOT NULL,
			cpf VARCHAR(11) NOT NULL,
			email TEXT NOT NULL,
			contato VARCHAR(11),
			usuario_id INT NOT NULL,
			deletado BOOL DEFAULT FALSE,
			cadastrado BOOL DEFAULT FALSE
	);`,
	3: `CREATE TABLE IF NOT EXISTS cobrancas (
			id SERIAL PRIMARY KEY,
			id_do_cliente INT NOT NULL,
			descricao TEXT NOT NULL,
			valor INTEGER NOT NULL,
			vencimento DATE NOT NULL,
			link_do_boleto TEXT,
			codigo_de_barras TEXT NOT NULL,
			data_de_pagamento DATE DEFAULT NULL,
			status VARCHAR(20) NOT NULL,
			deletado BOOL DEFAULT FALSE
	);`,
};

const drop = async (tableName) => {
	if (tableName) {
		await database.query(`DROP TABLE ${tableName}`);
		// eslint-disable-next-line no-template-curly-in-string
		console.log('Tabela ${tableName} dropada!');
	}
};

const up = async (number = null) => {
	if (!number) {
		for (const value in schema) {
			await database.query({ text: schema[value] });
		}
	} else {
		await database.query({ text: schema[number] });
	}
	console.log('Migração rodada!');
};

/**
 * Rode up() ou drop("nomeDaTabela");
 */

up();
// drop('autores');
