const express = require('express');
const routes = express.Router();
const Models = require('../models/models');
const flash = require('express-flash-messages');
const session = require('express-session');
const bodyParser = require('body-parser');

// require stuff for passport
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

routes.use(
  session({
    secret: 'keyboard kitten',
    resave: false,
    saveUninitialized: true
  })
);

// connect passport to express boilerplate
routes.use(passport.initialize());
routes.use(passport.session());
routes.use(flash());

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended: false}));

// configure passport
passport.use(
  new LocalStrategy(function(email, password, done) {
    console.log('LocalStrategy', email, password);
    User.authenticate(email, password)
      // success!!
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, { message: 'There was no user with this email and password.' });
        }
      })
      // there was a problem
      .catch(err => done(err));
  })
);

// store the user's id in the session
passport.serializeUser((user, done) => {
  // console.log('serializeUser');
  done(null, user._id);
});

// get the user from the session based on the id
passport.deserializeUser((id, done) => {
  // console.log('deserializeUser');
  User.findById(id).then(user => done(null, user));
});

//render home page ================================================
const requireLogin = (req, res, next) => {
  console.log('req.user', req.user);
  if (req.user) {
    next();
  } else {
    console.log('Not logged in, redirecting...')
    res.redirect('/login');
  }
};

routes.get('/', requireLogin, function(request, response) {

  User.find()
  .then(userdirectories => response.render('index', {userdirectories: userdirectories, user: request.user}))
  .catch(err => response.send('You did not log in successfully'));
});


routes.get('/login', (req, res) => {
    res.render('login');
  // }
});

routes.get('/register', (req, res) => {
  res.render('register')
})


routes.get('/search', (req, res) => {
  res.render('search')
})

module.exports = routes;
