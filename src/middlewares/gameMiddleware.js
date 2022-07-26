import gameSchema from "../schemas/gameSchema.js";

export default async function gameMiddleware(req, res, next) {
    const {name, stockTotal, categoryId, pricePerDay} = req.body;

    const {error} = gameSchema.validate({name, stockTotal, pricePerDay, categoryId});
  
    if(error) {
        return res.sendStatus(400);
    }
     
    next();
}