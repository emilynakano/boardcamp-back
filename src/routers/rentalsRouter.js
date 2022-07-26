import { Router } from "express";
import { getRentals, insertRentals, finalizeRent, deleteRent } from "../controllers/rentalsController.js";
const rentalsRouter = Router();

rentalsRouter.get('/rentals', getRentals);
rentalsRouter.post('/rentals', insertRentals);
rentalsRouter.post('/rentals/:id/return', finalizeRent);
rentalsRouter.delete('/rentals/:id', deleteRent)

export default rentalsRouter