const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const DownloadRecord=sequelize.define('downloadRecords',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:Sequelize.INTEGER
    },
    fileURL:{
        type:Sequelize.STRING
    }
});

module.exports= DownloadRecord;