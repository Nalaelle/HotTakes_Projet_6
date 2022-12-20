const MPValidator = require('password-validator');

const MPShema = new MPValidator();

MPShema
    .is().min(5)
    .is().max(50)
    .has().uppercase()
    .has().lowercase()
    .has().digits(2)
    .has().not().spaces()
    .has().not().oneOf(['Password123']);

module.exports = (req, res, next) => {
    if(MPShema.validate(req.body.password)) {
        next();
    }else{
        return res.status(400).json({ error : `This password is not enough : ${MPShema.validate('req.body.password', { list: true })}` })
    }
}