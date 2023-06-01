//imports
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const jwt = require("jsonwebtoken");
const service = require("./controllers/account.controllers");

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

//routes
const personRouter = require("./routes/person");
const sysAdminRouter = require("./routes/sysAdmin");

const doctorRouter = require("./routes/doctor");
const unitRouter = require("./routes/unit");
const labRouter = require("./routes/lab");
const subjectRouter = require("./routes/subject");

app.use("/person", personRouter);
app.use("/sysadmin", sysAdminRouter);
app.use("/doctor", doctorRouter);
app.use("/unit", unitRouter);
app.use("/lab", labRouter);
app.use("/subject", subjectRouter);

const port = process.env.PORT;

//

// verify the token

app.get("/auth", service.auth);

app.post("/signin", service.signin);

app.get("/", async (req, res) => {
  res.send("sever on");
});

app.get("/account", async (req, res) => {
  try {
    accounts = await pool.query("select account_id from account;");
    if (accounts.rowCount == 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (err) {
    res.send(err);
  }
});

app.get("/email", async (req, res) => {
  try {
    email = await pool.query("delete from temp_email_confirmation *;");
      res.send(true);
  } catch (err) {
    res.send(err);
  }
});


app.listen(port, () => {
  console.log(`serving`);
});
