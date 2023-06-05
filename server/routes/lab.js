const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('nodemailer');

const transporter = mailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'green.anderson21@ethereal.email',
        pass: 'aMWRfgSuE6F3zmvx5V',
    },
});

//MIDDLEWARE
router.use(express.json());

// hash function

function getHash(str) {
    const hash = crypto.createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
}

// random password generator

function passwordGenerator(len) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$';
    for (let i = 0; i < len; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}



router.get('/all', async (req, res) => {
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
        const lab = await pool.query(
                    `SELECT laboratory.lab_id,laboratory.name,static_location.wilaya,static_location.dayra,
                        static_location.baladya,static_location.neighbourhood,static_location.postal_code,account.email,
                        p.last_name as admin_name 
                        FROM laboratory 
                        JOIN static_location 
                        ON laboratory.static_location_id = static_location.static_location_id
                        JOIN sys_admin 
                        ON laboratory.created_by=sys_admin.admin_id
                        JOIN person p
                        ON sys_admin.person_id = p.id
                        JOIN account
                        ON account.account_id = laboratory.account_id;`
                );
                res.send(lab.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});



router.post('/create', async (req, res) => {
    const { name,wilaya ,dayra,baladya, neighbourhood , postal_code,email,phone } = req.body;
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

        pw = passwordGenerator(16);
        const pwhash = getHash(pw);

        const newAccount = await pool.query(
            `INSERT INTO account (pw_hash,email,phone,account_type) VALUES($1, $2, $3, 'lab') RETURNING account_id;`,
            [pwhash, email, phone]
        );

        const newLocation = await pool.query(
            'INSERT INTO static_location (wilaya ,dayra,baladya, neighbourhood , postal_code) VALUES($1, $2, $3, $4,$5) RETURNING *;',
            [wilaya, dayra, baladya, neighbourhood, postal_code]
        );

        const newLab = await pool.query(
            'INSERT INTO laboratory (name ,static_location_id,account_id,created_by) VALUES($1, $2, $3,$4) RETURNING *;',
            [name, newLocation.rows[0].static_location_id, newAccount.rows[0].account_id, SysAdmin.rows[0].admin_id]
        );

        const mail = {
            from: 'no-reply@detectplusplus.com',
            to: email,
            subject: 'hello',
            text: `your password is ${pw}`,
        };

        transporter.sendMail(mail, (err, info) => {
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

router.post('/delete/:id', async (req, res) => {
    try {
        let response;
        const token = req.headers['authorization'];

        if (!token) {
            return res.status(401).json('non authorizated')
        }

        const data = await jwt.verify(token, process.env.KEY, async (err, decoded) => {
            if (err) {
                return res.status(403).json('bad token');
            }
            return decoded
        });

        if(data.type != 'sysadmin' || data.level != 1){
            return res.status(401).json('non authorizated')
        }

        const { id } = req.params;

        response = await pool.query('SELECT * FROM unit_lab WHERE lab_id=$1',[id])

        if(response.rowCount != 0){
           return res.status(400).json('laboratory is alredy affected to a unit deleting them may cause problems')
        }

        response = await pool.query(`DELETE FROM laboratory WHERE lab_id=$1 RETURNING *`, [id]);

        res.json('successfully deleted');
    } catch (err) {
        res.status(400).json(err.message);
    }
});

module.exports = router;
