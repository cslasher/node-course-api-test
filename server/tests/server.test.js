const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

var {app} = require('./../server')
var {Todo} = require('./../models/todo')
var {User} = require('./../models/user')
var {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('should add a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({
                    text
                }).then((todos) => {
                    expect(todos.length).toBe(1)
                    expect(todos[0].text).toBe(text)
                    done()
                }).catch((e) => done(e))
            })
    })

    it('should not add a new todo with invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))
            })
    })
})

describe('GET /todos', () => {
    it('should return all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    })

    it('should return status 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    })

    it('should return status 404 if id is not valid', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString()
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist()
                    done()
                }).catch((e) => {
                    done(e)
                })
            })
    })

    it('should return status 404 if id is not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID()}`)
            .expect(404)
            .end(done)
    })

    it('should return status 404 if id is not valid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var id = todos[0]._id
        var update = {
            text: 'First todo changed to completed',
            completed: true
        }

        request(app)
            .patch(`/todos/${id}`)
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(update.text)
                expect(res.body.todo.completed).toBe(true)        
                expect(res.body.todo.completedAt).toBeA('number')
            })
            .end(done)
    })

    it('should clear completedAt when todo is changed to not completed', (done) => {
        var id = todos[1]._id
        var update = {
            text: 'Second todo changed to incomplete',
            completed: false
        }

        request(app)
            .patch(`/todos/${id}`)
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(update.text)
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toNotExist()        
            })
            .end(done)
    })
})

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })
  
  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('should add a new user', (done) => {
    var email = 'user3@test.com'
    var password = '123asd@'
    
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist()
        expect(res.body._id).toExist()
        expect(res.body.email).toBe(email)
      })
      .end((err) => {
        if (err) {
          return done(err)
        }
        
        User.findOne({email}).then((user) => {
          expect(user).toExist()
          expect(user.password).toNotBe(password)
          done()
        })
      })
  })
  
  it('should return validation errors if request invalid', (done) => {
    var email = users[0].email
    var password = '123123'
    
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  })
  
  it('should not create user if email duplicated', (done) => {
    var email = 'user2@example.com'
    var password = '123123'
    
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)    
  })
})