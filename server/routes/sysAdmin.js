const express = require('express');
const router = express.Router();
const pool = require('../db');
const service = require('../controllers/account.controllers');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//MIDDLEWARE
router.use(express.json());

// sign up first system admin

router.post('/confirm', async (req, res) => {
    const { email } = req.body;

    try {
        const emails = await pool.query('SELECT * FROM account WHERE email=$1', [email]);

        if (emails.rowCount != 0) {
            res.status(400).json({ message: 'email alredy in use!' });
            return;
        }

        const code = service.passwordGenerator(6);

        const confirmEmail = await pool.query(`INSERT INTO temp_email_confirmation VALUES ($1,$2);`, [email, code]);

        const mail = {
            from: 'no-reply@detectplusplus.com',
            to: email,
            subject: 'conmirmation code',
            text: `your confirmation code is ${code}`,
        };

        service.transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log('email sent ', info.response);
            }
        });

        res.status(200).json({ message: 'a confirmation code was sent to your email ...' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/signup', async (req, res) => {
    const { id, name, lastname, email, pw, gender, phone, date, code } = req.body;
    const pwhash = service.getHash(pw);

    try {
        const confirmEmail = await pool.query('SELECT code , count from temp_email_confirmation WHERE email = $1', [
            email,
        ]);

        if (confirmEmail.rows[0].code != code && confirmEmail.rows[0].count < 2) {
            pool.query('UPDATE temp_email_confirmation SET count = count + 1 WHERE email = $1', [email]);
            res.status(400).json({
                message: `code is wrong dude ${3 - (confirmEmail.rows[0].count + 1)} attempts left`,
            });
            return;
        } else if (confirmEmail.rows[0].code != code && confirmEmail.rows[0].count == 2) {
            res.status(400).json({ message: 'reload and try again!!!', failed: true });
            pool.query('DELETE FROM temp_email_confirmation WHERE email = $1', [email]);
            return;
        }

        pool.query('DELETE FROM temp_email_confirmation WHERE email = $1', [email]);

        const persons = await pool.query('SELECT * FROM person WHERE id=$1', [id]);

        if (persons.rowCount != 0) {
            res.status(400).json({ message: 'person already exists!' });
            return;
        }

        const emails = await pool.query('SELECT * FROM account WHERE email=$1', [email]);

        if (emails.rowCount != 0) {
            res.status(400).json({ message: 'email alredy in use!' });
            return;
        }

        const phones = await pool.query('SELECT * FROM account WHERE phone=$1', [phone]);

        if (phones.rowCount != 0) {
            res.status(400).json({ message: 'phone number alredy in use!' });
            return;
        }

        const nulls = await pool.query('SELECT * FROM sys_admin WHERE created_by is NULL');

        if (nulls.rowCount != 0) {
            res.status(400).json({ message: 'a system admin alredy exists!' });
            return;
        }
        const newPerson = await pool.query(
            'INSERT INTO person (id,first_name,last_name,birthdate,is_male) VALUES($1, $2, $3, $4,$5) RETURNING *;',
            [id, name, lastname, date, gender]
        );
        const newAccount = await pool.query(
            `INSERT INTO account (pw_hash,email,phone,account_type) VALUES($1, $2, $3, 'sysadmin') RETURNING account_id;`,
            [pwhash, email, phone]
        );
        //!
        const newSysAdmin = await pool.query(
            `INSERT INTO sys_admin (person_id,account_id,level) VALUES($1, $2, 1) RETURNING admin_id;`,
            [id, newAccount.rows[0].account_id]
        );
        console.log(newAccount.rows[0].account_id);
        //!
        const initCampaign = await pool.query(
            `INSERT INTO campaign (name,description,status,created_date,created_by) VALUES ('Colorectal cancer','this a protoype campaign intialized on first admin signup',1,CURRENT_DATE,$1);`,
            [newSysAdmin.rows[0].admin_id]
        );

        res.status(200).json({ message: 'created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log(err.message);
    }
});

router.post('/create', async (req, res) => {
    const { id, name, lastname, email, gender, phone, date, level } = req.body;
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

        const SysAdmin = await pool.query('SELECT * FROM sys_admin WHERE admin_id=$1', [data.id]);

        if (SysAdmin.rowCount == 0) {
            return res.status(400).json({ message: `system admin ${data.id} does not exist!` });
        }

        const persons = await pool.query('SELECT * FROM person WHERE id=$1', [id]);

        if (persons.rowCount != 0) {
            res.status(400).json({ message: 'person already exists!' });
            return;
        }

        const emails = await pool.query('SELECT * FROM account WHERE email=$1', [email]);

        if (emails.rowCount != 0) {
            res.status(400).json({ message: 'email alredy in use!' });
            return;
        }

        const phones = await pool.query('SELECT * FROM account WHERE phone=$1', [phone]);

        if (phones.rowCount != 0) {
            res.status(400).json({ message: 'phone number alredy in use!' });
            return;
        }

        pw = service.passwordGenerator(16);
        const pwhash = service.getHash(pw);

        const newPerson = await pool.query(
            'INSERT INTO person (id,first_name,last_name,birthdate,is_male) VALUES($1, $2, $3, $4,$5) RETURNING *;',
            [id, name, lastname, date, gender]
        );
        const newAccount = await pool.query(
            `INSERT INTO account (pw_hash,email,phone,account_type) VALUES($1, $2, $3, 'sysadmin') RETURNING account_id;`,
            [pwhash, email, phone]
        );
        const newSysAdmin = await pool.query(
            `INSERT INTO sys_admin (person_id,account_id,level,created_by) VALUES($1, $2, $3,$4) RETURNING admin_id;`,
            [id, newAccount.rows[0].account_id, level, data.id]
        );

        const mail = {
            from: 'no-reply@detectplusplus.com',
            to: email,
            subject: 'you have been added to Detect++ team',
            text: `your password is ${pw}`,
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
            }
        });
        const SysAdmin = await pool.query(
            `SELECT sys_admin.admin_id,sys_admin.level,person.first_name,person.last_name,account.email,
                        p.last_name as admin_name,sys_admin.status
                        FROM sys_admin
                        JOIN person 
                        ON person.id=sys_admin.person_id
                        JOIN account
                        ON sys_admin.account_id=account.account_id
                        JOIN sys_admin sys
                        ON sys_admin.created_by=sys.admin_id
                        JOIN person p
                        ON p.id = sys.person_id;`
        );
        res.send(SysAdmin.rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await pool.query(`DELETE FROM sys_admin WHERE admin_id=$1 RETURNING *`, [id]);
        res.json({ message: 'successfully deleted' });
    } catch (err) {
        res.status(400).json(err.message);
    }
});

