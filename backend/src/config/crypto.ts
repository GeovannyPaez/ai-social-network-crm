require("../bootstrap")

module.exports = {
    secret: process.env.CRYPTO_SECRET || "secret",
    algorithm: process.env.CRYPTO_ALGORITHM,
    iv: process.env
}