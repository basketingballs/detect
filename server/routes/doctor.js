const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const service = require('../controllers/account.controllers');

router.use(express.json());

// create doctor
router.post('/create', async (req, res) => {
    const { id, name, lastname, email, gender, phone, date, speciality } = req.body;
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

        const data = JSON.parse(atob(token.split('.')[1]));

        if (data.level != 1 || data.type != 'sysadmin') {
            return res.status(400).json({ message: 'sys_admin not allowed!' });
        }

        const persons = await pool.query('SELECT * FROM person WHERE id=$1', [id]);

        if (persons.rowCount != 0) {
            return res.status(400).json({ message: 'person already exists!' });
        }

        const emails = await pool.query('SELECT * FROM account WHERE email=$1', [email]);

        if (emails.rowCount != 0) {
            return res.status(400).json({ message: 'email alredy in use!' });
        }

        const phones = await pool.query('SELECT * FROM account WHERE phone=$1', [phone]);

        if (phones.rowCount != 0) {
            return res.status(400).json({ message: 'phone number alredy in use!' });
        }

        const SysAdmin = await pool.query('SELECT * FROM sys_admin WHERE account_id=$1', [data.id]);

        if (SysAdmin.rowCount == 0) {
            return res.status(400).json({ message: `system admin ${data.id} does not exist!` });
        }

        if (SysAdmin.rows[0].level != 1) {
            return res.status(400).json({ message: `system admin ${data.id} is not allowed to create accounts!` });
        }

        pw = service.passwordGenerator(16);
        const pwhash = service.getHash(pw);

        const newPerson = await pool.query(
            'INSERT INTO person (id,first_name,last_name,birthdate,is_male) VALUES($1, $2, $3, $4,$5) RETURNING *;',
            [id, name, lastname, date, gender]
        );
        const newAccount = await pool.query(
            `INSERT INTO account (pw_hash,email,phone,account_type) VALUES($1, $2, $3, 'doctor') RETURNING account_id;`,
            [pwhash, email, phone]
        );
        const newDoctor = await pool.query(
            `INSERT INTO doctor (person_id,account_id,speciality,created_by) VALUES($1, $2, $3, $4) RETURNING doctor_id;`,
            [id, newAccount.rows[0].account_id, speciality, SysAdmin.rows[0].admin_id]
        );
        const mail = {
            from: 'no-reply@detectplusplus.com',
            to: email,
            subject: 'hello',
            text: `your password is ${pw}`,
        };
        //! console.log
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

// get all doctors

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

router.get('/speciality', async (req, res) => {
    try {
        const spec = await pool.query(`SELECT * FROM speciality`);
        res.json(spec.rows);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

router.post('/delete/:id' ,async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await pool.query(`DELETE FROM doctor WHERE doctor_id=$1 RETURNING *`,[id]);
        res.json({message : 'successfully deleted'});
    } catch (err) {
        res.status(400).json(err.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newDoctor = await pool.query(
            `SELECT * FROM 
                doctor JOIN person
                ON person.id=doctor.person_id 
                JOIN account 
                ON account.account_id=doctor.account_id
                AND doctor_id=$1`,
            [id]
        );
        delete newDoctor.rows[0].pw_hash;
        delete newDoctor.rows[0].person_id;
        res.json(newDoctor.rows[0]);
    } catch (err) {
        res.json(err.message);
    }
});

router.get('/info/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const newDoctor = await pool.query(
            `SELECT cu.unit_id,d.doctor_id,cu.camp_id, ul.lab_id FROM 
                doctor d
                LEFT JOIN unit_doc ud ON d.doctor_id = ud.doctor_id AND ud.status = 1
                LEFT JOIN camp_unit cu ON cu.camp_unit_id = ud.camp_unit_id AND cu.status = 1
                LEFT JOIN unit_lab ul ON ul.camp_unit_id = cu.camp_unit_id AND ul.status = 1
                WHERE d.account_id = $1
                `,
            [id]
        );
        res.json(newDoctor.rows[0]);
    } catch (err) {
        res.json(err.message);
    }
});

module.exports = router;
