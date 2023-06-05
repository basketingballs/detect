const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//MIDDLEWARE
router.use(express.json());

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
        const unit = await pool.query(
            `SELECT unit.unit_id,unit.name,static_location.wilaya,static_location.dayra,
                        static_location.baladya,static_location.neighbourhood,static_location.postal_code
                        ,p.last_name as admin_name from unit 
                        JOIN static_location 
                        ON unit.static_location_id = static_location.static_location_id
                        JOIN sys_admin 
                        ON unit.created_by=sys_admin.admin_id
                        JOIN person p
                        ON sys_admin.person_id = p.id;`
        );
        res.send(unit.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/create', async (req, res) => {
    const { name, wilaya, dayra, baladya, neighbourhood, postal_code } = req.body;
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

        const SysAdmin = await pool.query('SELECT admin_id FROM sys_admin WHERE account_id =$1', [data.id]);

        const newLocation = await pool.query(
            'INSERT INTO static_location (wilaya ,dayra,baladya, neighbourhood , postal_code) VALUES($1, $2, $3, $4,$5) RETURNING *;',
            [wilaya, dayra, baladya, neighbourhood, postal_code]
        );

        const newUnit = await pool.query(
            'INSERT INTO unit (name ,static_location_id,created_by) VALUES($1, $2, $3) RETURNING *;',
            [name, newLocation.rows[0].static_location_id, SysAdmin.rows[0].admin_id]
        );

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

        response = await pool.query('SELECT * FROM camp_unit WHERE unit_id=$1',[id])

        if(response.rowCount != 0){
           return res.status(400).json('unit alredy affected to a campaign deleting it may cause problems')
        }

        response = await pool.query(`DELETE FROM unit WHERE unit_id=$1 RETURNING *`, [id]);

        res.json('successfully deleted');
    } catch (err) {
        res.status(400).json(err.message);
    }
});

router.get('/wilaya', async (req, res) => {
    try {
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

        const wilaya = await pool.query(`SELECT * FROM wilaya;`);
        res.json(wilaya.rows);
    } catch (err) {
        res.status(500).json(err.message);
    }
});

module.exports = router;
