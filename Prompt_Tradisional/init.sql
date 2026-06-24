CREATE DATABASE IF NOT EXISTS medical_inventory;
USE medical_inventory;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Super Admin','Apoteker','Dokter') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL DEFAULT 'pcs',
    category VARCHAR(100),
    expiration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_name (name)
);

INSERT INTO users (username, password_hash, role)
VALUES
    ('superadmin', '$2a$10$j05RgfvyejqS507frR1Ee.aKjszmPmZbS/B4g5hjCGYeaeL4k.1P2', 'Super Admin'),
    ('apoteker', '$2a$10$j05RgfvyejqS507frR1Ee.aKjszmPmZbS/B4g5hjCGYeaeL4k.1P2', 'Apoteker'),
    ('dokter', '$2a$10$j05RgfvyejqS507frR1Ee.aKjszmPmZbS/B4g5hjCGYeaeL4k.1P2', 'Dokter');

-- Password untuk semua user adalah: admin123
