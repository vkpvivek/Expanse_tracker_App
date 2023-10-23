const express=require('express');
const expanseController=require('../controllers/expanseAPI');
const userAuthentication=require('../middleware/Auth');

const router=express.Router();


router.get('/get-expanse',userAuthentication.authenticate , expanseController.getExpanses);

router.post('/add-expanse',userAuthentication.authenticate, expanseController.postExpanses);

router.delete('/delete-expanse/:id',userAuthentication.authenticate, expanseController.deleteExpanses);



router.get('/exp',(req,res,next)=>{
    res.send("HomePage");
});


module.exports=router;