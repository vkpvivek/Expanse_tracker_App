const express=require('express');
const bodyParser=require('body-parser');
const sequelize=require('./util/database');
const cors=require('cors');

const app=express();

app.use(express.json());  //to parse JSON request bodies

const userRoutes=require('./routes/user');
const expanseRoutes=require('./routes/expanse');


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(userRoutes);
app.use(expanseRoutes);



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