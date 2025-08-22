require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var teacherRouter =require('./routes/teacherRoutes');

var app = express();
const cors = require('cors');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/teacher', teacherRouter);

app.use(cors({
  origin: [
    'http://localhost:5173'
  ],
}));


// Connect to mongoose
const mongoose = require('mongoose');
main().catch(err => console.log(err));

async function main() {
    await mongoose
        .connect(process.env.MONGO_URL)
        .then(data =>{
            console.log("Database Connnected Successfully", data.connection.name);
        });
}

module.exports = app;
