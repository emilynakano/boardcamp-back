import connection from '../databases/database.js';
import joi from 'joi'

export async function getCategories (req, res) {
    const { rows: categories } = await connection.query('SELECT * FROM categories');
    res.send(categories);
}
export async function insertCategories (req, res) {
    const newCategorie = req.body;

    const categorieSchema = joi.object ({
        name: joi.string().required()
    });

    const {error} = categorieSchema.validate(newCategorie);

    if(error) {
        return res.sendStatus(400)
    }

    const { rows: categories } = await connection.query('SELECT * FROM categories');

    const anotherName = categories.find((element) => element.name === newCategorie.name);

    if(anotherName) {
        return res.sendStatus(409)
    }
    
    await connection.query(
        `INSERT INTO categories (name) 
          VALUES ('${newCategorie.name}')`
    );

    res.sendStatus(201);
}