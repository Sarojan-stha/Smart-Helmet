const express = require('express')
const userRouter = require('./src/routes/user')

const app = express();
const connectDB = require('./src/config/db')

app.use(express.urlencoded({extended:true}));
app.use(express.json());
connectDB();

app.use('/', userRouter);


app.get('/',(req,res)=>{
    res.send("hey from backend");
})

app.listen(5000);