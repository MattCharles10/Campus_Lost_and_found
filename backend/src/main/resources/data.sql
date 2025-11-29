-- Insert default categories
INSERT IGNORE INTO categories (name, description, icon, color) VALUES
('Electronics', 'Phones, laptops, tablets, headphones, chargers', '💻', '#4CAF50'),
('Books & Notes', 'Textbooks, notebooks, study materials, assignments', '📚', '#FF9800'),
('Clothing', 'Jackets, hats, scarves, gloves, uniforms', '👕', '#E91E63'),
('Accessories', 'Bags, wallets, keys, jewelry, watches', '🎒', '#9C27B0'),
('Academic', 'Calculators, lab equipment, stationery, pens', '📝', '#2196F3'),
('Personal Items', 'Glasses, water bottles, lunch boxes, cosmetics', '👓', '#00BCD4'),
('Sports Equipment', 'Gym gear, sports gear, equipment, balls', '⚽', '#FF5722'),
('Documents', 'ID cards, licenses, certificates, passports', '📄', '#795548'),
('Other', 'Other miscellaneous items not categorized', '📦', '#607D8B');

-- Insert a sample admin user (password: admin123)
INSERT IGNORE INTO users (first_name, last_name, email, password, student_id, email_verified, is_active)
VALUES ('Admin', 'User', 'admin@campus.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuWk6K7aM4AqA6DnO.YP7w6d5X2tK5Xa', 'ADM001', true, true);

