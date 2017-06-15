var mongoose = require("mongoose")

var ip = process.env.IP

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || `mongodb://${ip}:27017/TodoApp`)

module.exports = {mongoose}