const mongoose = require('mongoose');
const mongodbErrorErrorHandler = require('mongoose-mongodb-errors');

mongoose.plugin(mongodbErrorErrorHandler);
const sauceSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    name: {
        type: String, 
        required: true,
        minlength: [3, "Ce champ nécessite au moins 3 caractères"],
        maxlength: [50, "Ce champ permet seulement 50 caractères"],
    },
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, required: true, default: 0},
    dislikes: {type: Number, required: true, default: 0},
    usersLiked: [{type: String}],
    usersDisliked: [{type: String}]
});

sauceSchema.plugin(mongodbErrorErrorHandler);

module.exports = mongoose.model('Sauce', sauceSchema);