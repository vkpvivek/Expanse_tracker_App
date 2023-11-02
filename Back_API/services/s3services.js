const AWS=require('aws-sdk');

require('dotenv').config();

exports.uploadTOS3 = async (data,filename)=> {
    const BUCKET_NAME=process.env.AWS_S3_BUCKET_NAME;
    const IAM_USER_KEY=process.env.AWS_S3_IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.AWS_S3_IAM_USER_SECRET;

    
    let s3bucket=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })

    var params={
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL :'public-read'
    }

    return new Promise((resolve,reject)=>{
        s3bucket.upload(params, (err,s3reponse)=>{
            if(err){
                console.log('Something went wrong',err)
                reject(err);    
            }else{
                //console.log('Success',s3reponse);
                resolve(s3reponse.Location);
            }
        })

    })
}
