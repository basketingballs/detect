const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const service = require('../controllers/account.controllers');

router.use(express.json());

// create doctor
router.post('/create', async (req, res) => {
    const {
        id,
        name,
        lastname,
        date,
        gender,
        email,
        phone,
        wilaya,
        dayra,
        baladya,
        neighbourhood,
        postal_code,
        is_smoker,
        diet,
        data,
    } = req.body;
    try {
        token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json({ message: 'UnAuthorized' });
        }

        jwt.verify(token, process.env.KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Bad Token' });
            }
        });

        const persons = await pool.query('SELECT * FROM person WHERE id=$1', [id]);
        let person = null;
        if (persons.rowCount != 0) {
            person = persons.rows[0].person_id;
        }

        const emails = await pool.query('SELECT * FROM account WHERE email=$1', [email]);

        if (emails.rowCount != 0) {
            return res.status(400).json({ message: 'email alredy in use!' });
        }

        const phones = await pool.query('SELECT * FROM account WHERE phone=$1', [phone]);

        if (phones.rowCount != 0) {
            return res.status(400).json({ message: 'phone number alredy in use!' });
        }

        const Doctor = await pool.query('SELECT * FROM doctor WHERE doctor_id=$1', [data.doctor_id]);

        if (Doctor.rowCount == 0) {
            return res.status(400).json({ message: `Doctor does not exist!` });
        }

        if (person == null) {
            const newPerson = await pool.query(
                'INSERT INTO person (id,first_name,last_name,birthdate,is_male) VALUES($1, $2, $3, $4,$5) RETURNING *;',
                [id, name, lastname, date, gender]
            );
        }

        const newLocation = await pool.query(
            'INSERT INTO static_location (wilaya ,dayra,baladya, neighbourhood , postal_code) VALUES($1, $2, $3, $4,$5) RETURNING *;',
            [wilaya, dayra, baladya, neighbourhood, postal_code]
        );

        const newSubject = await pool.query(
            'INSERT INTO subject (person_id,static_location_id,email,phone,created_by) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [id, newLocation.rows[0].static_location_id, email, phone, data.doctor_id]
        );
        const newSubjectTest = await pool.query(
            'INSERT INTO subject_tests (subject_id ,doctor_id,unit_id,lab_id,camp_id,test_result) VALUES ($1,$2,$3,$4,$5,4) RETURNING *',
            [newSubject.rows[0].subject_id, data.doctor_id, data.unit_id, data.lab_id, data.camp_id]
        );

        const newTestData = await pool.query(
            'INSERT INTO test_data (test_id,is_smoker,eat_before_test) VALUES ($1,$2,$3)',
            [newSubjectTest.rows[0].test_id, is_smoker, diet]
        );
        const mail = {
            from: 'no-reply@detectplusplus.com',
            to: email,
            subject: 'hello',
            text: `you have successfully conducted a colorectal cancer screening, you will be informedof the results as soo as possible`,
        };

        service.transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('email sent ', info.response);
            }
        });

        res.status(200).json({ message: 'created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'UnAuthorized' });
        }
        jwt.verify(token, process.env.KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Bad Token' });
            } else {
                const doctor = await pool.query(
                    `SELECT doctor.doctor_id,person.first_name,person.last_name,speciality.name as speciality,account.email,p.last_name as admin_name,person.created_date,doctor.status
                        FROM doctor JOIN person
                        ON person.id=doctor.person_id 
                        JOIN sys_admin 
                        ON doctor.created_by=sys_admin.admin_id
                        JOIN person p
                        ON sys_admin.person_id = p.id
                        JOIN speciality
                        ON doctor.speciality=speciality.speciality_id
                        JOIN account
                        ON doctor.account_id=account.account_id;`
                );
                res.json(doctor.rows);
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await pool.query(`DELETE FROM doctor WHERE doctor_id=$1 RETURNING *`, [id]);
        res.json({ message: 'successfully deleted' });
    } catch (err) {
        res.status(400).json(err.message);
    }
});

module.exports = router;