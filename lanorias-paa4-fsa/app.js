// Applications Development Performance Assessment #4 / Final Summative Assessment
// by Alexandra Lanorias
// Credits go to Raddy and my classmates in BS CompSc 2-A :)
// March 24, 2022

// Basically app.js is the middleware of this whole thing

// First things first, open xampp and start apache and mysql
// Create a database in localhost/phpmyadmin named school_management_system
// copy-paste the queries found in the school-schema.sql file in the sql tab
// Create a .env file with the following format:
// ---
// DB_HOST = localhost
// DB_NAME = school_management_system
// DB_USER = root
// DB_PASS = ''
// --
// Then edit the .env file according to your username and password that you use in phpmyadmin
// We'll be using port 5000 for this activity. If your port 5000 is already used go to this app.js file and find 'const PORT = process.env.PORT || 5000;'
// Edit '5000' with whatever port you want to replace it with
// Open the lanorias-paa4-fsa folder in your file explorer
// Shift + Right click and select 'Open powershell windows here'
// Type 'npm install'
// You may see '1 high severity vulnerability' after installing, just ignore it as the app will still run
// Then type 'npm start'
// You're good to go! You should be seeing the 'Yay, no errors! Try accessing localhost: 5000 on your browser.' notice.
// Lastly, go check out the CRUD app in your browser by going to localhost:5000 :)

// IMPORTS
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const flash = require("express-flash");
const session = require("express-session")
const PORT = process.env.PORT || 5000;

require("dotenv").config();

// PARSING MIDDLEWARE
// PARSE APPLICATION/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// PARSE APPLICATION/JSON
app.use(bodyParser.json());

// STATIC FILES
app.use(express.static("public"));

// SET ENGINE
app.engine(
    ".hbs",
    exphbs.engine({
        defaultLayout: "index",
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
    })
);
app.set("view engine", ".hbs");

app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
app.use(flash());

// MYSQL CONNECTION POOL
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
})

// CONNECT TO DATABASE
pool.getConnection((error, connection) => {
    if (error) throw error; // NOT CONNECTED;
    
    // console.log("Connected! ID: " + connection.threadId);
})

// ROUTER
app.use("/", require("./server/routes/main"));
app.use("/students", require("./server/routes/students"));
app.use("/teachers", require("./server/routes/teachers"));
app.use("/subjects", require("./server/routes/subjects"));

// LISTEN TO PORT
app.listen(PORT, (error) => {
    if (error) console.log("Error occured: ", error);
    else console.log("Yay, no errors! Try accessing localhost:", PORT, " on your browser.")
});
