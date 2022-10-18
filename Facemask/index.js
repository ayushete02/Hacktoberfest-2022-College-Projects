const express=require("express");
const path=require("path");
const app=express();
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, '/index.html'));
})
app.use(express.static(__dirname+"/public"));
app.listen(process.env.PORT||3000,()=>{
    console.log("Server started on port 3000");
})