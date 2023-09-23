const express=require('express');
const User=require('../models/user');


exports.postUser= async (req,res,next)=>{
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;

    const data= await User.create({
        username:username,
        email:email,
        password:password
    });

    res.status(201).json({
        newUserDetails:data
    });
};


// exports.getUser= async (req,res,next)=>{
//     const users= await User.findAll();

//     res.status(201).json({
//         newUserDetails:users
//     });
// };


