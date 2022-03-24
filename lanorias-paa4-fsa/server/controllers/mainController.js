const mysql = require("mysql");

exports.view = (req, res) => {
    res.render("main", {
        title: "School Management System",
        css: ["styles.css"],
        js: ["script.js"],
    });
};