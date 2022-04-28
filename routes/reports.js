const express = require("express");
const router = express.Router();
const report = require('../models/report')
const reportsend=require('../models/sendreport')
const { v4: uuidv4 } = require('uuid');

router.get("/", async (req, res) => {

     const reportid = req.query.reportID;
     const finddocument=await reportsend.findOne({_id: reportid});

  try {
     
     res.send({ "_id": finddocument._id,
     "cmdtyName": finddocument.cmdtyName,
     "cmdtyID": finddocument.cmdtyID,
     "marketID": finddocument.marketID,
     "marketName": finddocument.marketName,
     "users": finddocument.users,
     "timestamp": finddocument.updatedAt,
     "priceUnit": "Kg",
     "price": finddocument.price
   })
   

  } catch (err) {
    res.send(err);
  }
});

router.post('/',async (req, res) => {
    
    const reportid=uuidv4();
 
    
      const reportdetails= new report({
        ...req.body,reportID:reportid});

const cmdtyID=req.body.cmdtyID;
const marketID=req.body.marketID;
let findids=await reportsend.findOneAndDelete({marketID:marketID,cmdtyID:cmdtyID});
  
  
  let findedId;
  let calculatedPrice=0;
  let counted=0;
  let Totalprice=0;
  let addedUsers=[];

  console.log(findids);
  
  if(findids!=null) {
   counted=(findids.count)+1;

   let temp=(req.body.price/req.body.convFctr);
  Totalprice=(findids.totalprice)+(temp);
  calculatedPrice=(Totalprice/counted);
 findedId=findids._id;
 
 addedUsers=findids.users;
 
 addedUsers.push(req.body.userID); 
}else{
    
    addedUsers.push(req.body.userID); 
   counted=1;
   calculatedPrice=(req.body.price/req.body.convFctr);
   Totalprice=calculatedPrice;

findedId=reportid;
}
      
  
           
        const reportsave=new reportsend({

        _id: findedId,
        cmdtyName: req.body.cmdtyName,
        cmdtyID: req.body.cmdtyID,
        marketID: req.body.marketID,
        marketName: req.body.marketName,
        users: addedUsers,
       
        priceUnit: "Kg",
        price: calculatedPrice,
        totalprice:Totalprice,
        
        count:counted
      

    })

  const savedreport=await reportsave.save(); 
    
     
     try{
     
         
      const r1=await reportdetails.save();
      
     
      res.json({
        status: "success",
        reportID:   findedId
      });
      
     }
     catch(err){
         res.send(err)
     }


})


module.exports = router;
