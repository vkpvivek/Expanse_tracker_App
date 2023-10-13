const Sequelize=require('sequelize');
const sequelize = require('../util/database');

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    username:{
        type: Sequelize.STRING
    },
    email:{ 
        type: Sequelize.STRING,
        unique:true
    },
    password:{
        type: Sequelize.STRING,
    },
    isPremiumUser:Sequelize.BOOLEAN,
    totalCost:{
        type:Sequelize.INTEGER,
        defaultValue :0
    }
});

module.exports=User;

