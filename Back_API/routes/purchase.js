const express=require('express');
const purchaseController=require('../controllers/purchaseAPI');
const userAuthentication=require('../middleware/Auth');

const router=express.Router();

router.get('/purchase',userAuthentication.authenticate ,purchaseController.purchasePremium);

router.post('/updateTransactionStatus',userAuthentication.authenticate ,purchaseController.updateStatus);


module.exports=router;