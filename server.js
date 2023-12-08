const express=require('express');
const colors=require('colors');
const morgan=require('morgan');
const dotenv=require('dotenv');
const connectdb=require('./config/db');

const app=express();
 
// app.use((req,res,next)=>{
//     console.log('Hello from middleware');
//     req.title="sab jagh accessable";
//     next();
// });

app.use(morgan('dev'));//it will show the request in console
app.use(express.json({}));//it will parse the json data
app.use(express.json({extended:true}));//it will parse the urlencoded data
dotenv.config({path:'./config/config.env'});
connectdb();

const port=process.env.PORT || 3000;


app.use('/api/todo/auth',require('./routes/user_routes'));

app.listen(port,console.log(`Server running on port ${port}`.red.underline.bold));

app.get('/',(req,res)=>{
    res.send('coonection successfully...');
});
app.get('/todo',(req,res)=>{
    res.status(200).json({
        success:true,
        data:{
           "your data":"coonected"
            
        }
    });   
});
