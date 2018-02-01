var mysql = require("mysql");
var consoleTable = require("console.table");
var inquirer = require("inquirer");
var fullProductTable;
var prodsToDisplay;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "toor",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    displayProducts();
   // connection.end();
});

console.log("\n");
console.log("----------------------------------------------");
console.log("  Welcome to the Bamazon Command Line Store!");
console.log("----------------------------------------------");



function displayProducts() {
    //console.log("Selecting all products...\n");
    connection.query('SELECT item_id AS "Product ID", product_name AS "Product Name", price AS "Unit Price" FROM products', function (err, res) {
        
        console.log("\n----------------------------------------------");
        console.table(res);
        console.log("-----------------------------------------------");
        getCustOrder(res);
    });
};

function getCustOrder(data) {

    inquirer.prompt([{
            type: 'input',
            name: 'itemId',
            message: 'Please enter the ID of the product you wish to purchase?',
            validate: function (value) {
                var isValid = false;
                data.forEach((element) => {
                    //console.log(element);
                    if (parseInt(value) === element["Product ID"]) {
                        isValid = true;
                    }
                });
                if (isValid) {
                    return true;
                } else {
                    return "Please enter a valid Product ID";
                }
            }
        },

        {
            type: 'input',
            name: 'quantity',
            message: "How many units would you like to purchase?",
            validate: function (value) {
                //var format = ;
                if (!value.match(/^([1-9]+)/)) {
                    return "Please enter a whole number greater than 0"
                } else {
                    return true;
                }
            }

        }
    ]).then(custResp => {
           // onsole.log("Cust requested Item #: ", custResp.itemId);
            //console.log("Cust wants " + custResp.quantity + " units");

            var orderItem = custResp.itemId;
            var orderQuantity = custResp.quantity;

            //if (checkStock(orderItem))

            processOrder(orderItem, orderQuantity);

        });

    };


    function processOrder(product, units) {
        connection.query('SELECT * FROM Products WHERE ?', {
            item_id: product
        }, function (err, res) {
            if (err) throw err;

           // console.log(res);
            if (parseInt(res[0].stock_quantity) > parseInt(units)) { // Compare the item's stock to the quantity requested by customer
                var updatedStock = res[0].stock_quantity - parseInt(units);
                fulfillOrder(product, updatedStock);
                //console.log("Updated stock", updatedStock);
               // console.log("Order can be fulfilled!")
               printReceipt(res[0].product_name, units, res[0].price);

           }
            else {
               rejectOrder(res[0].product_name, res[0].stock_quantity, units);
               //console.log("Order cannot be fullfilled - not even stock");
            }
        });
    };

    function rejectOrder(itemName, itemStock, unitsOrdered) {
        console.log("**********************************************************");
        console.log("We're sorry; your order could not be processed");
        console.log("You ordered", unitsOrdered, itemName + "s but we have only", itemStock, "in stock");
        console.log("\n");
        placeNewOrder();       

    }

    function placeNewOrder() {
        inquirer.prompt([{
            type: "confirm",
            name: "orderAgain",
            message: "Would you like to place another order?",
            default: true
    
        }]).then(function (inqResponse) {
            //After the response is returned, if the user responds affirmatively, run function to reset game variables, and start a new game.
            if (inqResponse.orderAgain) {
                displayProducts();
            } else {
                //Otherwise, display a friendly exit message.
                console.log("\n");
                console.log("**********************************************************");
                console.log("         Thanks for shopping! Come back soon.");
                //console.log("**********************************************************");
                
                connection.end();
                
            }
        });
    }

    
    function fulfillOrder(itemNo, newStockQuant) {
        //consol.log("");
        console.log("\n                  Fulfilling order...");
        connection.query(
            "UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: newStockQuant
                },
                {
                    item_id: itemNo
                }
            ],
            function (error) {
                if (error) throw err;
                //console.log("Order placed successfully!");
                //start();
            }
        );
    }

  function printReceipt(productName, unitsRequested, productPrice) {
        console.log("**********************************************************");
        console.log("\n");
        console.log("------------------ Your Order Summary ------------------------");   
        console.log("You order of", unitsRequested, productName + "s at a price of $" + productPrice, " each is complete.");
        console.log("              You were charged $" + (unitsRequested * productPrice) + ".");
        console.log("         Bamazon thanks you for your business!"); 
        console.log("--------------------------------------------------------------"); 

        placeNewOrder();

  }