import express from 'express';
const routes = express.Router();
var ApiController = require("./../../controllers/apiController")

//api route
routes.get('/images', ApiController.show);

export default apiRoutes;