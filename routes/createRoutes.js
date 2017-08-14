const express = require('express');
const routes = express.Router();
const User = require('../models/login');
const Snippet = require('../models/snippet')
const flash = require('express-flash-messages');
const bodyParser = require('body-parser');


routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({extended: false}));


//search page===================================================================
routes.get('/search', (req, res) => {
  let search = req.query.mySnippets

  // Snippet.find([{'language': search}, {tags: search}])
  // .then(snippets => res.render('search', {snippet: snippet}))
  // .catch(err => res.send('can not find'))
  res.render('search')
  // console.log('search');
});

//create========================================
routes.get('/create', (req, res) => {
  if (req.query.id) {
    Snippet.findById(req.query.id)

      .then(snippet => res.render('create', {
        snippet: snippet
      }));
  } else {
    res.render('create');
  }
  // res.render('create', {user: req.user})
})

routes.post('/new', (req, res) => {
  if (req.body.id) {
    Snippet.findById(req.body.id)
  }
  else {
    new Snippet(req.body)
      .save()
      // then redirect to the homepage
      .then(() => res.redirect('/'))
      // catch validation errors
      .catch(err => {
        console.log(err.errors);
        res.render('create', {
          errors: err.errors,
          snippet: req.body
        })
      })
  }
  // let snippet = new Snippet(req.body)
  // snippet.provider = 'local';
  //
  // snippet
  //   .save()
  //   .then(() => res.redirect('/'))
  //   .catch(err => console.log(err))
});


module.exports = routes;
