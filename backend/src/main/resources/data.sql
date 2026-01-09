-- Create database if not exists
CREATE DATABASE IF NOT EXISTS campus_lost_found;
USE campus_lost_found;

-- ============================================
-- 1. CREATE TABLES (Matching your Java entities)
-- ============================================

-- Users table (already exists from your auth system)
-- Make sure your users table has these columns

-- Categories table (NEW)
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255),
    icon VARCHAR(50),
    color VARCHAR(20),
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Items table (NEW - matches your Item.java)
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('LOST', 'FOUND') NOT NULL,
    status ENUM('PENDING', 'ACTIVE', 'CLAIMED', 'RESOLVED', 'EXPIRED', 'ARCHIVED') DEFAULT 'PENDING',
    category_id BIGINT,
    location VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    contact_number VARCHAR(20),
    contact_email VARCHAR(100) NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_user (user_id)
);

-- Item images table (NEW - for storing multiple images)
CREATE TABLE IF NOT EXISTS item_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_item (item_id)
);

-- Item tags table (NEW - for storing tags)
CREATE TABLE IF NOT EXISTS item_tags (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_item (item_id),
    INDEX idx_tag (tag),
    UNIQUE KEY unique_item_tag (item_id, tag)
);

-- ============================================
-- 2. INSERT DEFAULT CATEGORIES
-- (Matches your Category.java)
-- ============================================

INSERT INTO categories (name, display_name, icon, color, description, active) VALUES
('electronics', 'Electronics', '📱', '#3B82F6', 'Mobile phones, laptops, tablets, chargers, headphones', true),
('documents', 'Documents', '📄', '#10B981', 'ID cards, passports, certificates, notebooks', true),
('clothing', 'Clothing', '👕', '#EF4444', 'Jackets, shirts, pants, hats, shoes', true),
('accessories', 'Accessories', '👜', '#8B5CF6', 'Bags, wallets, watches, jewelry', true),
('books', 'Books & Stationery', '📚', '#F59E0B', 'Textbooks, novels, pens, calculators', true),
('valuables', 'Valuables', '💎', '#EC4899', 'Jewelry, cash, credit cards', true),
('keys', 'Keys', '🔑', '#6366F1', 'House keys, car keys, locker keys', true),
('other', 'Other', '📦', '#6B7280', 'Miscellaneous items', true)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    icon = VALUES(icon),
    color = VALUES(color),
    description = VALUES(description),
    active = VALUES(active),
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 3. INSERT SAMPLE ITEMS
-- (Using your new Item.java structure)
-- ============================================

-- First, make sure you have some users (your existing users)
-- Assuming user IDs: 1=admin, 2=john, 3=sarah, etc.

