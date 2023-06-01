const jwt = require("jsonwebtoken");
const pool = require("../db");
const crypto = require("crypto");
const mailer = require("nodemailer");
require("dotenv").config();
// random password generator

exports.passwordGenerator = (len) => {
  let result = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getHash = (str) => {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
};

// random password generator

exports.getHash = (str) => {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
};

const passwordGenerator = (len) => {
  let result = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const transporters = mailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.transporter = mailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// SIGNUP

exports.signup = async (req, res) => {
  const { id, name, lastname, email, pw, gender, phone, date } = req.body;
  const pwhash = getHash(pw);

  try {
    const persons = await pool.query("SELECT * FROM person WHERE id=$1", [id]);

    if (persons.rowCount != 0) {
      res.status(400).json({ message: "person already exists!" });
      return;
    }

    const emails = await pool.query("SELECT * FROM account WHERE email=$1", [
      email,
    ]);

    if (emails.rowCount != 0) {
      res.status(400).json({ message: "email alredy in use!" });
      return;
    }

    const phones = await pool.query("SELECT * FROM account WHERE phone=$1", [
      phone,
    ]);

    if (phones.rowCount != 0) {
      res.status(400).json({ message: "phone number alredy in use!" });
      return;
    }

    const nulls = await pool.query(
      "SELECT * FROM sys_admin WHERE created_by is NULL"
    );

    if (nulls.rowCount != 0) {
      res.status(400).json({ message: "a system admin alredy exists!" });
      return;
    }

    const newPerson = await pool.query(
      "INSERT INTO person (id,first_name,last_name,birthdate,is_male) VALUES($1, $2, $3, $4,$5) RETURNING *;",
      [id, name, lastname, date, gender]
    );
    const newAccount = await pool.query(
      `INSERT INTO account (pw_hash,email,phone,account_type) VALUES($1, $2, $3, 'sysadmin') RETURNING account_id;`,
      [pwhash, email, phone]
    );
    const newSysAdmin = await pool.query(
      `INSERT INTO sys_admin (person_id,account_id,level) VALUES($1, $2, 1) RETURNING admin_id;`,
      [id, newAccount.rows[0].account_id]
    );

    const initCampaign = await pool.query(
      `INSERT INTO campaign (name,description,status,start_date,created_by) VALUES ('Colorectal cancer','this a protoype campaign intialized on first admin signup',1,1);`
    );

    const mail = {
      from: "no-reply@detectplusplus.com",
      to: email,
      subject: "conmirmation code",
      text: `your confirmation code is ${passwordGenerator(6)}`,
    };

    transporters.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email sent ", info.response);
      }
    });

    res.status(200).json({ message: "created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SIGNIN

exports.signin = async (req, res) => {
  try {
    const { email, pw } = req.body;

    const pwhash = getHash(pw);

    const Account = await pool.query("SELECT * FROM account WHERE email=$1", [
      email,
    ]);

    if (Account.rowCount == 0) {
      return res.status(404).json({ message: "invalid email" });
    }
    if (Account.rows[0].pw_hash != pwhash) {
      return res.status(404).json({ message: "wrong password" });
    }

    let User;

    if (Account.rows[0].account_type == "sysadmin") {
      User = await pool.query("SELECT * FROM sys_admin WHERE account_id=$1", [
        Account.rows[0].account_id,
      ]);
    } else if (Account.rows[0].account_type == "doctor") {
      User = await pool.query("SELECT * FROM doctor WHERE account_id=$1", [
        Account.rows[0].account_id,
      ]);
    } else if (Account.rows[0].account_type == "lab") {
      User = await pool.query("SELECT * FROM laboratory WHERE account_id=$1", [
        Account.rows[0].account_id,
      ]);
    }

    if (User.rowCount == 0) {
      return res
        .status(500)
        .json({ message: "account exists but something seems wrong" });
    }

    const Person = await pool.query("SELECT * FROM person WHERE id=$1", [
      User.rows[0].person_id,
    ]);

    const data = {
      id: Account.rows[0].account_id,
      name: Person.rows[0].first_name,
      lastname: Person.rows[0].last_name,
      email: email,
      type: Account.rows[0].account_type,
      machine: req.get("User-Agent"),
    };
    if (Account.rows[0].account_type == "sysadmin") {
      data.level = User.rows[0].level;
    } else if (Account.rows[0].account_type == "doctor") {
      const specialityName = await pool.query(
        "SELECT name FROM speciality WHERE speciality_id=$1",
        [User.rows[0].speciality]
      );
      data.speciality = specialityName.rows[0].name;
    }

    const token = jwt.sign(data, process.env.KEY, { expiresIn: "24h" });

    res.status(200).json({
      token: token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.auth = async (req, res, next) => {
  try {
    token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ message: "UnAuthorized" });
    }
    jwt.verify(token, process.env.KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Bad Token" });
      }
      res.status(200).json({ message: "Authorized" });
      next();
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
