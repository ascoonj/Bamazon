var mysql = require("mysql");
var consoleTable = require("console.table");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "bflower1",
    database: "bamazon"
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayInventory();
    connection.end();
});

function displayInventory() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (err, res) {
       console.table(res);
       console.log("-------------------------------------");
    });
}