var mysql = require("mysql");
var consoleTable = require("console.table");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "toor",
    database: "bamazon"
});

var lowInventory;

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    displayMenu();
    // connection.end();
});

function displayMenu() {
    console.log("============================================================");
    inquirer.prompt([{
        type: "list",
        name: "task",
        message: "What task would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }]).then(function (inqResponse) {

        console.log("============================================================");
        var task = inqResponse.task;
        //After the response is returned, call a function to check the answer and perform the
        //appropriate process
        evaluateSelection(task);
    });
};

function evaluateSelection(thingToDo) {
    connection.query('SELECT * FROM Products', function (err, res) {
        if (err) throw err;

        switch (thingToDo) {
            case "View Products for Sale":
                console.table(res);
                displayMenu();
                break;

            case "View Low Inventory":
                displayLowInventory();
                displayMenu();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":

                break;

            case "Exit":
                process.exit();
                break;
        };
    });
};

function displayLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        lowInventory = res;
        console.log("\n");
        console.table(lowInventory);
       // displayMenu();
    });
}

function addInventory() {
    displayLowInventory();
    inquirer.prompt([{
            type: 'input',
            name: 'itemId',
            message: "Please enter the ID of the product to which you're adding inventory?",
            validate: function (value) {
                var isValid = false;
                if (!isNaN(value)) {
                   // console.log(lowInventory)
                    lowInventory.forEach(element => {
                        //console.log(element);
                        if (parseInt(value) === element.item_id) {
                            isValid = true;
                        }
                    });
                    if (isValid) {
                        return true;
                    } else {
                        return "Please enter the ID of a product with low inventory";
                    }
                } else {
                    return "Please enter a valid ID"
                }

            },
        },

        {
            type: 'input',
            name: 'quantity',
            message: "How many units would you like to add to the inventory of this product?",
            validate: function (value) {
                //var format = ;
                if (!value.match(/^([1-9]+)/)) {
                    return "Please enter a whole number greater than 0"
                } else {
                    return true;
                }
            }

        }

    ]).then(managerResp => {
        
        var chosenItem = managerResp.itemId;
        var reupQuantity = managerResp.quantity;

        processReup(chosenItem, reupQuantity);
    });
};

function processReup(product, quantity) {
    console.log(lowInventory);
    connection.query(
       
        
      "UPDATE products SET stock_quantity = ? WHERE item_id = ?", [product.stock_quantity + quantity, product.item_id],
      function(err, res) {
        // Let the manager know the stock update was successful
        console.log("\n The process was successful." + quantity + " " + product.product_name + "s were added to inventory");
        // re-display main menu of tasks
        displayMenu();
      }
    );
  }