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

  const {rows: categories} = await connection.query(`
  SELECT * FROM categories
  `)
  const { rows: isANotherName } = await connection.query(`
  SELECT * FROM games WHERE name='${name}'
  `)

  const gameSchema = joi.object({
    name: joi.string().required(),
    stockTotal: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().min(1).required(),
    categoryId: joi.valid(...categories.map((game) => game.id)).required()
  });

  const {error} = gameSchema.validate({name, stockTotal, pricePerDay, categoryId});
  
  if(error) {
    return res.sendStatus(400);
  }
  if(isANotherName.length > 0) {
    return res.sendStatus(409)
  }
  await connection.query(`
  INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${name}', '${image}', ${stockTotal}, ${categoryId}, ${pricePerDay})
  `)
  res.sendStatus(200)
}