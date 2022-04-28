const express=require('express');
const mongoose = require('mongoose');
const url='mongodb://localhost/reports';
const PORT =9000;

const reportRouter=require('./routes/reports');
const app=express();
mongoose.connect(url,{useNewUrlParser:true, 
useNewUrlParser:true,
useUnifiedTopology:true});
const con=mongoose.connection;
con.on('open',()=>{
    console.log('Mongodb connected')
})

app.use(express.json());

app.use('/reports',reportRouter);

app.listen(PORT,()=>{
    console.log('server started');
})
