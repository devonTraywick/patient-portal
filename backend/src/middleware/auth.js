const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function authMiddleware(req, res, next){
    const auth = req.headers.authorization;
    if(!auth) return res.status(401).json({message: 'No token provided'});

    const token = auth.split(' ')[1];
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(payload.id);
        if(!user) return res.status(401).json({message: 'User not found'});
        req.user = {id: user.id, email: user.email, fullName: user.fullName, role: user.role};
        next();
    }catch(err){
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({message: 'Access token expired'});
        }
        console.error('Auth middleware error:', err.message);
        return res.status(401).json({message: 'Invalid or expired token'});
    }
}