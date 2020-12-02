const Router = require('koa-router');

const router = new Router();

const Auth = require('./controllers/auth');
const Clientes = require('./controllers/clientesController');
const Usuarios = require('./controllers/usuariosController');
const Pagamentos = require('./controllers/pagamento');
const Cobrancas = require('./controllers/cobrancaController');

const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/sessions');

router.post('/auth', Auth.autenticar);
router.post('/pagamento', Session.verify, Pagamentos.pagamento);

router.post('/usuarios', Password.encrypt, Usuarios.adicionarUsuario);

router.post('/clientes', Session.verify, Clientes.adicionarCliente);
router.get('/clientes', Session.verify, Clientes.listarTodosClientes);
router.put('/clientes', Session.verify, Clientes.editarCliente);

router.post('/cobrancas', Session.verify, Cobrancas.gerarCobranca);

module.exports = router;

// router.get( '/cobrancas' Session.verify, Corabca.atualizarCobranca);
// router.put('/cobranca', Session.verify, Cobranca.atualizarCobranca);

// router.get('/relatorio', Session.verify, Cobranca.obterRelatorio);
