const express=require('express');
const bodyParser=require('body-parser');
const sequelize=require('./util/database');
const cors=require('cors');

const app=express();

app.use(express.json());  //to parse JSON request bodies

const userRoutes=require('./routes/user');
const expanseRoutes=require('./routes/expanse');
const purchaseRoutes=require('./routes/purchase');
const premiumRoutes=require('./routes/premium');

const Expanse = require('./models/expanse');
const User = require('./models/user');
const Order= require('./models/order');
const Forgotpassword = require('./models/forgotpassword');


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(userRoutes);
app.use(expanseRoutes);
app.use(purchaseRoutes);
app.use(premiumRoutes);

User.hasMany(Expanse);
Expanse.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);



app.get('/',(req,res,next)=>{
    res.send('Not found');
})


sequelize
    .sync()
    //.sync({force:true})
    .then(result=>
        console.log("databse successfully setup")
    )
    .catch(err=>console.log(err));

app.listen(3000)