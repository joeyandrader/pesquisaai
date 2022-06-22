module.exports = {
    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.accountType === 1) {
            return next();
        }

        req.session.returnTo = req.originalUrl;
        req.flash("error_msg", "Acesso Negado!");
        res.redirect('/');
    },

    isUser: function (req, res, next) {

        if (req.isAuthenticated()) {
            return next();
        }

        req.session.returnTo = req.originalUrl;
        req.flash("error", 'Você precisa está logado')
        res.redirect('/login')
    }
}