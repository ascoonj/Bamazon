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
    readItems();
    connection.end();
});

function readItems() {
    console.log("Selecting all products...\n");
    connection.query('SELECT item_id AS "Product ID", product_name AS "Product Name", price AS "Unit Price" FROM products', function (err, res) {
       console.table(res);
        // res.forEach(function (element) {
        //     //console.log(element.item_id + " | " + element.product_name + " | " + element.price);
        //     console.log(`${element.item_id}   |   ${element.product_name}   |   ${element.price}`);
        // })
        //   for (var i = 0; i < res.length; i++) {
        //     console.log(elem.item_id + " | " + res[i].product_name + " | " + res[i].price);
        //   }
        console.log("-------------------------------------");
    });
}