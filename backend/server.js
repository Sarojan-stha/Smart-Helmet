const express = require('express')
const app = express();


app.get('/',(req,res)=>{
    res.send("hey from backend");
})

app.listen(3000);