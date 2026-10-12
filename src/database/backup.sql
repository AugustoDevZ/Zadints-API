SELECT VERSION();
CREATE DATABASE IF NOT EXISTS ZadintsUsers;
show databases;
USE ZadintsUsers;
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
	user_id BINARY(16) NOT NULL,
    user_handle VARCHAR(30) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    email_address VARCHAR(50) NOT NULL UNIQUE,
    
    user_displayname VARCHAR(32) NOT NULL UNIQUE,
    
    user_status ENUM('online', 'invisible', 'idle', 'Do Not Disturb') NOT NULL DEFAULT 'online',
    user_status_lore VARCHAR(128) NULL,
    user_avatar TEXT NOT NULL DEFAULT 'https://avatars.githubusercontent.com/u/292596409?s=200&v=4', 
    
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY(user_id),
    INDEX idx_user_id (user_id)
);








CREATE TABLE IF NOT EXISTS permissions_app(
    user_id BINARY(16) NOT NULL,
	items_sold BOOLEAN NOT NULL,
    items_delete BOOLEAN NOT NULL,
    items_add BOOLEAN NOT NULL,
    items_edit BOOLEAN NOT NULL,
    items_view BOOLEAN NOT NULL
);

-- sector de ventas 
CREATE TABLE IF NOT EXISTS sales (
    sales_id BINARY(16) NOT NULL,
    sold_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (sales_id),
    INDEX idx_sold_at (sold_at) 
);
CREATE TABLE IF NOT EXISTS sales_details(
	sales_detail_id INT NOT NULL AUTO_INCREMENT,
    sales_id BINARY(16) NOT NULL,
    item_name VARCHAR(50) NOT NULL,
    quantity_sold INT NOT NULL,	
    unit_price DECIMAL(10,2) NULL,
	total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity_sold * unit_price) STORED,
    PRIMARY KEY (sales_detail_id),
    FOREIGN KEY (sales_id) REFERENCES sales(sales_id) ON DELETE CASCADE
);


-- Para guardar las máquinas que se conectan
CREATE TABLE IF NOT EXISTS connected_clients(
	connected_id BINARY(16) NOT NULL,
	user_id BINARY(16) NOT NULL,
    user_handle VARCHAR(20) NOT NULL,
    client_name VARCHAR(50) NOT NULL,
    connected_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (connected_id),
    INDEX idx_connected_at (connected_at)
);

DROP TABLE IF EXISTS items;
-- Para guardar los productos 
CREATE TABLE IF NOT EXISTS items (
	stock_id VARCHAR(50) NOT NULL,
    items_category INT NOT NULL,
    add_at DATETIMe NOT NULL DEFAULT NOW(),
    expired_at DATETIME NOT NULL,
    items_name VARCHAR(60) NOT NULL,
    items_stock INT NOT NULL,
    items_img TEXT NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    
    PRIMARY KEY(stock_id),
    INDEX idx_fecha_at (expired_at, add_at)
);

INSERT INTO items (stock_id, items_category, add_at, expired_at, items_name, items_stock, items_img, user_id)
VALUES (
    '42ad8e32-2d12-4217-b765-b772c3d52fbb', 
    1, 
    NOW(), 
    DATE_ADD(NOW(), INTERVAL 7 DAY), 
    'Leche Entera 1L', 
    50, 
    'https://ejemplo.com', 
    '82ad8e32-2d12-4217-b765-b772c3d52fbb'
);

SELECT * FROM items