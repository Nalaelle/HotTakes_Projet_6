const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongodbErrorErrorHandler = require('mongoose-mongodb-errors');

mongoose.plugin(mongodbErrorErrorHandler);
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(mongodbErrorErrorHandler);
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);