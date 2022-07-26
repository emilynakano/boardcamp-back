import connection from "../databases/database.js";
import customerSchema from "../schemas/customerSchema.js";

export default async function customerMiddleware(req, res, next) {
    const {error} = customerSchema.validate(req.body);
    
    if(error) {
        return res.sendStatus(400)
    }

    next()
}