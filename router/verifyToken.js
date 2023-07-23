const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({massage: 'Access Denied'});

    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({massage: 'Invalid token'});

        req.user = decoded;
        console.log(decoded);
        next();
    })
}
