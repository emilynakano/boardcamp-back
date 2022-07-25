import connection from '../databases/database.js'

export async function getGames(req, res) {
  const name = req.query.name;
  try {
    if(name) {
      const { rows: games } = await connection.query(`
      SELECT games.*, categories.name as "categoryName"
      FROM games 
      JOIN categories 
      ON games."categoryId"=categories.id
      WHERE LOWER( games.name ) LIKE '${name}%'
      `);
      return res.send(games);
    } else {
      const { rows: games } = await connection.query(`
      SELECT games.*, categories.name as "categoryName"
      FROM games 
      JOIN categories 
      ON games."categoryId"=categories.id
      `);
      return res.send(games);
    }
  } catch {
    res.sendStatus(500)
  }

    
}
export async function insertGames (req, res) {
  const {name, image, stockTotal, categoryId, pricePerDay} = req.body;
  try {
    await connection.query(`
    INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${name}', '${image}', ${stockTotal}, ${categoryId}, ${pricePerDay})
    `)
    res.sendStatus(200)
  } catch {
    res.sendStatus(500)
  }

}