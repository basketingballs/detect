const jwt = require("jsonwebtoken");//for generating and verifying JSON Web Tokens (JWT).
const pool = require("../db");//to access the database.
const crypto = require("crypto");//for cryptographic operations (hashing)
const mailer = require("nodemailer");//for sending emails
require("dotenv").config();//load environment variables from a .env 


//hash a string
const getHash = (str) => {
  const hash = crypto.createHash("sha256");//create a hash object using the SHA256 algorithm
  hash.update(str);//update hash with str
  return hash.digest("hex");//returns the result as a hexadecimal string
};
//generates a random password of a specified length
const passwordGenerator = (len) => {
  let result = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$";
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
//sending emails
const transporters = mailer.createTransport({
  host: "smtp.ethereal.email",// connect to a fictional SMTP server (smtp.ethereal.email)
  port: 587,
  auth: {//authentication information
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


//EXPORTS

// SIGNUP
exports.signup = async (req, res) => {
  const { id, name, lastname, email, pw, gender, phone, date } = req.body;//retrieves the request data
  const pwhash = getHash(pw);

  try {
    //CHECKS IN DB

    //get persons from db that has this id
    const persons = await pool.query("SELECT * FROM person WHERE id=$1", [id]);
    //if it already exists person/s in DB with this id
    if (persons.rowCount != 0) {
      res.status(400).json({ message: "person already exists!" });
      return;
    }
    const emails = await pool.query("SELECT * FROM account WHERE email=$1", [
      email,
    ]);
    //if it already exists account/s in DB with this email
    if (emails.rowCount != 0) {
      res.status(400).json({ message: "email alredy in use!" });
      return;
    }

    const phones = await pool.query("SELECT * FROM account WHERE phone=$1", [
      phone,
    ]);
    //if it already exists account/s in DB with this phone number
    if (phones.rowCount != 0) {
      res.status(400).json({ message: "phone number alredy in use!" });
      return;
    }
    //checks if a system admin already exists in the database by searching for a record with the created_by value is NULL
    const nulls = await pool.query(
      "SELECT * FROM sys_admin WHERE created_by is NULL"
    );

    if (nulls.rowCount != 0) {
      res.status(400).json({ message: "a system admin alredy exists!" });
      return;
    }
    //IF THE CHECKS PASS, INSERTS INTO DB TABLES
    const newPerson = await pool.query(
      "INSERT INTO person (id,first_name,last_name,birthdate,is_male) VALUES($1, $2, $3, $4,$5) RETURNING *;",
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
    //!
    const initCampaign = await pool.query(
      `INSERT INTO campaign (name,description,status,start_date,created_by) VALUES ('Colorectal cancer','this a protoype campaign intialized on first admin signup',1,1);`
    );
    //SEND A CONFIRMATION EMAIL
    const mail = {
      from: "no-reply@detectplusplus.com",
      to: email,
      subject: "confirmation code",
      text: `your confirmation code is ${passwordGenerator(6)}`,
    };

    transporters.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email sent ", info.response);
      }
    });

    res.status(200).json({ message: "created successfully" });//200:OK
  } catch (err) {
    res.status(500).json({ message: err.message });//500:Internal Server Error
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
    //if there this email doesn't exist in account table 
    if (Account.rowCount == 0) {
      return res.status(404).json({ message: "invalid email" });//404:Not Found
    }
    //if the hashig of the given password different from the one in account table 
    if (Account.rows[0].pw_hash != pwhash) {
      return res.status(404).json({ message: "wrong password" });
    }
    //selon le type de account, le user sera redirigé vers son page
    let User;
    //the user is sysadmin
    if (Account.rows[0].account_type == "sysadmin") {
      User = await pool.query("SELECT * FROM sys_admin WHERE account_id=$1", [
        Account.rows[0].account_id,
      ]);
      //is doctor
    } else if (Account.rows[0].account_type == "doctor") {
      User = await pool.query("SELECT * FROM doctor WHERE account_id=$1", [
        Account.rows[0].account_id,
      ]);
      //is lab
    } else if (Account.rows[0].account_type == "lab") {
      User = await pool.query("SELECT * FROM laboratory WHERE account_id=$1", [
        Account.rows[0].account_id,
      ]);
    }
    //l'email et le mp valides (exist in DB) ms il est ni sysadmin, ni doctor, ni lab
    if (User.rowCount == 0) {
      return res
        .status(500)
        .json({ message: "account exists but something seems wrong" });
    }
    //get user id
    const Person = await pool.query("SELECT * FROM person WHERE id=$1", [
      User.rows[0].person_id,
    ]);
    //get those specified data
    const data = {
      id: Account.rows[0].account_id,
      name: Person.rows[0].first_name,
      lastname: Person.rows[0].last_name,
      email: email,
      type: Account.rows[0].account_type,
      machine: req.get("User-Agent"),
    };
    //If the account type is "sysadmin",  it adds 'level' property to 'data' which assigned the value of level of the sysadmin
    if (Account.rows[0].account_type == "sysadmin") {
      data.level = User.rows[0].level;
    } else if (Account.rows[0].account_type == "doctor") {//if it was a doctor,  it adds 'speciality' property to 'data' which assigned the speciality of the doctor
      const specialityName = await pool.query(
        "SELECT name FROM speciality WHERE speciality_id=$1",
        [User.rows[0].speciality]
      );
      data.speciality = specialityName.rows[0].name;
    }

    const token = jwt.sign(data, process.env.KEY, { expiresIn: "24h" });//  jwt.sign() : generate a JSON Web Token based on the provided data('data' be encoded into the JWT)
    //secret key used to sign the token(from .env)
    // expiration time of the token = 24h

    res.status(200).json({//send a response to "client" with a status of 200 and a JSON object containing the token
      token: token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });//500:Internal Server Error
  }
};
//authorization middleware function
exports.auth = async (req, res, next) => {
  try {
    token = req.headers["authorization"];//retrieves the token from the request headers
    if (!token) {//If the token is missing
      return res.status(401).json({ message: "UnAuthorized" });//401:Unauthorized
    }
    //if token is present
    jwt.verify(token, process.env.KEY, (err, decoded) => {//verify token against KEY
      if (err) {//there is an error during token verification
        return res.status(403).json({ message: "Bad Token" });//403: forbidden = indicates that the client's request is understood but the server is refusing to fulfill it due to permission restrictions //! token is invalid or has expired.
      }
      res.status(200).json({ message: "Authorized" });//if token is successfully verified
      next();//! pass control to the next middleware or route handler
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// random password generator
exports.getHash = (str) => {
  const hash = crypto.createHash("sha256");
  hash.update(str);
  return hash.digest("hex");
};

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

exports.transporter = mailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});