const Razorpay= require('razorpay');
const Order=require('../models/order');

exports.purchasePremium=async (req,res)=>{
    try{

        var rzp=new Razorpay({
            key_id: 'rzp_test_cdFtEBtFwUjmIb',
            key_secret: 'okzqC52UcQIgq7LzzhgZsXIr'
            // key_id: process.env.RAZORPAY_KEY_ID,
            // key_secret: process.env.RAZORPAY_KEY_SECRET
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

        // res.status(200).json({message:'Testing',amount,rzp});

    } catch(err){
        console.log(err);
        res.status(403).json({message:'Something Went Wrong',error:err});
    }
}


exports.updateStatus= async (req,res)=>{
    console.log(".......update Status..................");
    try{

        const {payment_id,order_id} = req.body;
        const order = await Order.findOne({where:{orderId:order_id}})

        // await order.update({paymentId:payment_id,status:'SUCCESSFUL'})
        // await req.user.update({isPremiumUser:true})

        const promise1=order.update({paymentId:payment_id,status:'SUCCESSFUL'});
        const promise2=req.user.update({isPremiumUser:true});

        Promise.all([promise1,promise2]).then(()=>{
            return  res.status(202).json({success:true,message:'Transaction Successful'});
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


