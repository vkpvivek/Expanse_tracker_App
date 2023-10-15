const express=require('express');
const Sib= require('sib-api-v3-sdk');

require('dotenv').config();

const client = Sib.ApiClient.instance;

const apiKey=client.authentications['api-key']
apiKey.apiKey=process.env.API_KEY;


exports.callForgotPassword= async (req,res,next)=>{
    //const apiInstance=new Sib.TransactionalEmailsApi();
    const tranEmailAPi =new Sib.TransactionalEmailsApi();
    const sender={
        email:"vkpviek67@gmail.com",
        name:"Vivek PaL"
    };
    const receivers=[
        {
            // email:req.body.email
            email:'vkpvivek70@gmail.com',
        },
    ];

    try {

        const sendEmail=await tranEmailAPi.sendTransacEmail({
            sender,
            to:receivers,
            subject :"Test Email From SendinBlue",
            textContent:"Test Email"
        })

        console.log(sendEmail);
        console.log()
        res.json({message:"test success"});

    } 
    catch (error) {
        console.log(error);
        res.json({ message:"test Failed" });
    }

};
