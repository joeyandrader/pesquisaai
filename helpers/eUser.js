module.exports = {
    isAdmin: function (req, res, next) {
        if (req.isAuthenticated() && req.user.accountType === 1 && req.user.approvedStatus === "approved") {
            return next();
        }

        req.logout(() => {
            req.flash("error_msg", "Acesso Negado!");
            res.redirect('/login');
        });

    },

    isUser: function (req, res, next) {

        if (req.isAuthenticated() && req.user.approvedStatus === "approved") {
            if (req.user.accountType === 1) {
                res.redirect('/admin')
            }
            return next();
        }

        req.logout(() => {
            req.flash("error", 'Você precisa está logado')
            res.redirect('/login')
        });

    }
}