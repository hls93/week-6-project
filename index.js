const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

const createRoutes = require('./routes/createRoutes');
const loginRoutes = require('./routes/loginForm');

const User = require('./models/login');
const Snippet = require('./models/snippet')

// create express app
const app = express();

app.use(express.static('public'));

// tell express to use handlebars
app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');

//tell express to use the bodyParser middleware to parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'mouse',
    resave: false,
    saveUninitialized: true
  })
);

app.use((req, res, next) => {
  if (!req.session.users)
    req.session.users = []
  console.log(req.session);
  next();
});
// use my routes========================================
app.get('/search', (req, res) => {
  res.render('search')
})
// app.get('/create', (req, res) => {
//   res.render('create')
// })
app.use('/', loginRoutes);
app.use('/addSnippet', createRoutes);

//render home page =============================================================
const requireLogin = (req, res, next) => {
  console.log('req.user', req.user);
  if (req.user) {
    next();
  } else {
    console.log('Not logged in, redirecting...')
    res.redirect('/login');
  }
};

app.get('/', requireLogin, function(req, res) {

    Snippet.find()
      .then((snippet) => {
        res.render('home', {user: req.user, snippet: snippet})
      })
      .catch(err => res.send('nope'))
});

//remove==============================

app.get('/deleteSnippet', (req, res) => {
  Snippet.findById(req.query.id)
    .remove()
    // then redirect to the homepage
    .then(() => res.redirect('/'));
});

//logout========================================================================
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});

mongoose
  // connect to mongo via mongoose
  .connect('mongodb://localhost:27017/newdb', { useMongoClient: true })
  .then(() => app.listen(3000, () => console.log('ready to roll!!')));
