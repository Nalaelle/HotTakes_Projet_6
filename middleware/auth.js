const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodeToken.userId;
        req.auth = {
            userId: userId
        };
        
    } catch (error) {
        console.log(error)
        res.status(401).json({ error });
    }
    next();
};