router.get('/campaign', async (req, res) => {
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
        const getCampaign = await pool.query(
            `SELECT campaign.campaign_id,campaign.name,campaign.description,
                        campaign.created_date,campaign.end_date,campaign.start_date ,
                        campaign.status,status.status_text,person.last_name as admin_name
                        FROM campaign
                        JOIN status
                        ON status.status_id = campaign.status
                        JOIN sys_admin
                        ON campaign.created_by = sys_admin.admin_id
                        JOIN person
                        ON person.id = sys_admin.person_id; `
        );
        res.json(getCampaign.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/campaign/unit', async (req, res) => {
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
        const getUnits = await pool.query(
            `SELECT cu.start_date, u.name, l.wilaya, l.baladya, cu.unit_id, cu.camp_unit_id,lab.name as lab_name,
                COUNT(ud.doctor_id) AS active_doctors
                FROM camp_unit cu
                JOIN unit u ON u.unit_id = cu.unit_id
                JOIN static_location l ON l.static_location_id = u.static_location_id
                LEFT JOIN unit_doc ud ON ud.camp_unit_id = cu.camp_unit_id AND ud.status = 1
                LEFT JOIN unit_lab ul ON ul.camp_unit_id = cu.camp_unit_id AND ul.status = 1
                LEFT JOIN laboratory lab ON lab.lab_id = ul.lab_id
                WHERE cu.status = 1
                GROUP BY cu.start_date, u.name, l.wilaya, l.baladya, cu.unit_id, cu.camp_unit_id, lab_name;
                `
        );
        const getInactiveUnits = await pool.query(
            `SELECT cu.start_date, u.name, l.wilaya, l.baladya, cu.status, cu.unit_id, cu.end_date, cu.camp_unit_id,
                COUNT(DISTINCT ud.doctor_id) AS active_doctors
                FROM camp_unit cu
                JOIN unit u ON u.unit_id = cu.unit_id
                JOIN static_location l ON l.static_location_id = u.static_location_id
                LEFT JOIN unit_doc ud ON ud.camp_unit_id = cu.camp_unit_id
                WHERE cu.status = 4
                GROUP BY cu.start_date, u.name, l.wilaya, l.baladya, cu.status, cu.unit_id, cu.end_date, cu.camp_unit_id;
            `
        );
        res.json({ active: getUnits.rows, inactive: getInactiveUnits.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/campaign/unit/add', async (req, res) => {
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
        const { unit_id, campaign_id } = req.body;
        const response = pool.query(
            'INSERT INTO camp_unit (camp_id,unit_id,status,start_date) VALUES ($1,$2,1,CURRENT_DATE)',
            [campaign_id, unit_id]
        );
        return res.json({ message: 'relation created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/campaign/unit/remove', async (req, res) => {
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
        const { unit_id, campaign_id } = req.body;
        const response = pool.query('UPDATE camp_unit set status = 4 WHERE  status = 1 AND unit_id =$1', [unit_id]);

        return res.json({ message: 'relation removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/unit/lab', async (req, res) => {
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
        const getActiveUnitLab = await pool.query(
            `SELECT ul.camp_unit_id , ul.unit_lab_id , ul.status , ul.lab_id , ul.start_date , l.name as lab_name , u.name as unit_name
                FROM unit_lab ul
                JOIN laboratory l ON l.lab_id= ul.lab_id
                JOIN camp_unit cu ON cu.camp_unit_id = ul.camp_unit_id
                JOIN unit u ON u.unit_id = cu.unit_id
                 WHERE ul.status = 1;`
            )
        const getInActiveUnitLab = await pool.query(
            `SELECT ul.camp_unit_id , ul.unit_lab_id , ul.status , ul.lab_id , ul.start_date,ul.end_date , l.name as lab_name , u.name as unit_name,u.unit_id
                FROM unit_lab ul
                JOIN laboratory l ON l.lab_id= ul.lab_id
                JOIN camp_unit cu ON cu.camp_unit_id = ul.camp_unit_id
                JOIN unit u ON u.unit_id = cu.unit_id
                 WHERE ul.status = 4;`
            )
        res.status(200).json({active : getActiveUnitLab.rows, inactive : getInActiveUnitLab.rows})
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/unit/lab/add', async (req, res) => {
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
        const { camp_unit_id, lab_id } = req.body;
        const response = pool.query(
            'INSERT INTO unit_lab (camp_unit_id,lab_id,status,start_date) VALUES ($1,$2,1,CURRENT_DATE)',
            [camp_unit_id, lab_id]
        );
        return res.json({ message: 'unit linked to laboratory successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/unit/lab/remove', async (req, res) => {
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
        const { camp_unit_id, lab_id } = req.body;
        const response = pool.query('UPDATE unit_lab set status = 4 WHERE  status = 1 AND camp_unit_id =$1 AND lab_id=$2', [camp_unit_id,lab_id]);

        return res.json({ message: 'relation removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/unit/doc', async (req, res) => {
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
        const getActiveUnitDoc = await pool.query(
            `SELECT ud.camp_unit_id , ud.unit_doc_id , ud.status , ud.doctor_id , ud.start_date , p.first_name,p.last_name , u.name as unit_name
                FROM unit_doc ud
                JOIN doctor d ON d.doctor_id= ud.doctor_id
                JOIN person p ON p.id = d.person_id
                JOIN camp_unit cu ON cu.camp_unit_id = ud.camp_unit_id
                JOIN unit u ON u.unit_id = cu.unit_id
                 WHERE ud.status = 1;`
            )

        const getInActiveUnitDoc = await pool.query(
            `SELECT ud.camp_unit_id , ud.unit_doc_id , ud.status , ud.doctor_id , ud.end_date ,ud.start_date , p.first_name,p.last_name , u.name as unit_name
                FROM unit_doc ud
                JOIN doctor d ON d.doctor_id= ud.doctor_id
                JOIN person p ON p.id = d.person_id
                JOIN camp_unit cu ON cu.camp_unit_id = ud.camp_unit_id
                JOIN unit u ON u.unit_id = cu.unit_id
                 WHERE ud.status = 4;`
            )
        res.status(200).json({active : getActiveUnitDoc.rows, inactive : getInActiveUnitDoc.rows})
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/unit/doc/add', async (req, res) => {
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
        const { camp_unit_id, doctor_id } = req.body;
        const response = pool.query(
            'INSERT INTO unit_doc (camp_unit_id,doctor_id,status,start_date) VALUES ($1,$2,1,CURRENT_DATE)',
            [camp_unit_id, doctor_id]
        );
        return res.json({ message: 'doctor added to unit successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/unit/doc/remove', async (req, res) => {
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
        const { doctor_id } = req.body;
        const response = pool.query('UPDATE unit_doc set status = 4 WHERE  status = 1 AND doctor_id =$1', [doctor_id]);

        return res.json({ message: 'doctor removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;