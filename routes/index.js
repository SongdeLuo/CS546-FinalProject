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

  app.get('/todolist', function (request, response) {
    response.render('todolist', {
      pageTitle: 'So Much ToDo!',
      todoItems: todoData.getAll()
    });
  });

  // app.get('/400',(req, res) =>{
  //   res.render('posts/400',{
  //     title:'400 Error'
  //   });
  // });



  // app.get('/404',(req, res) =>{
  //   res.render('posts/404',{
  //     title:'404 Error'
  //   });
  // });
  

  app.use('*', (req, res) => {
    res.status(404).render('posts/404',{
      title:'404 Error'
    });

  //   res.status(404).json({ error:'page not found'});
  });
};

module.exports = constructorMethod;
