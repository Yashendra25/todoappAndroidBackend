const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const user_jwt = require('../middleware/user_jwt');
const jwt = require('jsonwebtoken');

router.get('/', user_jwt, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.log(error.msg);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
        next();
    }


});

router.post('/register', async(req, res,next) => {
    
    
    const {username,email,password}=req.body;
    try {
        let user_exist=await User.findOne({email:email});
        if(user_exist){
            return res.json(
                {
                    success:false,
                    msg:'User already exist'
                });
        }

        let user=new User();
        user.username=username;
        user.email=email;

        const salt=await bcryptjs.genSalt(10);
        user.password=await bcryptjs.hash(password,salt);

        let size=200;
        user.avatar=`https://gravatar.com/avatar/?s=${size}&d=retro`;

        await user.save();

        const payload={
            user:{
                id:user.id
            }
        }
    jwt.sign(payload,process.env.jwtUserSecret,
        {expiresIn:360000},(err,token)=>{
        if(err) throw err;
        res.status(200).json({
            success:true,
            token:token,
            msg:'User registered successfully',
            user:user
        });
    });


    } catch (error) {
        console.log(error);
    }
});


router.post('/login', async(req, res,next) => {
    const email=req.body.email;
    const password=req.body.password;

    try{
        let user=await User.findOne({email:email});
        if(!user){
            return res.status(400).json({
                success:false,
                msg:'User not found register to continue'
            });
        }
        const isMatch=await bcryptjs.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                msg:'Invalid Credentials'
            });
        }
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,process.env.jwtUserSecret,{expiresIn:360000},(err,token)=>{
            if(err) throw err;
            res.status(200).json({
                success:true,
                token:token,
                msg:'User logged in successfully',
                user:user
            });
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            msg:'Internal Error'
        });
    }
});
module.exports = router;
