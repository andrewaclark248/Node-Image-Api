import express from 'express';
const apiRoutes = express.Router();
import AuthController from "./../../controllers/apiController.js";

//api route
apiRoutes.get('/images', AuthController.show);



export default apiRoutes;