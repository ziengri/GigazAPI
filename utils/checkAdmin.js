import jwt from "jsonwebtoken";

export default (req,res,next)=>{
    const token =(req.headers.authorization||"").replace(/Bearer\s?/,'');
    // console.log(token);
    if(token){
        try {
            const decoded = jwt.verify(token,"gigaz19")
            if(decoded._id=="648f461db9301749fa30a43c"){
                next()
            }
            else{
                // return res.status(403).json({
                //     msg:"Нет доступа"
                // })   
            }
        } catch (error) {
            next()
            // return res.status(403).json({
            //     msg:"Нет доступа при рашифровки"
            // }) 
        }
    }
    else{
        return res.status(403).json({
            msg:"Нет доступа"
        })
    }
    
};