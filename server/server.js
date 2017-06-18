require("./config/config")

const _ = require("lodash")
const express = require("express")
const bodyParser = require("body-parser")

var {ObjectID} = require("mongodb")
var {mongoose} = require("./db/mongoose")
var {Todo} = require("./models/todo")
var {User} = require("./models/user")

var port = process.env.PORT

var app = express()

app.use(bodyParser.json())

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        })
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }
        
        res.status(200).send({todo})
    }, (e) => {
        res.status(400).send()
    })
})

app.delete('/todos/:id', (req, res) => {
   var id = req.params.id

// Invalid ID
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    
    Todo.findByIdAndRemove(id).then((todo) => {
 
        // ID not found
        if (!todo) {
            return res.status(404).send()
        }
        
        res.status(200).send({todo})
    }, (e) => {
        res.status(400).send()
    })
})

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id
    var body = _.pick(req.body, ['text', 'completed'])
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }
    
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        //not found
        if (!todo) {
            return res.status(404).send()
        }
        
        res.send({todo})
    }).catch((e) => {
        res.status(400).send()
    })
})

app.post('/echo', (req, res) => {
    res.send(req.body)
    console.log(JSON.stringify(req.body, null, 2))
})

app.listen(port, () => {
    console.log(`Starting on port: ${port}`)
})

module.exports = {
    app
}
