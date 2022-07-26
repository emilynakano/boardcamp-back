import connection from '../databases/database.js'

export async function getGames(req, res) {
  const name = req.query.name;
  let clauseWhere = ''
  try {
    if(name) {
      clauseWhere = `WHERE LOWER( games.name ) LIKE '${name}%'`
    } 

    const { rows: games } = await connection.query(`
    SELECT games.*, categories.name as "categoryName"
    FROM games 
    JOIN categories 
    ON games."categoryId"=categories.id
    ${clauseWhere}
    `);

    res.send(games);
  } catch {
    res.sendStatus(500)
  }  
}
export async function insertGames (req, res) {
  const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

  try {
    const { rowCount } = await connection.query(` 
    SELECT name FROM games WHERE name=$1`, [name])
        
    if(rowCount > 0) {
      return res.sendStatus(409)
    }

    await connection.query(`
    INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") 
    VALUES ($1, $2, $3, $4, $5)
    `, [name, image, stockTotal, categoryId, pricePerDay])

    res.sendStatus(200)

  } catch {
    res.sendStatus(500)
  }

}