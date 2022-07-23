import connection from '../databases/database.js'
import joi from 'joi';

export async function getGames(req, res) {
  const name = req.query.name;

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
    
}
export async function insertGames (req, res) {
  const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

  await connection.query(`
  INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${name}', '${image}', ${stockTotal}, ${categoryId}, ${pricePerDay})
  `)
  res.sendStatus(200)
}