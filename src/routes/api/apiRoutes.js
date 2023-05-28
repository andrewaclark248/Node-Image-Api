import express from 'express';
const apiRoutes = express.Router();
import {show} from "./../../controllers/apiController.js";

//api route
apiRoutes.get('/images', show);



export default apiRoutes;