import connection from '../databases/database.js';
import dayjs from 'dayjs'

export async function getRentals (req, res) {
    const {customerId, gameId} = req.query;
    
    let rentalJoin = []

    try {
        if(customerId) {
            const {rows: rentals} = await connection.query(`
            SELECT * FROM rentals WHERE "customerId"=$1`,
            [customerId])
    
            if(rentals.length < 1) {
                return res.sendStatus(404)
            }
            for(let i = 0; i < rentals.length; i ++) {
                const {rows: games} = await connection.query(`
                SELECT games.id, games.name, games."categoryId", categories.name as "categoryName"
                FROM games 
                JOIN categories
                ON games."categoryId"=categories.id
                WHERE games.id=$1,`
                [rentals[i].gameId])
                const {rows: customer} = await connection.query(`
                SELECT id, name FROM customers WHERE id=$1`,
                [rentals[i].customerId])
                rentalJoin.push({...rentals[i], game: games[0], customer: customer[0]})
            }
            return res.send(rentalJoin)
        }
        if(gameId) {
            const {rows: rentals} = await connection.query(`
            SELECT * FROM rentals WHERE "gameId"=$1`,
            [gameId])
            if(rentals.length < 1) {
                return res.sendStatus(404)
            }
            for(let i = 0; i < rentals.length; i ++) {
                const {rows: games} = await connection.query(`
                SELECT games.id, games.name, games."categoryId", categories.name as "categoryName"
                FROM games 
                JOIN categories
                ON games."categoryId"=categories.id
                WHERE games.id=$1`,
                [rentals[i].gameId])
                const {rows: customer} = await connection.query(`
                SELECT id, name FROM customers WHERE id=$1`,
                [rentals[i].customerId])
                rentalJoin.push({...rentals[i], game: games[0], customer: customer[0]})
            }
            return res.send(rentalJoin)
        }
    
        const {rows: rentals} = await connection.query(`
        SELECT * FROM rentals 
        `)
        
        for(let i = 0; i < rentals.length; i ++) {
            const {rows: games} = await connection.query(`
            SELECT games.id, games.name, games."categoryId", categories.name as "categoryName"
            FROM games 
            JOIN categories
            ON games."categoryId"=categories.id
            WHERE games.id=$1`, 
            [rentals[i].gameId])
    
            const {rows: customer} = await connection.query(`
            SELECT id, name FROM customers WHERE id=$1`,
            [rentals[i].customerId])
    
            rentalJoin.push({...rentals[i], game: games[0], customer: customer[0]})
        }
        res.send(rentalJoin)
    } catch {
        res.sendStatus(500)
    }

}
export async function insertRentals (req, res) {
    const {customerId, gameId, daysRented } = req.body;
    
    try {
        const {rowCount: customerRowCount} = await connection.query(`
        SELECT id FROM customers WHERE id=$1
        `, [customerId])
        
        if(customerRowCount === 0) {
            return res.sendStatus(400)
        }
        const {rows: games, rowCount: gameRowCount} = await connection.query(`
            SELECT * FROM games WHERE id=$1
            `, [gameId]);
        
        if(gameRowCount === 0) {
            return res.sendStatus(400)
        }
        const { rowCount: rentalRowCount} = await connection.query(`
        SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS null
        `, [gameId])
        
        if(games[0].stockTotal < rentalRowCount) {
            return res.sendStatus(400)
        }
        if(daysRented < 1) {
            return res.sendStatus(400)
        }

        const rentDate = dayjs().format('YYYY/MM/DD');
        const originalPrice = games[0].pricePerDay * daysRented;

        await connection.query(`
        INSERT INTO rentals 
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

        res.sendStatus(200)

    } catch {
        res.sendStatus(500)
    }
    
}
export async function finalizeRent (req, res) {

    try {
        const {rows: rentals, rowCount} = await connection.query(`
        SELECT * FROM rentals WHERE id=$1
        `, [req.params.id])
    
        if(rowCount === 0) {
            return res.sendStatus(404)
        }
    
        if(rentals[0].returnDate) {
            return res.sendStatus(400)
        }
        
        const {rows: game} = await connection.query(`
        SELECT * FROM  games WHERE id=$1
        `, [rentals[0].gameId])
    
        const date1 = dayjs(dayjs().format('YYYY/MM/DD'))
        const date2 = dayjs(rentals[0].rentDate)
        const diasLater = date1.diff(date2) / 60000 / 60 / 24;
    
        await connection.query(`
        UPDATE rentals 
        SET "returnDate"='${dayjs().format('YYYY/MM/DD')}', "delayFee"=${diasLater * game[0].pricePerDay}
        WHERE id=$1
        `, [req.params.id])

        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }

}
export async function deleteRent (req, res) {
    try {
        const {rowCount, rows:rentals} = await connection.query(`
        SELECT "returnDate" FROM rentals WHERE id=$1`,
        [req.params.id])

        if(rowCount === 0) {
            return res.sendStatus(404)
        }

        if(rentals[0].returnDate === null) {
            return res.sendStatus(400)
        }

        await connection.query(`
        DELETE FROM rentals WHERE id=$1
        `, [req.params.id])
        
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
}