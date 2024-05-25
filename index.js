
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

require("./discord_bot");
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());



app.get('/',(req,res)=>{
    res.json({status:true,message:"connection established"});
});


app.listen(PORT,()=>{
console.log(`Listening to port ${PORT} ....`);
});