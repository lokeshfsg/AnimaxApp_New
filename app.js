
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const routes = require('./Routes/index');

const app = express();

const port = process.env.PORT || 5400;


app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // http://localhost:3000
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//npm i cors
app.use('/', routes);

console.log("Connecting to MongoDB with URI:", (process.env.MONGO_URI || 'mongodb://localhost:27017/animaxdb').replace(/:([^:@]{1})[^:@]*@/, ':***@'));

mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/animaxdb'
).then(success => {
    console.log("✅ MongoDB Connected Successfully");

    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });

}).catch(error => {
    console.log("❌ MongoDB Connection Error: " + error);
});
