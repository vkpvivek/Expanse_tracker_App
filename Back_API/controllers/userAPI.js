const express=require('express');
const User=require('../models/user');
const bcrypt=require('bcrypt');


exports.postUser= async (req,res,next)=>{
    const username=req.body.username;
    const email=req.body.email;
    const password=req.body.password;


    const saltrounds=5;
    bcrypt.hash(password, saltrounds, async (err ,hash)=>{
        console.log(err)

        const data= await  User.create({ username, email, password:hash })

        res.status(201).json({
            newUserDetails:data
        });
    })


    // const data= await User.create({
    //     username:username,
    //     email:email,
    //     password:password
    // });

    // res.status(201).json({
    //     newUserDetails:data
    // });
};


exports.userLogin= async (req,result,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    const obj= await User.findAll({
        where:{
            email:email
        }
    });

    console.log("length --> "+obj.length);

    
    if(obj.length>0){
        //check if password matches
        const pass=obj[0].password;
        //password match by comaring encrypted value
        bcrypt.compare(password, pass, (err,res) =>{
            if(err){
                result.status(500).json({ success:false, message:"Something Went Wrong" });
            }
            if(res===true){
                result.status(200).json({ success:true, message:"Loged in Successfully" });
            }else{
                result.status(400).json({ success:false, message:"Password is Incorrect" });
            }
        })
        
    } else 
    {
        return result.status(404).json({ success:false, message:"User Not Found" });
    }


    // if(obj.length>0){
    //     // check if password matches
    //     const pass=obj[0].password;

    //     if(password===pass){
    //         result.status(200).json({ success:true, message:"Loged in Successfully" });
    //     }else{
    //         result.status(400).json({ success:false, message:"Password is Incorrect" });
    //     }
        
    // } 
    // else {
    //     return result.status(404).json({ success:false, message:"User Not Found" });
    // }

    
    // result.status(201).json({
    //     newUserDetails:obj
    // });
};


