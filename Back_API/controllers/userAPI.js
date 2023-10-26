const express=require('express');
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


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

function generateAccessToken(id, username, isPremiumUser){
    return jwt.sign({userId:id , username ,isPremiumUser },'xxxSecretKeyxxx')
}

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
        const UserId=obj[0].id;
        //password match by comaring encrypted value
        bcrypt.compare(password, pass, (err,res) =>{
            if(err){
                result.status(500).json({ success:false, message:"Something Went Wrong" });
            }
            if(res===true){
                result.status(200).json({ success:true, message:"Loged in Successfully", token :generateAccessToken(UserId ,obj[0].username,obj[0].isPremiumUser)});
            }else{
                result.status(400).json({ success:false, message:"Password is Incorrect" });
            }
        })
        
    } else 
    {
        return result.status(404).json({ success:false, message:"User Not Found" });
    }


    // result.status(201).json({
    //     newUserDetails:obj
    // });
};


// exports.callForgotPassword= async (req,res,next)=>{

//     console.log(req.body.email);
//     res.json({ message:"test" });

// };


