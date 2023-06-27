import express from 'express';
const routes = express.Router();
import { Request, Response } from 'express';

//define a route handler for the default home page
routes.get('/', (req: Request, res: Response): void => {
  res.send('main page');
});

export default routes;
