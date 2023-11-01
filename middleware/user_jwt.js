const jwt=require('jsonwebtoken');

module.exports=async function(req,res,next){
    const token=req.header('Authorization');
    if(!token){
        return res.status(401).json({
            success:false,
            msg:'No token found,autorization denied'
        });
    }
    try {
        await jwt.verify(token,process.env.jwtUserSecret,(err,decoded)=>{
            if(err){
                res.status(401).json({
                    success:false,
                    msg:'Invalid token'
                });
            }
            req.user=decoded.user;
            next();
        });
    } catch (error) {
        console.log('something went wrong with middleware'+error);
        res.status(500).json({
            success:false,
            msg:'Server Error'
        });
    }
}