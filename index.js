const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const router = require('./src/routes');
// const Cors = require('@koa/cors');

const schema = require('./src/utils/database');
// require('dotenv').config();
// const PORT = process.env.PORT || 8081;

const server = new Koa();

server.use(bodyparser());
server.use(router.routes());

server.listen(8081, () => console.log('Rodando!'));
// para o final
// server.listen(PORT, () => {
// console.log(`Servidor está rodando na porta ${PORT}!`);
// });
