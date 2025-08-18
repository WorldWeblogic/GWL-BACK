const errorMiddleware =(err,req,res,next)=>{
    const status=err.status || 500;
    const message=err.message || "Internal server error";
    const extradetails=err.extradetails || "Something went wrong";
    return res.status(status).json({
        status,
        message,
        extradetails
    });
}
module.exports=errorMiddleware;
