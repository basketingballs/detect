const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const service = require('../controllers/account.controllers');

router.use(express.json());

// create subject
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

        if (date) {
        }

        if (!token) {
            return res.status(401).json({ message: 'UnAuthorized' });
        }

        jwt.verify(token, process.env.KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Bad Token' });
            }
        });

        const persons = await pool.query('SELECT * FROM person WHERE id=$1', [id]);

        if (persons.rowCount != 0) {
            return res.status(401).json({ message: 'person already exists' });
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

        const newPerson = await pool.query(
            'INSERT INTO person (id,first_name,last_name,birthdate,is_male) VALUES($1, $2, $3, $4,$5) RETURNING *;',
            [id, name, lastname, date, gender]
        );

        const newLocation = await pool.query(
            'INSERT INTO static_location (wilaya ,dayra,baladya, neighbourhood , postal_code) VALUES($1, $2, $3, $4,$5) RETURNING *;',
            [wilaya, dayra, baladya, neighbourhood, postal_code]
        );

        const newSubject = await pool.query(
            'INSERT INTO subject (person_id,static_location_id,email,phone,created_by) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [id, newLocation.rows[0].static_location_id, email, phone, data.doctor_id]
        );

        const campaign_min_age = await pool.query('SELECT min_age FROM campaign');

        var current_date = new Date();
        var subjet_bdate = new Date(date);

        var age = Math.round((current_date - subjet_bdate) / (365.25 * 24 * 60 * 60 * 1000));
        if (age < campaign_min_age.rows[0].min_age)
            return res.status(401).json({ message: 'Person added to database but not allowed to take the test' });

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

        res.status(200).json({ message: 'created successfully' , data : newSubjectTest.rows[0]});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/tests', async (req, res) => {
    try {
        let response;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json('non authorizated');
        }

        const data = await jwt.verify(token, process.env.KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json('bad token');
            }
            return decoded;
        });

        if (data.type != 'sysadmin') {
            return res.status(401).json('non authorized');
        }

        response = await pool.query(
            `SELECT subject.subject_id,st.test_id,st.test_date , p.first_name ,p.last_name, test_result.value as test_result, p2.first_name as doctor_name, p2.last_name as doctor_lastname,l.name as lab_name,u.name as unit_name
                    FROM subject 
                    JOIN person p ON p.id = subject.person_id
                    JOIN subject_tests st ON subject.subject_id = st.subject_id
                    JOIN doctor d ON d.doctor_id = st.doctor_id
                    JOIN person p2 ON p2.id = d.person_id
                    JOIN laboratory l ON l.lab_id = st.lab_id
                    JOIN unit u ON u.unit_id = st.unit_id
                    JOIN test_result ON test_result.test_result_id = st.test_result
                    ;`
        );
        res.status(200).json(response.rows);
    } catch (err) {
        res.status(500).json('Server error');
    }
});

router.get('/tests/doctor', async (req, res) => {
    try {
        let response;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json('non authorizated');
        }

        const data = await jwt.verify(token, process.env.KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json('bad token');
            }
            return decoded;
        });

        if (data.type != 'doctor') {
            return res.status(401).json('non authorized');
        }

        response = await pool.query('SELECT doctor_id FROM doctor WHERE account_id=$1', [data.id]);

        const doctor_id = response.rows[0].doctor_id;

        response = await pool.query(
            `SELECT subject.subject_id,st.test_id,st.test_date , p.first_name ,p.last_name,test_result.test_result_id, test_result.value as test_result, p2.first_name as doctor_name, p2.last_name as doctor_lastname,l.name as lab_name,u.name as unit_name,camp.name as camp_name
                    FROM subject 
                    JOIN person p ON p.id = subject.person_id
                    JOIN subject_tests st ON subject.subject_id = st.subject_id
                    JOIN doctor d ON d.doctor_id = st.doctor_id
                    JOIN person p2 ON p2.id = d.person_id
                    JOIN laboratory l ON l.lab_id = st.lab_id
                    JOIN unit u ON u.unit_id = st.unit_id
                    JOIN test_result ON test_result.test_result_id = st.test_result
                    JOIN campaign camp ON camp.campaign_id = st.camp_id
                    AND st.doctor_id=$1
                    ;`,
            [doctor_id]
        );
        res.status(200).json(response.rows);
    } catch (err) {
        res.status(500).json('Server error');
    }
});

router.get('/tests/doctor', async (req, res) => {
    try {
        let response;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json('non authorizated');
        }

        const data = await jwt.verify(token, process.env.KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json('bad token');
            }
            return decoded;
        });

        if (data.type != 'lab') {
            return res.status(401).json('non authorized');
        }

        response = await pool.query('SELECT lab_id FROM laboratory WHERE account_id=$1', [data.id]);

        const lab_id = response.rows[0].lab_id;

        response = await pool.query(
            `SELECT subject.subject_id,st.test_id,st.test_date , test_result.value as test_result, p2.first_name as doctor_name, p2.last_name as doctor_lastname,l.name as lab_name,u.name as unit_name
                    FROM subject 
                    JOIN subject_tests st ON subject.subject_id = st.subject_id
                    JOIN doctor d ON d.doctor_id = st.doctor_id
                    JOIN person p2 ON p2.id = d.person_id
                    JOIN laboratory l ON l.lab_id = st.lab_id
                    JOIN unit u ON u.unit_id = st.unit_id
                    JOIN test_result ON test_result.test_result_id = st.test_result
                    AND st.laboratory=$1
                    ;`,
            [lab_id]
        );
        res.status(200).json(response.rows);
    } catch (err) {
        res.status(500).json('Server error');
    }
});

router.get('/person/:id', async (req, res) => {
    try {
        let response;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json('non authorizated');
        }

        const data = await jwt.verify(token, process.env.KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json('bad token');
            }
            return decoded;
        });

        if (data.type != 'doctor') {
            return res.status(401).json('non authorized');
        }
        const { id } = req.params;

        response = await pool.query( `SELECT * FROM person WHERE id = $1;`, [id] );
        if(response.rowCount == 0)
            return res.json('new')
        res.status(200).json(response.rows);
    } catch (err) {
        res.status(500).json('Server error');
    }
});

module.exports = router;
