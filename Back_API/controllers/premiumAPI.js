const User=require('../models/user');
const Expanse=require('../models/expanse');
const sequelize=require('../util/database');

exports.getLeaderBoard= async (req,res)=>{
    try{
        
        const aggrLeaderBoard= await User.findAll({
            order:[['totalCost','DESC']]

        })
        res.status(200).json(aggrLeaderBoard);

    }catch(err){
        res.status(403).json({error:err});
    }

}