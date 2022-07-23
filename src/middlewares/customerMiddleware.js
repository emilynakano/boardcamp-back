import connection from "../databases/database.js";
import customerSchema from "../schemas/customerSchema.js";

export default async function customerMiddleware(req, res, next) {
    const {cpf} = req.body;
    const {error} = customerSchema.validate(req.body);
    if(error) {
        return res.sendStatus(400)
    }
    const { rows: costumers } = await connection.query(`
    SELECT cpf FROM customers
    `)
    
    if(costumers.find((customer) => customer.cpf === cpf)) {
        return res.sendStatus(409)
    }
    next()
}