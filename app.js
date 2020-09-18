const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const Site = require('./models/siteler');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));




const http = require('http');


const fetch = require("node-fetch");

setInterval(() => {
    mongoose.connect("Mongo Adresi", function (err,db) {
    var users=db.collection("sites");
    users.find({}).toArray(function (err, result){  
      result.forEach(site =>{
        if(!site) return;
          try {
            fetch(site.site_link)
            console.log("Pinglenen Site:" + site.site_link)
          } catch(e) { console.log("" + e) };
      })
    })
  });
}, 60000)



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
