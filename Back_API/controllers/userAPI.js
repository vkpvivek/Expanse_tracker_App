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


exports.userLogin= async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    const obj= await User.findAll({
        where:{
            email:email
        }
    });


    // if(obj.length>0){
    //     //check if password matches
    //     const pass=obj[0].password;
    //     if(password==pass){
    //         console.log("login successfully");
    //     }else{
    //         console.log("password didn't match");
    //     }
    // }
    // else   //if user doesn't exist
    // {
    //     console.log("User Not Found");
    // }

    
    res.status(201).json({
        newUserDetails:obj
    });
};


// exports.getUser= async (req,res,next)=>{
//     const users= await User.findAll();

//     res.status(201).json({
//         newUserDetails:users
//     });
// };


