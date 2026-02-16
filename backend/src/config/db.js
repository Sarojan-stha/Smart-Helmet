const mongoose = require('mongoose');




const connectDB = ()=>{
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/smart_helmet')
        console.log('connected to db');
    } catch (error) {
        console.error(error);
        
    }
}

module.exports = connectDB;