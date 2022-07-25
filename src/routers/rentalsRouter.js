import { Router } from "express";
import { getRentals, insertRentals, finalizeRent, deleteRent } from "../controllers/rentalsController.js";
import {insertRentalsMIddleware, finalizeRentalsMiddleware, deleteRentalsMiddleware} from "../middlewares/rentalsMiddleware.js";
const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', insertRentalsMIddleware, insertRentals);
rentalsRouter.post('/rentals/:id/return', finalizeRentalsMiddleware, finalizeRent);
rentalsRouter.delete('/rentals/:id', deleteRentalsMiddleware, deleteRent)

export default rentalsRouter