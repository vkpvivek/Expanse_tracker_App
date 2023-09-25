const express=require('express');
const expanseController=require('../controllers/expanseAPI');
const router=express.Router();


router.get('/get-expanse',expanseController.getExpanses);

router.post('/add-expanse',expanseController.postExpanses);

router.delete('/delete-expanse/:id',expanseController.deleteExpanses);



router.get('/exp',(req,res,next)=>{
    res.send("HomePage");
});


module.exports=router;