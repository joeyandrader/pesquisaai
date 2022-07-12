const express = require('express');
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require("./config/auth")(passport);
app.use(cors()); // Use Cors


//Express Session
app.use(session({
    secret: '6f965a23bae6f19fcf84626f5d828649',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000  //24hrs
    }
}))


//Passport signIn
app.use(passport.initialize());
app.use(passport.session());

//Flash Msg
app.use(flash());

app.use((req, res, next) => {
    // Comando 'locals' para criar variaveis globais
    res.locals.error = req.flash('error');
    res.locals.error_alert = req.flash('error_alert');
    res.locals.user = req.user || null;
    res.locals.adminUser = req.user || null;
    // Comando 'next();' para permitir que as rotas avancem apos passarem no mdidleware
    next();
});


app.set('view engine', 'ejs'); // Set Engine

//Express Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
//public folder
app.use(express.static('public'));

//Routes
const userRouter = require('./Routes/userRouter');
const indexRouter = require('./Routes/indexRouter');
const AdminRouter = require('./Routes/AdminRouter');

app.use('/', indexRouter);
app.use('/account', userRouter);
app.use('/admin', AdminRouter);



//404 page not found
app.use(function (req, res, next) {
    res.status(404);
    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }
});




app.use((req, res, next) => {
    res.set('X-Powered-By', 'Undefined');
    next();
});
app.disable('x-powered-by')


//Port Server Listen
app.listen(port, () => {
    console.log(`Servidor Online na porta ${port}`)
})



