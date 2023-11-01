const mongoose=require('mongoose');
const connectDb=async()=>{
    const conn=await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true
        
    });
    console.log(`MongoDb connected: ${conn.connection.host}`.cyan.bold);

}
module.exports=connectDb;