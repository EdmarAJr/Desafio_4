/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const router = require('./src/routes');
const Cors = require('@koa/cors');

const schema = require('./src/utils/database');
require('dotenv').config();

const PORT = process.env.PORT || 8081;

const server = new Koa();

server.use(bodyparser());
server.use(router.routes());

server.listen(PORT, () => {
	console.log(`Servidor rodando na porta ${PORT}!`);
});
