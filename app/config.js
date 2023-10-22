const dotenv = require ('dotenv')
const path = require('path')

dotenv.config()

module.exports = {
    rootPath: path.join(__dirname, '..'),
    secretkey: process.env.SECRET_KEY,
    serviceName: process.env.SERVICE_NAME,
    dbUser : process.env.MONGO_USER,
    dbPass : process.env.MONGO_PASS
}