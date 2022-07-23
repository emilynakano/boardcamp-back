import { Router } from 'express';
import { getGames, insertGames } from '../controllers/gamesController.js';
import gameMiddleware from '../middlewares/gameMiddleware.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames)
gamesRouter.post('/games', gameMiddleware, insertGames)

export default gamesRouter;