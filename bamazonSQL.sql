DROP DATABASE bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(255) NOT NULL,
price DECIMAL(10,2),
stock_quantity INT,
PRIMARY KEY (item_id)
);

INSERT INTO products 
	(product_name, price, stock_quantity)
VALUES 
	("Stapler", 17.25, 25),
    ("Charm anklet", 33.00, 8),
    ("Wireless keyboard", 18.00, 12),
    ("Blender", 45.00, 15),
    ("2-Drawer File Cabinet", 79.99, 6),
    ("Label maker", 24.00, 9),
    ("Gold-plated necklace", 260.00, 5),
    ("Bluetooth speaker", 49.00, 8),
    ("InkJet printer", 139.00, 5),
    ("Wine fridge", 895.00, 4),
    ("Box of pens", 13.00, 12),
    ("Espresso Machine", 600.00, 2);
    
	

