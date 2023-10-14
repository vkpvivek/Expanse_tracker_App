const express=require('express');
const Expanse=require('../models/expanse');
const User=require('../models/user');
const sequelize=require('../util/database');


exports.getExpanses= async (req,res,next)=>{
    console.log("______ID_>>"+req.user.id);
    const expanses= await Expanse.findAll({where:{userId:req.user.id}});
    //const expanses= await Expanse.findAll();

    res.status(201).json({
        newExpanseDetails:expanses
    });
};


exports.postExpanses= async (req,res,next)=>{
    const t=await sequelize.transaction();
    try
    {
        const amount=req.body.amount;
        const description=req.body.description;
        const categories=req.body.categories;
        const userId=req.user.id;

        const data= await Expanse.create({
            amount:amount,
            description:description,
            categories:categories,
            userId:userId
        }
        ,{transaction :t}
        );

        //Update Total Cost in User Table
        const user = await User.findByPk(userId);
        const totCost = user.totalCost + Number(amount);
        //const updatedCost=
        await User.update(
            {totalCost:totCost},
            {
                where:{id:userId},
                transaction:t
            }
        );

        await t.commit();

        res.status(201).json({
            newExpanseDetails:data,
            "totCost":totCost
        });
    }
    catch(err){
        await t.rollback();
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Something is wrong"
        });
    }
    
};



exports.deleteExpanses= async (req,res,next)=>{
    const t=await sequelize.transaction();
    try{
        const expId= req.params.id;
        const userId=req.user.id;

        const exp= await Expanse.findByPk(expId);
        const user = await User.findByPk(userId);

        await Expanse.destroy({
            where:{id:expId,userId:userId}
        },
        {transaction :t}
        );

        const totCost = user.totalCost - Number(exp.amount);

        await User.update(
            {totalCost:totCost},
            {
                where:{id:userId},
                transaction:t
            }
        );

        await t.commit();
        console.log(user.username+"......"+exp.amount+"........."+totCost);
        res.status(200);  //.json(user,exp);


    }catch(err){
        await t.rollback();
        console.log(err);
    }
};