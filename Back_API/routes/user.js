const express=require('express');
const userController = require('../controllers/userAPI');
const router=express.Router();


router.post('/add-user',userController.postUser);

router.post('/login',userController.userLogin);


router.get('/home',(req,res,next)=>{
    res.send("HomePage");
});

module.exports=router;