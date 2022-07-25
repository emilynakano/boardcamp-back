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

    const games = res.locals.games;

    const rentDate = dayjs().format('YYYY/MM/DD');
    const originalPrice = games[0].pricePerDay * daysRented;
    
    try {
        await connection.query(`
        INSERT INTO rentals 
        ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
        VALUES (${customerId}, ${gameId}, '${rentDate}', ${daysRented}, null, ${originalPrice}, null);
        `);
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
    
}
export async function finalizeRent (req, res) {
    const rentals = res.locals.rentals;

    try {
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

        await connection.query(`
        DELETE FROM rentals WHERE id=$1
        `, [req.params.id])
        
        res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
}