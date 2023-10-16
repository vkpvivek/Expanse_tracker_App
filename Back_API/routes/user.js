const express=require('express');
const userController = require('../controllers/userAPI');
const passwordController = require('../controllers/PasswordAPI');
const router=express.Router();


router.post('/add-user',userController.postUser);

router.post('/login',userController.userLogin);


router.post('/forgotPassword',passwordController.callForgotPassword);

router.get('/resetPassword/:id',passwordController.resetpassword);

router.get('/updatepassword/:resetId', passwordController.updatepassword);



router.get('/home',(req,res,next)=>{
    res.send("HomePage");
});

module.exports=router;