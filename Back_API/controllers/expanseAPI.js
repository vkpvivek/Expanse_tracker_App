const express=require('express');
const Expanse=require('../models/expanse');
const User=require('../models/user');


exports.getExpanses= async (req,res,next)=>{
    console.log("______ID_>>"+req.user.id);
    const expanses= await Expanse.findAll({where:{userId:req.user.id}});
    //const expanses= await Expanse.findAll();

    res.status(201).json({
        newExpanseDetails:expanses
    });
};


exports.postExpanses= async (req,res,next)=>{
    const amount=req.body.amount;
    const description=req.body.description;
    const categories=req.body.categories;
    const userId=req.user.id;

    const data= await Expanse.create({
        amount:amount,
        description:description,
        categories:categories,
        userId:userId
    });


    //Update Total Cost in User Table
    const user = await User.findByPk(userId);
    const totCost = user.totalCost + Number(amount);
    const updatedCost=await User.update(
        {totalCost:totCost},
        {where:{id:userId}}
    )


    res.status(201).json({
        newExpanseDetails:data,
        "totCost":totCost
    });
};



exports.deleteExpanses= async (req,res,next)=>{
    try{
        const expId= req.params.id;
        const userId=req.user.id;
        await Expanse.destroy({
            where:{id:expId,userId:userId}
        });
        res.status(200);
    }catch(err){
        console.log(err);
    }
};