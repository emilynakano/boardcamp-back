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
        const categories = await connection.query('SELECT name FROM categories WHERE name=$1', [name]);

        if(categories.rowCount > 0) {
            return res.sendStatus(409)
        }

        await connection.query(`INSERT INTO categories (name) VALUES ($1)`, [name]);
    
        res.sendStatus(201);

    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }
}