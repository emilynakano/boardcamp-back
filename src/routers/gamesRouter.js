import { Router } from 'express';
import { getGames, insertGames } from '../controllers/gamesController.js';

const gamesRouter = Router();

gamesRouter.get('/games', getGames)
gamesRouter.post('/games', insertGames)

export default gamesRouter;