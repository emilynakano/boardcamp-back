import connection from '../databases/database.js';

export async function getCategories (req, res) {
    try {
        const { rows: categories } = await connection.query('SELECT * FROM categories');
        res.send(categories);
    } catch {
        res.sendStatus(500)
    }
}
export async function insertCategories (req, res) {
    const {name} = req.body;
    
    try {
        await connection.query(
            `INSERT INTO categories (name) 
              VALUES ('${name}')`
        );
    
        res.sendStatus(201);
    } catch {
        res.sendStatus(500)
    }
}