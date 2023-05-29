import express from 'express';
const routes = express.Router();

//define a route handler for the default home page
routes.get('/', (req, res) => {
  res.send('main page');
});

export default routes;
