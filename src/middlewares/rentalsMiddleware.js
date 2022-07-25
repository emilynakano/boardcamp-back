import connection from '../databases/database.js';

export async function insertRentalsMIddleware (req, res, next) {
    const {customerId, gameId, daysRented } = req.body;
    try {
        const {rows: customers} = await connection.query(`
        SELECT id FROM customers WHERE id=$1
        `, [customerId])
        
        if(customers.length < 1) {
            return res.sendStatus(400)
        }
        const {rows: games} = await connection.query(`
            SELECT "pricePerDay", id, "stockTotal" FROM games WHERE id=$1
            `, [gameId]);
    
        if(games.length < 1) {
            return res.sendStatus(400)
        }
        const {rows: rentals} = await connection.query(`
        SELECT * FROM rentals WHERE "gameId"=$1
        `, [gameId])
    
        if(games[0].stockTotal < rentals.filter((rental)=> rental.returnDate === null).length) {
            return res.sendStatus(400)
        }
        if(daysRented < 1) {
            return res.sendStatus(400)
        }
        res.locals.games = games;
        next();
    } catch {
        res.sendStatus(500)
    }

}
export async function finalizeRentalsMiddleware (req, res, next) {
    try {
        const {rows: rentals} = await connection.query(`
        SELECT * FROM rentals WHERE id=$1
        `, [req.params.id])
    
        if(rentals.length < 1) {
            return res.sendStatus(404)
        }
    
        if(rentals[0].returnDate !== null) {
            return res.sendStatus(400)
        }
        res.locals.rentals = rentals;
        next()
    } catch {
        res.sendStatus(500)
    }

}
export async function deleteRentalsMiddleware (req, res, next) {
    try {
        const {rows: rentals} = await connection.query(`
        SELECT "returnDate" FROM rentals WHERE id=$1`,
        [req.params.id])

        if(rentals.length < 1) {
            return res.sendStatus(404)
        }

        if(rentals[0].returnDate === null) {
            return res.sendStatus(400)
        }
        next()
    } catch {
        res.sendStatus(500)
    }
}