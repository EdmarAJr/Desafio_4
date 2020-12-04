const Router = require('koa-router');

const router = new Router();

const Auth = require('./controllers/auth');
const Clientes = require('./controllers/clientesController');
const Usuarios = require('./controllers/usuariosController');
const Cobrancas = require('./controllers/cobrancaController');
const Relatorio = require('./utils/relatorio');

const Password = require('./middlewares/encrypt');
const Session = require('./middlewares/sessions');

router.post('/auth', Auth.autenticar);

router.post('/usuarios', Password.encrypt, Usuarios.criarUsuario);

router.post('/clientes', Session.verify, Clientes.criarCliente);
router.get('/clientes', Session.verify, Clientes.listarTodosClientes);
router.put('/clientes', Session.verify, Clientes.editarCliente);

router.post('/cobrancas', Session.verify, Cobrancas.gerarCobranca);
router.get('/cobrancas', Session.verify, Cobrancas.controleDeCobrancas);
router.put('/cobrancas', Session.verify, Cobrancas.quitarCobranca);
router.get('/relatorio', Session.verify, Relatorio.formatarRelatorio);

module.exports = router;
