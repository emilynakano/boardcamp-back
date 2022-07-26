import connection from '../databases/database.js';

export async function getCustomers (req, res) {
    const cpf = req.query.cpf;

    try {
        let clauseWhere = '';

        if(cpf) {
            clauseWhere += `WHERE customers.cpf LIKE '${cpf}%'`
        }
        
        const {rows: customers} = await connection.query(`
        SELECT * FROM customers
        ${clauseWhere}
        `)

        res.send(customers)

    } catch(error) {
        console.log(error)
        res.sendStatus(500)
    }

}
export async function getOneCustomer (req, res) {
    try {
        const {rows: customer, rowCount} = await connection.query(`
        SELECT * FROM customers WHERE id=$1`, [req.params.id])

        if(rowCount === 0) {
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
        const { rowCount } = await connection.query(`
        SELECT cpf FROM customers WHERE cpf=$1`, [cpf])
        
        if(rowCount > 0) {
            return res.sendStatus(409)
        }

        await connection.query(`
        INSERT INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4)`, [name, phone, cpf, birthday]);
        
        res.sendStatus(201)

    } catch {
        res.sendStatus(500)
    }
}
export async function updateCustomer (req, res) {
    const id = req.params.id;
    const {name, phone, cpf, birthday} = req.body;

    try {
        const { rowCount } = await connection.query(`
        SELECT cpf FROM customers WHERE cpf=$1`, [cpf])
        
        if(rowCount > 0) {
            return res.sendStatus(409)
        }

        await connection.query(`
        UPDATE customers 
        SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5`, 
        [name, phone, cpf, birthday, id])

        res.sendStatus(200)
        
    } catch {
        res.sendStatus(500)
    }
}