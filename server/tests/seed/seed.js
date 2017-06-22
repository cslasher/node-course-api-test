const {ObjectID} = require("mongodb")
const jwt = require("jsonwebtoken")

var {Todo} = require("./../../models/todo")
var {User} = require("./../../models/user")

const todos = [{
  _id: new ObjectID(),
  text: 'First todo'
}, {
  _id: new ObjectID(),
  text: 'Second todo',
  completed: true,
  completedAt: 123000
}]

var userOneId = new ObjectID
var userTwoId = new ObjectID

const users = [{
  _id: userOneId,
  email: 'user1@example.com',
  password: 'user1password',
  tokens:[{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'user2@example.com', 
  password: 'user2password'
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