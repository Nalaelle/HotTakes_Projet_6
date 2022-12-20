const rateLimit = require('express-rate-limit');

console.log("Limitation de requete test");
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 2000,
    message: "Too many request from this IP, try later !"
});
console.log("limiter request test ");

module.exports = limiter;