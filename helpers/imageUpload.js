const multer = require('multer');
const path = require('path');


const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = ""

        if (req.baseUrl.includes("user")) {
            folder = "imgUpload"
        }

        cb(null, `public/img/${folder}`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + String(Math.floor(Math.random() * 10000)) + path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|webp|jpeg|gif)$/)) {
            return cb(new Error("Por favor envie apenas png, jpg, webp, jpeg!"))
        }
        cb(undefined, true)
    },

})

module.exports = { imageUpload }