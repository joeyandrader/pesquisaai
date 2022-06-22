const User = require('../models/UserModel');
const crypto = require('crypto');

module.exports = {
    async generateCodeJwt(user) {
        usuario = await User.findById(user.id);

        var hash = crypto.createHash('sha256').update(user.name).digest("hex")

        console.log(hash);
    }
}