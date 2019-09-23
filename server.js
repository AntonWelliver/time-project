require('dotenv').config()

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Connect To Mongoose
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Load Race Model
require('./models/Race');
const Race = mongoose.model('races');

//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Set static folder
app.use(express.static('public'));

const informationRouter = require('./routes/information')
app.use('/information', informationRouter)

const port = 5000;

app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
});