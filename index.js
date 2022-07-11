const path=require('path');
const express=require('express')
const bodyparser=require('body-parser');
const mysql=require('mysql');
const ejs=require('ejs');
 const app=express();

 const connection=mysql.createConnection({
   hostname:"localhost",
   user:"root",
   password:"",
   database:"node-crud"
})
connection.connect(()=>{
   console.log("connection successfully connected")
})

app.set('views',path.join(__dirname,'views'))

app.set('view engine','ejs')
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.get('/dashboard',(req,res)=>{
   res.render('dashboard')
})

app.get('/list',(req,res)=>{
   var sql=" select * from employee";
   var query=connection.query(sql,(err,rows) =>{

      if(err) throw err;
      res.render('user-index',{
         title:"EMPLOYEE DETAILS LIST",
         employee:rows
      })
   } )

    
})
app.get('/',(req,res)=>{
   res.render('login',{
      title:"Sign in Form"
   })
})
const card={
   email:'admin@123',
   password:'admin123'
}
app.post('/logging',(req,res)=>{
   if(req.body.email==card.email&&req.body.password==card.password){
      res.redirect('/dashboard')
   }else{
      res.end("your email and password mismatch")
   }
})

app.get('/add',(req,res)=>{
   res.render('add-user',{
      title:"Add a new employee detail"
   })
})

app.post('/save',(req,res)=>{
   let data={Name:req.body.Name,Email:req.body.Email,Mobile:req.body.Mobile,City:req.body.City}
   let sql="INSERT INTO employee SET ?"
   let query=connection.query(sql,data,(err,results)=>{
      if(err) throw err;
      res.redirect('/list')
   })
   

})
app.get('/edit/:user',(req,res)=>{
   let user=req.params.user;
    let sql="select * from employee where userId="+user;
    let query=connection.query(sql,(err,result)=>{
       if(err) throw err;
      res.render('edit-user',{
         title:"Edit the employee details",
         e:result[0]
      })
   })
})

app.post('/update',(req, res) => {
   const user = req.body.userId;
  
  let sql="update employee SET Name='"+req.body.Name+"',Email='"+req.body.Email+"',Mobile='"+req.body.Mobile+"',City='"+req.body.City+"' where userId="+user;
   
   let query = connection.query(sql,(err, results) => {
     if(err) throw err;
     res.redirect('/');
   });
});
app.get('/delete/:user',(req,res)=>{
   var user=req.params.user;
   var sql="delete from employee where userId="+user;
   var query=connection.query(sql,(err,result)=>{
      if(err) throw err;
      res.redirect('/')
   })
})
app.get('/logoff',(req,res)=>{
   res.redirect('/')
})
 app.listen(3002,(req,res)=>{
    console.log("server connected successfully")
 })