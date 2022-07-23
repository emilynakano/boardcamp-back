import categorieSchema from "../schemas/categorieSchema.js"
import connection from "../databases/database.js";

export default async function categorieMiddleware (req, res, next) {
    const {name} = req.body;

    const {error} = categorieSchema.validate(req.body);

    if(error) {
        return res.sendStatus(400)
    }
    const { rows: categories } = await connection.query('SELECT name FROM categories');

    if(categories.find((categorie) => categorie.name === name)) {
        return res.sendStatus(409)
    }

    next();
}