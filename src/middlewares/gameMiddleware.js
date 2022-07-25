import connection from "../databases/database.js";
import gameSchema from "../schemas/gameSchema.js";

export default async function gameMiddleware(req, res, next) {
    const {name, stockTotal, categoryId, pricePerDay} = req.body;

    const {error} = gameSchema.validate({name, stockTotal, pricePerDay, categoryId});
  
    if(error) {
        return res.sendStatus(400);
    }
    try {
        const { rows: games } = await connection.query(`
        SELECT name FROM games
        `)
        
        if(games.find((game) => game.name === name)) {
            return res.sendStatus(409)
        }
        next();
    } catch {
        res.sendStatus(500)
    }
}