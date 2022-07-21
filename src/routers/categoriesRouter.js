import { Router } from "express";
import {getCategories, insertCategories} from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get('/categories', getCategories);
categoriesRouter.post('/categories', insertCategories);

export default categoriesRouter;