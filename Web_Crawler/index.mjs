import express from 'express';
import body from 'body-parser';
import multer from 'multer';
import ejs from 'ejs';
import moz from 'imagemin-mozjpeg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import path from 'path';
const app=express();
//body parser initialize
app.use(body.json());
app.use(body.urlencoded({extended:true}));
// ejs initialize
app.set('view engine','ejs');
// yaha peh thoda doubt hai /uploads kyun use kiya
app.use('/upload',express.static(path.join(__dirname, 'upload')));
app.use(express.static(__dirname+"/public"));
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,"upload");
  },
  filename:function(req,file,cb){
    cb(null,file.fieldname+Date.now()+path.extname(file.originalname));
  }

});
const upload=multer({storage:storage});
app.get('/',(req,res)=>{
 res.render('index');
})
app.post('/',upload.single('image'),(req,res,next)=>{
 const file=req.file;
 var ext;
 if(file==null){
   res.render("nofile");
 }
 if (file.mimetype=="image/jpeg"){
   ext='jpg';
 }
 else if(file.mimetype=='image/png'){
   ext='png';
 }
else if(file.mimetype!="image/jpeg"||file.mimetype!='image/png'){
  res.render("not_correct_file");
}
 var a=file.path;
 var fina=file.path;
 var url=fina.replace(/\\/g,'/');
 res.render('image',{url:url,name:file.filename,ext:ext});
});
app.post('/compress/:name/:ext',async(req,res)=>{
  console.log(req.params.name);
  const files = await imagemin(["upload/"+req.params.name], {
    destination: "output",
    plugins: [
      moz({
         quality:30
      }),
      imageminPngquant({
        quality: [0.1, 0.1]
      })
    ]
  });
res.download(files[0].destinationPath);
})
app.get("/blog",(req,res)=>{
  res.render('aboutus')
})
app.listen(process.env.PORT || 3000,()=>{
  console.log("success");
})
