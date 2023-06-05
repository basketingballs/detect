//imports
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const service = require("./controllers/account.controllers");
require("dotenv").config();

const port = process.env.PORT;

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

//routes
const sysAdminRouter = require("./routes/sysAdmin");
const doctorRouter = require("./routes/doctor");
const unitRouter = require("./routes/unit");
const labRouter = require("./routes/lab");
const subjectRouter = require("./routes/subject");


app.use("/sysadmin", sysAdminRouter);
app.use("/doctor", doctorRouter);
app.use("/unit", unitRouter);
app.use("/lab", labRouter);
app.use("/subject", subjectRouter);



// verify the token
app.get("/auth", service.auth);


// signin function
app.post("/signin", service.signin);


// returns true if there are no accounts in the databade, used for the login modal 
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



// makes sure no emails stay in the databse
app.get("/email", async (req, res) => {
  try {
    email = await pool.query("delete from temp_email_confirmation *;");
  } catch (err) {
    res.send(err);
  }
});


app.listen(port, () => {
  console.log(`serving`);
});
