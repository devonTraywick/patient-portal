const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const{User, Patient} = require('../models')

//Generate tokens
function generateTokens(userId){
    const accessToken = jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn:'15m'} // short-lived access token
    );

    const refreshToken = jwt.sign(
        {id: userId},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: '1h'}
    );

    return {accessToken, refreshToken}
}

//Register
router.post('/register', async (req, res) => {
    try {
        const {email, password, fullName, dateOfBirth, phone, address} = req.body;
        if(!email || !password) return res.status(400).json({message: 'Email and password are required'});

        const existingUser = await User.findOne({where: {email}});
        if(existingUser) return res.status(409).json({message: 'User already exists'});

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({email, passwordHash, fullName});

        let patient;
        if(user.id > 0 || user.id != null){
            patient = await Patient.create({userId: user.id, phone: phone, dateOfBirth: Date(dateOfBirth), address: address});
        }

        const{accessToken, refreshToken} = generateTokens(user.id);
        // Save refresh token into httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        res.json({token: accessToken, user: {id: user.id, email: user.email, fullName: user.fullName}});
    } catch (err) {
        console.error('Register error: ', err);
        res.status(500).json({message: 'Internal server error'});
    }
});

//Login
router.post('/login', async (req, res) => {
    try {
        const {email, password, admin} = req.body;
        if(!email || !password) return res.status(400).json({message: 'Email and password are required'});

        let user
        if(admin){
            user = await User.findOne({where: {email, role: 'admin'}})
        }else{
            user = await User.findOne({where: {email, role: 'patient'}});
        }
        
        if(!user) return res.status(401).json({message: 'Invalid credentials'});

        if(user.role === 'patient'){const patient = await Patient.findOne({where: {userId: user.id}})}

        const ok = await bcrypt.compare(password, user.passwordHash);
        if(!ok) return res.status(401).json({message: 'Invalid credentials'});

        const { accessToken, refreshToken } = generateTokens(user.id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });
        let userJson = admin ? {id: user.id, email: user.email, fullName: user.fullName, password: user.password} :
                                {id: user.id, email: user.email, fullName: user.fullName, password: user.password, patient: patient}
        res.json({token: accessToken, user: userJson});
    } catch (err) {
        console.error('Login error: ', err);
        res.status(500).json({message: 'Internal server error'});
    }
});

router.post('/refresh', async(req, res) => {
    const token = req.cookies.refreshToken;
    if(!token) return res.status(401).json({message: "No refresh token "});

    try{
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            {id: payload.id},
            process.env.JWT_SECRET,
            { expiresIn: '15m'}
        );

        return res.json({ token: newAccessToken });
    }catch(error){
        console.log("Refresh error: ", error);
        return res.status(401).json({message: 'Invalid refresh token'});
    }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  return res.json({ message: "Logged out" });
});

//Login
router.put('/update', async (req, res) => {
    try {
        const {email, oldPassword, newPassword, phone, address} = req.body;
        if(!email || !oldPassword) return res.status(400).json({message: 'Email and password are required'});

        const existingUser = await User.findOne({where: {email}});
        if(existingUser){
            const passMatch = await bcrypt.compare(oldPassword, existingUser.passwordHash);
            if(passMatch && newPassword.length > 0){
                console.log("In password Change")
                existingUser.passwordHash = await bcrypt.hash(newPassword, 10);
                let updates = {passwordHash: existingUser.passwordHash};
                await existingUser.update(updates);
            };

            const patient = await Patient.findOne({where: {userId: existingUser.id}});

            if(patient){
                patient.phone = phone;
                patient.address = address;
                let updates = {phone: patient.phone, address: patient.address};
                await patient.update(updates);
            }

            return res.json({
                message: "Updated Successfully",
                user: {id: existingUser.id, email: existingUser.email, fullName: existingUser.fullName, password: existingUser.password, patient: patient}
            })
        }
    } catch (err) {
        console.error('Update error: ', err);
        res.status(500).json({message: 'Internal server error'});
    }
});

module.exports = router;