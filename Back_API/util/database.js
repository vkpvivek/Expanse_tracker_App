const Sequelize=require('sequelize');

const sequelize=new Sequelize('Expanse_Tracker','root','zxcvbnm123',{
    dialect:'mysql',
    host:'localhost'
});

module.exports=sequelize;