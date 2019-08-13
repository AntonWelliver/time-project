const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

//Connect To Mongoose
mongoose.connect('mongodb+srv://Anton123:Anton123@awcluster-agvsp.mongodb.net/test?retryWrites=true&w=majority', {
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

//Index Route
app.get('/', (req, res)=> {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res)=> {
    res.render('about');
});

//Add Race Form
app.get('/races/add', (req, res)=> {
    res.render('races/add');
});

//Process Form
app.post('/races', (req, res) => {
    let errors = [];

    if(!req.body.name) {
        errors.push({text:'Please add a name'});
    }
    if(!req.body.distance) {
        errors.push({text:'Please add a distance'});
    }
    if(!req.body.date) {
        errors.push({text:'Please add a date'});
    }
    if(!req.body.capacity) {
        errors.push({text:'Please add a capacity'});
    }
    if(!req.body.location) {
        errors.push({text:'Please add a location'});
    }

    if(errors.length > 0){
        res.render('races/add', {
            errors: errors,
            name: req.body.name,
            distance: req.body.distance,
            date: req.body.date,
            capacity: req.body.capacity,
            location: req.body.location
        });
    } else {
        const newItem = {
            name: req.body.name,
            distance: req.body.distance,
            date: req.body.date,
            capacity: req.body.capacity,
            location: req.body.location,
            message: req.body.message
        }
        new Race(newItem)
        .save()
        .then(race => {
            res.redirect('/races');
        })
    }
});

const port = 5000;

app.listen(port, () =>{
    console.log(`Server started on port ${port}`);
});