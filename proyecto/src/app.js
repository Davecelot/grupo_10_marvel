const express = require('express');
const path = require('node:path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const sessionOptions = require('./security/sessionOptions');
const { csrfToken } = require('./middlewares/csrf');
const app = express();

app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', process.env.TRUST_PROXY.split(',').map(value => value.trim()));
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});
app.get('/js/vendor/validator.min.js', (req, res) => res.sendFile(require.resolve('validator/validator.min.js')));
app.use(express.static(path.resolve(__dirname, '../public')));
app.use(session(sessionOptions()));
app.use(cookieParser());
app.use(require('./middlewares/rememberUserMiddleware'));
app.use(express.urlencoded({ extended: false, limit: '32kb', parameterLimit: 50 }));
app.use(methodOverride('_method'));
app.use(csrfToken);
app.use((req, res, next) => {
  res.locals.myUser = req.session.Usuario;
  next();
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', require('./routes/main'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api/api'));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const status = error.code === 'LIMIT_FILE_SIZE' ? 413 :
    error.name === 'MulterError' ? 400 :
    Number.isInteger(error.status) && error.status >= 400 && error.status < 500 ? error.status : 500;
  res.status(status).send(status === 500 ? 'Error interno del servidor.' : 'Solicitud inválida.');
});

if (require.main === module) {
  const port = Number(process.env.PORT || 3001);
  app.listen(port, () => console.log(`Aplicación levantada en el puerto ${port}`));
}
module.exports = app;
