const express=require('express');
const premiumController=require('../controllers/premiumAPI');
const userAuthentication=require('../middleware/Auth');

const router=express.Router();

router.get('/showLeaderBoard',userAuthentication.authenticate ,premiumController.getLeaderBoard);

module.exports=router;