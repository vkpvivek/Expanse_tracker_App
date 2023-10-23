const express=require('express');
const uuid = require('uuid');
const Sib= require('sib-api-v3-sdk');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');
const bcrypt=require('bcrypt');


require('dotenv').config();

const client = Sib.ApiClient.instance;
const apiKey=client.authentications['api-key']
apiKey.apiKey=process.env.API_KEY;

exports.callForgotPassword= async (req,res,next)=>{
    const tranEmailAPi =new Sib.TransactionalEmailsApi();
    const sender={
        email:"vkpviek67@gmail.com",
        name:"Vivek PaL"
    };
    const receivers=[{
        email:req.body.email
    }];

    try {

        const Email =  req.body.email;
        const requestId = uuid.v4();
        const user = await User.findOne({where : { Email }});

        if (!user) {
            return res
                .status(404)
                .json({ message: "Please provide the registered email!" });
        }

        const resetRequest = await Forgotpassword.create({
            id: requestId,
            active: true,
            userId: user.id,
        });


        const sendEmail=await tranEmailAPi.sendTransacEmail({
            sender,
            to:receivers,
            subject :"Test Email From SendinBlue",
            textContent:"Test Email",
            htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
            <a href="http://localhost:3000/resetPassword/{{params.requestId}}"> Click Here</a>`,
            // htmlContent: `<h3>Hi! We got the request from you for reset the password. 
            //     Here is the link below >>><br> http://localhost:3000/resetPassword/{{params.requestId}}" 
            // </h3>`,
            params: {
                requestId: requestId,
            },
        })

        return res.status(200).json({
            message:
                "Link for reset the password is successfully send on your Mail Id!",
        });

        //console.log(sendEmail);
        // console.log(user);
        // console.log("uuid>>"+id);
        //console.log(forpass);

        //res.json({message:"test success"});

    } 
    catch (error) {
        console.log(error);
        res.json({ message:"test Failed" });
    }

};


exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    //const id=`3773ddab-60c6-49f2-8af3-038ae9ff6867`;

    console.log(id);
    Forgotpassword.findOne({ where : { id }})
        .then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            res.status(200)
                .send(`<html>
                        <script>
                            function formsubmitted(e){
                                e.preventDefault();
                                console.log('called')
                            }
                        </script>

                        <form action="/updatepassword/${id}" method="get">
                            <label for="newpassword">Enter New password</label>
                            <input name="newpassword" type="password" required></input>
                            <button>reset password</button>
                        </form>
                    </html>`)

            res.end()
        }
    })
}


exports.updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetId } = req.params;

        console.log(newpassword);
        console.log(resetId );

        Forgotpassword.findOne({ where : { id: resetId }})
            .then(resetpasswordrequest => {
                User.findOne({where: { id : resetpasswordrequest.userId}})
                .then(user => {

                console.log('userDetails', user)

                if(user) {
                    //encrypt the password
                    const saltRounds = 5;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }

                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly update the new password'})
                            })
                        });

                    });
                } 
                else{
                    return res.status(404).json({ error: 'No user Exists', success: false})
                }

            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}



