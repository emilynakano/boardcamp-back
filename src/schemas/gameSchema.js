import joi from 'joi'
import connection from '../databases/database.js';

const {rows: categories} = await connection.query(`
  SELECT * FROM categories
`)

const gameSchema = joi.object({
    name: joi.string().required(),
    stockTotal: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().min(1).required(),
    categoryId: joi.valid(...categories.map((game) => game.id)).required()
  });

export default gameSchema