-- Insert sample regular users (password: password123)
INSERT IGNORE INTO users (first_name, last_name, email, password, student_id, phone_number, email_verified, is_active) VALUES
('John', 'Smith', 'john.smith@student.campus.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuWk6K7aM4AqA6DnO.YP7w6d5X2tK5Xa', 'STU2024001', '+1234567890', true, true),
('Sarah', 'Johnson', 'sarah.johnson@student.campus.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuWk6K7aM4AqA6DnO.YP7w6d5X2tK5Xa', 'STU2024002', '+1234567891', true, true),
('Michael', 'Brown', 'michael.brown@student.campus.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuWk6K7aM4AqA6DnO.YP7w6d5X2tK5Xa', 'STU2024003', '+1234567892', true, true),
('Emily', 'Davis', 'emily.davis@student.campus.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuWk6K7aM4AqA6DnO.YP7w6d5X2tK5Xa', 'STU2024004', '+1234567893', true, true),
('David', 'Wilson', 'david.wilson@student.campus.edu', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuWk6K7aM4AqA6DnO.YP7w6d5X2tK5Xa', 'STU2024005', '+1234567894', true, true);

-- Insert sample lost items
INSERT IGNORE INTO items (title, description, item_type, category_id, location, date_lost_found, status, user_id, contact_preference, is_public, created_at) VALUES
('MacBook Pro 14"', 'Space Gray MacBook Pro with M2 chip, 16GB RAM, 512GB SSD. Has a small sticker of a cat on the bottom right corner.', 'LOST', 1, 'Main Library - 2nd Floor Study Area', '2024-01-15', 'ACTIVE', 2, 'EMAIL', true, NOW() - INTERVAL 2 DAY),
('Calculus Textbook', 'Calculus: Early Transcendentals 8th Edition by James Stewart. Has my name "John Smith" written on the inside cover.', 'LOST', 2, 'Mathematics Building - Room 205', '2024-01-14', 'ACTIVE', 2, 'PHONE', true, NOW() - INTERVAL 3 DAY),
('Black Nike Backpack', 'Black Nike backpack with red logo. Contains my laptop charger, some notebooks, and a water bottle in the side pocket.', 'LOST', 4, 'Student Center - Cafeteria', '2024-01-13', 'ACTIVE', 3, 'EMAIL', true, NOW() - INTERVAL 4 DAY),
('Wireless AirPods', 'Apple AirPods Pro 2nd generation in white charging case. Case has a small scratch on the front.', 'LOST', 1, 'Gym - Locker Room', '2024-01-12', 'ACTIVE', 4, 'PHONE', true, NOW() - INTERVAL 5 DAY),
('Student ID Card', 'Campus University Student ID for Sarah Johnson. Photo ID with barcode on the back.', 'LOST', 8, 'Science Building - Hallway', '2024-01-11', 'ACTIVE', 3, 'EMAIL', true, NOW() - INTERVAL 6 DAY),
('Blue Water Bottle', 'Hydro Flask 32oz water bottle in blue color. Has some stickers from various bands and travel destinations.', 'LOST', 6, 'Library - Reading Room', '2024-01-10', 'ACTIVE', 5, 'EMAIL', true, NOW() - INTERVAL 7 DAY);

-- Insert sample found items
INSERT IGNORE INTO items (title, description, item_type, category_id, location, date_lost_found, status, user_id, contact_preference, is_public, reward, created_at) VALUES
('Black Wallet', 'Found a black leather wallet containing some cash, credit cards, and a driver''s license. Please contact with identification.', 'FOUND', 4, 'Parking Lot B - Near the entrance', '2024-01-15', 'ACTIVE', 4, 'EMAIL', true, 20.00, NOW() - INTERVAL 1 DAY),
('Glasses Case with Glasses', 'Black hard case containing prescription glasses with black frames. Found on bench near the fountain.', 'FOUND', 6, 'Central Campus - Fountain Area', '2024-01-14', 'ACTIVE', 5, 'PHONE', true, 10.00, NOW() - INTERVAL 2 DAY),
('USB Flash Drive', 'SanDisk 64GB USB flash drive. Found in computer lab. Contains important files - please describe contents to claim.', 'FOUND', 1, 'Computer Science Building - Lab 304', '2024-01-13', 'ACTIVE', 2, 'EMAIL', true, 5.00, NOW() - INTERVAL 3 DAY),
('Chemistry Lab Notebook', 'Lab notebook with detailed chemistry experiment notes. Name appears to be "Michael" but last name unclear.', 'FOUND', 2, 'Chemistry Building - Lab 101', '2024-01-12', 'ACTIVE', 3, 'EMAIL', true, 15.00, NOW() - INTERVAL 4 DAY),
('Basketball', 'Spalding NBA basketball in good condition. Found on the outdoor basketball court.', 'FOUND', 7, 'Sports Complex - Basketball Court', '2024-01-11', 'ACTIVE', 4, 'PHONE', true, NULL, NOW() - INTERVAL 5 DAY),
('Umbrella', 'Large black automatic umbrella with wooden handle. Found near the bus stop on campus.', 'FOUND', 9, 'North Campus - Bus Stop', '2024-01-10', 'ACTIVE', 5, 'EMAIL', true, NULL, NOW() - INTERVAL 6 DAY);

-- Insert sample claims
INSERT IGNORE INTO claims (item_id, claimant_id, description, contact_info, status, created_at) VALUES
(1, 3, 'I believe this is my MacBook Pro. I lost it in the library while studying for my computer science exam. It has a distinctive cat sticker that my little sister gave me.', 'sarah.johnson@student.campus.edu', 'PENDING', NOW() - INTERVAL 1 DAY),
(7, 2, 'This is definitely my wallet! I lost it after getting out of my car in Parking Lot B. I can provide details about the contents and show my ID.', 'john.smith@student.campus.edu', 'PENDING', NOW() - INTERVAL 12 HOUR),
(8, 4, 'I think these might be my glasses. I have -2.5 prescription and the case matches the one I bought last month.', 'emily.davis@student.campus.edu', 'PENDING', NOW() - INTERVAL 6 HOUR),
(3, 6, 'I lost a similar backpack. Mine had a physics textbook and a blue lunch box inside. Can you check the contents?', 'david.wilson@student.campus.edu', 'PENDING', NOW() - INTERVAL 3 DAY);

-- Insert some resolved items and claims
INSERT IGNORE INTO items (title, description, item_type, category_id, location, date_lost_found, status, user_id, contact_preference, is_public, created_at) VALUES
('Physics Textbook', 'University Physics with Modern Physics 15th Edition', 'LOST', 2, 'Engineering Building', '2024-01-05', 'RESOLVED', 2, 'EMAIL', true, NOW() - INTERVAL 10 DAY),
('Silver Watch', 'Fossil silver analog watch with leather band', 'FOUND', 4, 'Student Lounge', '2024-01-06', 'RESOLVED', 4, 'PHONE', true, NULL, NOW() - INTERVAL 9 DAY);

INSERT IGNORE INTO claims (item_id, claimant_id, description, contact_info, status, resolved_by, resolved_at, created_at) VALUES
(13, 5, 'This is my physics textbook! I need it for my class next week.', 'david.wilson@student.campus.edu', 'APPROVED', 1, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 9 DAY),
(14, 3, 'I lost my silver Fossil watch last week. It was a birthday gift from my parents.', 'michael.brown@student.campus.edu', 'APPROVED', 1, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 8 DAY);

-- Update the resolved items to show they've been claimed
UPDATE items SET status = 'RESOLVED' WHERE id IN (13, 14);

-- Insert sample user favorites
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_item (user_id, item_id)
);

INSERT IGNORE INTO favorites (user_id, item_id) VALUES
(2, 7),  -- John favorites the found wallet
(3, 1),  -- Sarah favorites the lost MacBook
(4, 2),  -- Michael favorites the lost Calculus book
(5, 8),  -- Emily favorites the found glasses
(2, 10); -- John favorites the found basketball

-- Insert password reset tokens table (if not exists in previous schema)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert some sample notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('INFO', 'SUCCESS', 'WARNING', 'ERROR') DEFAULT 'INFO',
    is_read BOOLEAN DEFAULT FALSE,
    related_item_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_item_id) REFERENCES items(id) ON DELETE SET NULL
);

-- Insert sample notifications
INSERT IGNORE INTO notifications (user_id, title, message, type, related_item_id) VALUES
(2, 'New Claim on Your Item', 'Sarah Johnson has submitted a claim for your lost MacBook Pro.', 'INFO', 1),
(4, 'Item Found Match', 'We found an item that matches your lost backpack description.', 'SUCCESS', 3),
(5, 'Claim Approved', 'Your claim for the physics textbook has been approved!', 'SUCCESS', 13),
(3, 'Welcome to Campus Lost & Found', 'Thank you for joining our community!', 'INFO', NULL);