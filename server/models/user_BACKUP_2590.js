const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => { return validator.isEmail(value)},
            message: '{value} is not a valid email'
        }
    }, 
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        }, 
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.toJSON = function() {
    var user = this
    var userObject = user.toObject()
  
    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function() {
    var user = this
    var access = 'auth'
    var token = jwt.sign({
        _id: user._id.toHexString(), access
    }, 'abc123').toString()
    user.tokens.push({access, token})
  
    return user.save().then(() => {
        return token
    })
}

UserSchema.statics.findByToken = function(token) {
    var User = this
    var decoded
  
    try {
        decoded = jwt.verify(token, 'abc123')
    } catch(e) {
        return Promise.reject()
    }
  
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.pre('save', function(next) {
    var user = this
  
    if (user.isModified('password')) {

<<<<<<< HEAD
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return console.log(err)
      }
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return console.log(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    next()  
  }
=======
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()  
    }
>>>>>>> 30ef8f58f70104ade41c5d8969e7235d525904dc
})

var User = mongoose.model('User', UserSchema)
module.exports = {User}