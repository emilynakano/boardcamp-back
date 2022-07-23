import { Router } from "express";
import {getCategories, insertCategories} from "../controllers/categoriesController.js";
import categorieMiddleware from "../middlewares/categorieMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', categorieMiddleware, insertCategories);

export default categoriesRouter;