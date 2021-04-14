const billRoutes = require('./bills');
const userRoutes = require('./users');

const constructorMethod = (app) => {
  app.use('/api/bills', billRoutes);
  app.use('/api/users', userRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
