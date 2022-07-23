import connection from '../databases/database.js';
import joi from 'joi'

export async function getCategories (req, res) {
    const { rows: categories } = await connection.query('SELECT * FROM categories');
    res.send(categories);
}
export async function insertCategories (req, res) {
    const {name} = req.body;
    
    await connection.query(
        `INSERT INTO categories (name) 
          VALUES ('${name}')`
    );

    res.sendStatus(201);
}