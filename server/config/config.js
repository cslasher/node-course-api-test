var env = process.env.NODE_ENV || 'development'
var ip = process.env.IP || '127.0.0.1'

if (env == 'development') {
    process.env.MONGODB_URI = `mongodb://${ip}:27017/TodoApp`
} else if (env == 'test') {
    process.env.MONGODB_URI = `mongodb://${ip}:27017/TodoAppTest`
}