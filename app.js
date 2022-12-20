// importation des packages necessaires
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
require('dotenv').config();

// Recuperation dossiers internes
const userRoutes = require('./routes/user');
const rateLimit = require('./middleware/rateLimit');

const app = express();
console.log("je suis le app en cour de lecture");

// connexion à la base de données
mongoose.connect(process.env.DB_URL)
    .then(() => console.log('connexion à MongoDB réussie !'))
    .catch((err) => console.log(err, 'Connexion à MongoDB échouée !'));


app.use(express.json());
app.use(rateLimit);
app.use(helmet({crossOriginResourcePolicy : false})); // crossOriginResourcePolicy obliger sinon les images disparaissent 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);

module.exports = app;