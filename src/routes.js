const Router = require('koa-router');

const router = new Router();

const Auth = require('./controllers/auth');
const Clientes = require('./controllers/clientesController');
const Usuarios = require('./controllers/usuariosController');
const Pagamentos = require('./controllers/pagamento');
//const Cobrancas = require('./controllers/CobrancaController');

const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/sessions');

router.post('/auth', Auth.autenticar);
router.post('/pagamento', Session.verify, Pagamentos.pagamento);

router.post('/usuarios', Password.encrypt, Usuarios.adicionarUsuario);

router.post('/clientes', Session.verify, Clientes.adicionarCliente);
router.get('/clientes', Session.verify, Clientes.buscarTodosClientes);

router.put('/clientes/id', Session.verify, Clientes.atualizarCliente);

module.exports = router;



// router.get(
// 	'/clientes?clientesPorPagina=10&offset=20',
// 	Session.verify,
// 	Clientes.obterClientes
// );
// router.get(
// 	'/clientes?busca=texto da busca&clientesPorPagina=10&offset=20',
// 	Session.verify,
// 	Clientes.obterCliente
// );

// router.post('/cobrancas', Session.verify, Cobranca.adicionarCobranca);
// router.get(
// 	'/cobrancas?cobrancasPorPagina=10&offset=20',
// 	Session.verify,
// 	Cobranca.listarCobranca
// );
// router.put('/cobranca', Session.verify, Cobranca.atualizarCobranca);
// router.get('/relatorio', Session.verify, Cobranca.obterRelatorio);

