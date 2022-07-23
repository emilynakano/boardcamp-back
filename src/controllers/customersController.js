import connection from '../databases/database.js';
import DateExtension from '@joi/date';
import Joi from 'joi';
const joi = Joi.extend(DateExtension)

export async function getCustomers (req, res) {
    const {rows: customers} = await connection.query(`
    SELECT * FROM customers
    `)
    res.send(customers)
}
export async function getOneCustomer (req, res) {
    const id = req.params.id;
    const {rows: customer} = await connection.query(`
    SELECT * FROM customers WHERE id=${id}
    `)
    if(customer.length < 1) {
        return res.sendStatus(404);
    }
    res.send(customer)
}

export async function insertCustomers(req, res) {
    const {name, phone, cpf, birthday} = req.body;
    
    await connection.query(`
    INSERT INTO customers (name, phone, cpf, birthday) 
    VALUES ('${name}', '${phone}', '${cpf}', '${birthday}');
    `);
    res.sendStatus(200)
}
export async function updateCustomer (req, res) {
    const id = req.params.id;
    const {name, phone, cpf, birthday} = req.body;

    await connection.query(`
        UPDATE customers SET name='${name}', phone='${phone}', cpf='${cpf}', birthday='${birthday}' WHERE id=${id}
    `)
    res.sendStatus(200)
}