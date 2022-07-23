import { Router } from "express";
import { getCustomers, getOneCustomer, insertCustomers, updateCustomer } from "../controllers/customersController.js";
import customerMiddleware from "../middlewares/customerMiddleware.js";
const customersRouter = Router();

customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getOneCustomer)
customersRouter.post('/customers', customerMiddleware, insertCustomers)
customersRouter.put('/customers/:id', customerMiddleware, updateCustomer)

export default customersRouter