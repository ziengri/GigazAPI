import jwt from "jsonwebtoken";

export default (req,res,next)=>{
    const token =(req.headers.authorization||"").replace(/Bearer\s?/,'');
    // console.log(token);
    if(token){
        try {
            const decoded = jwt.verify(token,"gigaz19")
            req.userId = decoded._id
            next()
        } catch (error) {
            return res.status(403).json({
                msg:"Нет доступа при рашифровки"
            }) 
        }
    }
    else{
        return res.status(403).json({
            msg:"Нет доступа"
        })
    }
    
};