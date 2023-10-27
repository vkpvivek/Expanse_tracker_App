const Razorpay= require('razorpay');
const Order=require('../models/order');
const userController = require('./userAPI');
const jwt=require('jsonwebtoken');
require('dotenv').config();


// console.log("..........."+process.env.RZP_KEY_ID);
// console.log("..........."+process.env.RZP_SECRET_KEY);

exports.purchasePremium=async (req,res)=>{
    try{

        var rzp=new Razorpay({
            // key_id: 'rzp_test_au1lmm2lg1jblp',
            // key_secret: 'M9Fu1QSa7Ix6lFcicc1ae9H3'
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_SECRET_KEY
        })
        const amount=5500;

        rzp.orders.create({amount,currency:"INR"},(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            
            //res.status(200).json({order});
            req.user.createOrder({orderId:order.id, status:'PENDING'})
                .then(() =>{
                    return res.status(201).json({order,key_id:rzp.key_id});
                })
                .catch(err =>{
                    throw new Error(err)
                })
        })

        //res.status(200).json({message:'Testing',amount,rzp});

    } catch(err){
        console.log(err);
        res.status(403).json({message:'Something Went Wrong',error:err});
    }
}

function generateAccessToken(id, username, isPremiumUser){
    return jwt.sign({userId:id , username ,isPremiumUser },'xxxSecretKeyxxx')
}

exports.updateStatus= async (req,res)=>{
    console.log(".......update Status..................");
    try{

        const {payment_id,order_id} = req.body;
        const order = await Order.findOne({where:{orderId:order_id}})

        //token to remain login after premium even after refresh
        const token= generateAccessToken(req.user.id,undefined,true);
        console.log(token);
        // await order.update({paymentId:payment_id,status:'SUCCESSFUL'})
        // await req.user.update({isPremiumUser:true})

        const promise1=order.update({paymentId:payment_id,status:'SUCCESSFUL'});
        const promise2=req.user.update({isPremiumUser:true});

        Promise.all([promise1,promise2]).then(()=>{
            return  res.status(202).json({success:true,message:'Transaction Successful',token});
        }).catch((err)=>{
            throw new Error(err);
        })

        
    }
    catch(err){
        //console.log(err);
        return res.status(403).json({message:'Something Went Wrong',error:err,success:false});
    }

}



exports.updateTransactionStatus=async (req,res)=>{
    console.log("update Status");
    try{
        const {payment_id,order_id} = req.body;
        Order.findOne({where:{orderId:order_id}})
            .then(order =>{

                order.update({paymentId:payment_id,status:'SUCCESSFUL'}).then(()=>{
                    req.user.update({isPremiumUser:true}).then(()=>{
                        return res.status(202).json({success:true,message:'Transaction Successful'});
                    }).catch((err)=>{
                        throw new Error(err);
                    })
                }).catch((err)=>{
                    throw new Error(err);
                })

            })
            .catch(err=>{
                throw new Error(err);
            })

    }
    catch(err){
        console.log(err);
        res.status(403).json({message:'Something Went Wrong',error:err,success:true});
    }

}


