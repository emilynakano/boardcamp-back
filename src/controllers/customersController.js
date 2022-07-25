import connection from '../databases/database.js';

export async function getCustomers (req, res) {
    const cpf = req.query.cpf;

    try {
        if(cpf) {
            const {rows: customers} = await connection.query(`
            SELECT * FROM customers
            WHERE customers.cpf LIKE '${cpf}%'
            `)
            return res.send(customers)
        }
        const {rows: customers} = await connection.query(`
        SELECT * FROM customers
        `)
        res.send(customers)
    } catch {
        res.sendStatus(500)
    }

}
export async function getOneCustomer (req, res) {
    try {
        const {rows: customer} = await connection.query(`
        SELECT * FROM customers WHERE id=$1`, [req.params.id])
        if(customer.length < 1) {
            return res.sendStatus(404);
        }
        res.send(customer)
    } catch {
        res.sendStatus(500)
    }
}

export async function insertCustomers(req, res) {
    const {name, phone, cpf, birthday} = req.body;
    try {
        await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ('${name}', '${phone}', '${cpf}', '${birthday}');
        `);
        res.sendStatus(201)
    } catch {
        res.sendStatus(500)
    }
}
export async function updateCustomer (req, res) {
    const id = req.params.id;
    const {name, phone, cpf, birthday} = req.body;

    try {
        await connection.query(`
        UPDATE customers SET name='${name}', phone='${phone}', cpf='${cpf}', birthday='${birthday}' WHERE id=${id}
    `)
    res.sendStatus(200)
    } catch {
        res.sendStatus(500)
    }
}