-- Sample lost items
INSERT INTO items (title, description, type, category_id, location, date, contact_number, contact_email, user_id, status, created_at) VALUES
('MacBook Pro 14-inch', 'Lost in Main Library. Space Gray, M1 Pro chip, 16GB RAM. Serial: C02XYZ123ABC. Has a cat sticker on the lid.', 'LOST', 1, 'Main Library - 2nd Floor', '2024-01-15', '+1234567890', 'john@campus.edu', 2, 'ACTIVE', NOW() - INTERVAL 2 DAY),
('Calculus Textbook', 'Calculus: Early Transcendentals 8th Edition by James Stewart. Name "John Smith" written inside cover.', 'LOST', 5, 'Mathematics Building - Room 205', '2024-01-14', '+1234567890', 'john@campus.edu', 2, 'ACTIVE', NOW() - INTERVAL 3 DAY),
('Black Nike Backpack', 'Black Nike backpack with red logo. Contains laptop charger and notebooks in side pocket.', 'LOST', 4, 'Student Center - Cafeteria', '2024-01-13', '+1234567891', 'sarah@campus.edu', 3, 'ACTIVE', NOW() - INTERVAL 4 DAY),
('Student ID Card', 'Campus University Student ID for Sarah Johnson. Photo ID with barcode.', 'LOST', 2, 'Science Building - Hallway', '2024-01-11', '+1234567891', 'sarah@campus.edu', 3, 'ACTIVE', NOW() - INTERVAL 6 DAY)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- Sample found items
INSERT INTO items (title, description, type, category_id, location, date, contact_number, contact_email, user_id, status, created_at) VALUES
('Black Leather Wallet', 'Found in Parking Lot B. Contains cash, credit cards, and driver''s license. Please contact with identification.', 'FOUND', 4, 'Parking Lot B - Near entrance', '2024-01-15', '+1234567892', 'michael@campus.edu', 4, 'ACTIVE', NOW() - INTERVAL 1 DAY),
('Prescription Glasses', 'Black frame prescription glasses in hard case. Found near campus fountain.', 'FOUND', 7, 'Central Campus - Fountain Area', '2024-01-14', '+1234567893', 'emily@campus.edu', 5, 'ACTIVE', NOW() - INTERVAL 2 DAY),
('USB Flash Drive 64GB', 'SanDisk USB flash drive found in computer lab. Contains important files.', 'FOUND', 1, 'Computer Science Building - Lab 304', '2024-01-13', '+1234567890', 'john@campus.edu', 2, 'ACTIVE', NOW() - INTERVAL 3 DAY),
('Chemistry Lab Notebook', 'Lab notebook with chemistry experiment notes. Name appears to be "Michael".', 'FOUND', 5, 'Chemistry Building - Lab 101', '2024-01-12', '+1234567891', 'sarah@campus.edu', 3, 'ACTIVE', NOW() - INTERVAL 4 DAY)
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 4. INSERT TAGS FOR ITEMS
-- ============================================

-- Tags for MacBook
INSERT INTO item_tags (item_id, tag) VALUES
(1, 'laptop'), (1, 'macbook'), (1, 'electronics'), (1, 'apple')
ON DUPLICATE KEY UPDATE tag = VALUES(tag);

-- Tags for Textbook
INSERT INTO item_tags (item_id, tag) VALUES
(2, 'book'), (2, 'textbook'), (2, 'calculus'), (2, 'study')
ON DUPLICATE KEY UPDATE tag = VALUES(tag);

-- Tags for Backpack
INSERT INTO item_tags (item_id, tag) VALUES
(3, 'bag'), (3, 'backpack'), (3, 'nike'), (3, 'black')
ON DUPLICATE KEY UPDATE tag = VALUES(tag);

-- Tags for ID Card
INSERT INTO item_tags (item_id, tag) VALUES
(4, 'id'), (4, 'card'), (4, 'student'), (4, 'document')
ON DUPLICATE KEY UPDATE tag = VALUES(tag);

-- ============================================
-- 5. INSERT SAMPLE IMAGES (Optional)
-- ============================================

-- Note: Image URLs should point to files in your uploads directory
-- After uploading images, you can add entries like:

-- INSERT INTO item_images (item_id, image_url) VALUES
-- (1, '/uploads/macbook-1.jpg'),
-- (1, '/uploads/macbook-2.jpg'),
-- (3, '/uploads/backpack.jpg');

-- ============================================
-- 6. VERIFY DATA
-- ============================================

-- Check categories
SELECT * FROM categories;

-- Check items with category names
SELECT
    i.id,
    i.title,
    i.type,
    c.name as category,
    i.location,
    i.date,
    i.status,
    i.created_at
FROM items i
LEFT JOIN categories c ON i.category_id = c.id
ORDER BY i.created_at DESC;

-- Check tags for an item
SELECT i.title, GROUP_CONCAT(it.tag SEPARATOR ', ') as tags
FROM items i
LEFT JOIN item_tags it ON i.id = it.item_id
WHERE i.id = 1
GROUP BY i.id;

-- Count items by type
SELECT type, COUNT(*) as count FROM items GROUP BY type;

-- Count items by category
SELECT c.name, COUNT(i.id) as item_count
FROM categories c
LEFT JOIN items i ON c.id = i.category_id
GROUP BY c.id, c.name
ORDER BY item_count DESC;