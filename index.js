const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const categoryroutes = require('./routes/CategoryRoutes');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI);
const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error)
});
database.once('connected', () => {
    console.log('database connected');
});




app.use('/api/v1/category', categoryroutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('hello from simple server :)')
})


app.listen(port, () => console.log('> Server is up and running on port : ' + port))