const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Expanse=sequelize.define('expanses',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    amount:{
        type:Sequelize.INTEGER
    },
    description:{
        type:Sequelize.STRING
    },
    categories:{
        type:Sequelize.STRING
    }
});

module.exports=Expanse;