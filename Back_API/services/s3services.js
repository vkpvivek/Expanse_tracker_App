const AWS=require('aws-sdk');


exports.uploadTOS3 = async (data,filename)=> {
    const BUCKET_NAME='varsha.bucket1';
    const IAM_USER_KEY='AKIATHBSP25NJDQQBZCY';
    const IAM_USER_SECRET='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';


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
