const {ObjectID} = require("mongodb")
const jwt = require("jsonwebtoken")

var {Todo} = require("./../../models/todo")
var {User} = require("./../../models/user")

var userOneId = new ObjectID
var userTwoId = new ObjectID

const users = [{
  _id: userOneId,
  email: 'user1@example.com',
  password: 'user1password',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: userTwoId,
  email: 'user2@example.com', 
  password: 'user2password',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const todos = [{
  _id: new ObjectID(),
  text: 'First todo',
  _creator: userOneId
}, {
  _id: new ObjectID(),
  text: 'Second todo',
  completed: true,
  completedAt: 123000,
  _creator: userTwoId
}]

var populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => {
    done()
  })
}

var populateUsers = (done) => {
  User.remove({}).then(() => {
    var user1 = new User(users[0]).save()
    var user2 = new User(users[1]).save()
    
    return Promise.all([user1, user2])
  }).then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers}