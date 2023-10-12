const User=require('../models/user');
const Expanse=require('../models/expanse');
const sequelize=require('../util/database');

exports.getLeaderBoard= async (req,res)=>{

    try{

        // const users=await User.findAll();
        // const expanses=await Expanse.findAll();
        // const userAggregatedExpanses ={}

        // expanses.forEach((expanse)=>{

        //     if(userAggregatedExpanses[expanse.userId]){
        //         userAggregatedExpanses[expanse.userId]=userAggregatedExpanses[expanse.userId]+ expanse.amount;
        //     }else{
        //         userAggregatedExpanses[expanse.userId]=expanse.amount;
        //     }

        // })

        // console.log("---------------------------");
        // var userleaderBoardDetails=[];

        // users.forEach((user)=>{
        //     userleaderBoardDetails.push({username:user.username, totalCost:userAggregatedExpanses[user.id] })
        // })
        // console.log(userleaderBoardDetails);
        // //sorting
        // userleaderBoardDetails.sort((a,b)=> b.totalCost -a.totalCost);
        // res.status(200).json(userleaderBoardDetails);


        const aggrLeaderBoard= await User.findAll({
            attributes:['id','username',[sequelize.fn('sum',sequelize.col('expanses.amount')),'totalCost']],
            include:[
                {
                    model:Expanse,
                    attributes:[]
                }
            ],
            group:['user.id'],
            order:[['totalCost','DESC']]
            //order:[sequelize.col('totalCost'),'DESC']
        })

        res.status(200).json(aggrLeaderBoard);


    }catch(err){
        res.status(403).json({error:err});
    }

}