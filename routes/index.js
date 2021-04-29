const billRoutes = require('./bills');
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/api/bills', billRoutes);
  app.use('/api/users', userRoutes);

  app.get('/',(req, res) =>{
    if (req.session.user) {
      res.redirect('/api/users/new-bill');
    } else{
      res.render('posts/mainpage',{
      title:'Main page'
    });
    }

  });

  app.get('/400',(req, res) =>{
    res.render('posts/400',{
      title:'400 Error'
    });
  });

  app.get('/404',(req, res) =>{
    res.render('posts/404',{
      title:'404 Error'
    });
  });
  

  app.use('*', (req, res) => {
    res.status(404).json({ error:'page not found'});
  });
};

module.exports = constructorMethod;
