const billRoutes = require('./bills');
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/api/bills', billRoutes);
  app.use('/api/users', userRoutes);

  app.get('/',(req, res) =>{
    res.render('posts/mainpage',{
      title:'Main page'
    });
  });

  app.get('/login',(req, res) =>{
    res.render('posts/login',{
      title:'LOGIN'
    });
  });

  app.get('/register',(req, res) =>{
    res.render('posts/register',{
      title:'Register'
    });
  });

  app.get('/register/mycenter',(req, res) =>{
    res.render('posts/mycenter',{
      title:'My Center'
    });
  });

  app.get('/register/new-bill',(req, res) =>{
    res.render('posts/new-bill',{
      title:'New Bill'
    });
  });

  app.get('/register/allbills',(req, res) =>{
    res.render('posts/allbills',{
      title:'All Bills'
    });
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
