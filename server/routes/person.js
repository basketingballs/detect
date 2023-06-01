const express = require('express');
const router = express.Router();
const pool = require('../db');
const axios = require('axios');

//MIDDLEWARE
router.use(express.json());

// ADD A PERSON
router.post('/', async (req, res) => {
    try {
        const { id, name, lastname, birthdate, sex } = req.body;

        // get persons with the same id as request
        const Person = await axios.get('http://localhost:5000/person/' + id);

        // if already exists
        if (Person != null) {
            throw new Error('person already exists');
        }

        // else
        const newPerson = await pool.query(
            'INSERT INTO person (id,name,lastname,birthdate,sex) VALUES($1, $2, $3,$4,$5) RETURNING *',
            [id, name, lastname, birthdate, sex]
        );
        res.json(newPerson.rows[0]);
    } catch (err) {
        res.send(err.message);
    }
});

//GET ALL PERSONS
router.get('/', async (req, res) => {
    try {
        const allPersons = await pool.query('SELECT * FROM person');
        res.json(allPersons.rows);
    } catch (err) {
        res.send(err.message);
    }
});

//GET A PERSON
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const Person = await pool.query('SELECT * FROM person WHERE id = $1', [id]);
        res.json(Person.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//DELETE A PERSON
router.delete('/:id', async () => {
    try {
        const { id } = req.params;

        const Person = await axios.get('http://localhost:5000/person/' + id);

        if (Person.data == '') {
            throw new Error('person does not exist already');
        }

        const deletedPerson = await pool.query('DELETE FROM person WHERE id=$1 RETURNING *', [id]);
        res.json(deletedPerson.rows[0])
    } catch {
        res.send(err.message);
    }
});

module.exports = router;
