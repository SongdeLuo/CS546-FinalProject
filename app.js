const express = require('express');
const app = express();
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
const session = require('express-session');


app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'AuthCookie',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 60000*60*24*7,
    
    }
  })
);

app.use('/api/users/new-bill', (req, res, next) => {
  //console.log(req.session.user);
  if (req.session.user) {
      res.render('posts/new-bill');
      next();
  } else {
    
      res.redirect('/api/users/login');
      next();
  }
});

app.use('/api/users/mycenter', (req, res, next) => {
  //console.log(req.session.user);
  if (req.session.user) {
      res.render('posts/mycenter');
      next();
  } else {
    
      res.redirect('/api/users/login');
      next();
  }
});


app.use('/api/users/allbills', (req, res, next) => {
  //console.log(req.session.user);
    if (req.session.user) {
      res.render('posts/allbills'
      ,{
        title:"All Bills",
        userId:req.session.user.userId
      });
      next();
  } else {
    //console.log("看看undefined 是不是会进来");
      res.redirect('/api/users/login');
      next();
  }
});

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
configRoutes(app);
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
