const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const cryptoJs = require('crypto-js');


exports.signup = (req, res, next) => {
    const cryptEmail = cryptoJs.HmacSHA256(req.body.email, `${process.env.CRYPT_KEY}`).toString();
  
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: cryptEmail,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    const cryptEmail = cryptoJs.HmacSHA256(req.body.email, `${process.env.CRYPT_KEY}`).toString();
  
    User.findOne({ email: cryptEmail })
        .then(user => {
            if (user === null) {
                res.status(401).json({ message: 'Paire id/mp incorrecte' });
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire id/mp incorrecte' });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.SECRET_TOKEN,
                                    { expiresIn: '24h'}
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};