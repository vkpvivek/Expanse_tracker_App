const User=require('../models/user');
const Expanse=require('../models/expanse');
const sequelize=require('../util/database');
const DownloadRecord=require('../models/downloadRecord');
const S3services=require('../services/s3services');
//const AWS=require('aws-sdk');


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


exports.getDownload= async (req,res)=>{
    try{

        console.log(".......dwd......"); 
        console.log("______ID_>>"+req.user.id);

        const expanses=await Expanse.findAll({where:{userId:req.user.id}})
        //console.log(expanses);
        const userId=req.user.id;
        const stringifiedExpenses =JSON.stringify(expanses);
        const filename=`Expenses/${userId}/${new Date()}.txt`;
        const fileURL=await S3services.uploadTOS3(stringifiedExpenses,filename);
        //const fileURL=await uploadTOS3(stringifiedExpenses,filename);

        console.log("...>>"+fileURL);

        //store the Download Records
        const dwdRecord={
            userId: req.user.id,
            fileURL:fileURL
        }
        const downloads =await DownloadRecord.create(dwdRecord);

        res.status(200).json({fileURL, success:true, message: "Please"});

    }catch(err){

         res.status(403).json({success:false, mesage:"something is definately wrong"});
    }

}


// function uploadTOS3(data,filename){
//     const BUCKET_NAME='varsha.bucket1';
//     const IAM_USER_KEY='AKIATHBSP25NJDQQBZCY';
//     const IAM_USER_SECRET='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';


//     let s3bucket=new AWS.S3({
//         accessKeyId:IAM_USER_KEY,
//         secretAccessKey:IAM_USER_SECRET
//     })


//     var params={
//         Bucket: BUCKET_NAME,
//         Key: filename,
//         Body: data,
//         ACL :'public-read'
//     }

//     return new Promise((resolve,reject)=>{
//         s3bucket.upload(params, (err,s3reponse)=>{
//             if(err){
//                 console.log('Something went wrong',err)
//                 reject(err);    
//             }else{
//                 //console.log('Success',s3reponse);
//                 resolve(s3reponse.Location);
//             }
//         })

//     })
// }
