-- UrbanCruise LMS Sample Data
-- Insert sample data into MySQL database

USE lms;

-- Insert sample users
INSERT IGNORE INTO users (name, email, password, role) VALUES
('John Admin', 'admin@urbancruise.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Sarah Manager', 'manager@urbancruise.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager'),
('Mike Agent', 'agent@urbancruise.in', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'agent');

-- Insert sample leads
INSERT IGNORE INTO leads (name, email, phone, service, vehicle, city, rental_days, rental_months, source, campaign, keyword, status, notes) VALUES
('John Smith', 'john.smith@email.com', '+1-555-0123', 'WEDDING TRAVEL', 'LUXURY CAR - 4 To 7 Seater', 'Mumbai', '3', NULL, 'website', 'Google Search', NULL, 'new', 'Interested in wedding transportation for 50 guests'),
('Sarah Johnson', 'sarah.j@email.com', '+1-555-0456', 'CORPORATE TRAVEL', 'MINIBUS - 19 To 35 Seater', 'Pune', '5', NULL, 'meta', 'Facebook Ads', NULL, 'contacted', 'Corporate event transportation requirement'),
('Mike Davis', 'mike.davis@company.com', '+1-555-0789', 'VACATIONS', 'TEMPO TRAVELLER - 9 To 26 Seater', 'Delhi', NULL, '1', 'google', 'Google Ads', 'vacation packages', 'qualified', 'Family vacation planning for summer'),
('Emily Chen', 'emily.chen@email.com', '+1-555-0321', 'LOCAL TRAVEL', 'CAR - 4 Seater', 'Thane', '2', NULL, 'website', 'Organic Search', NULL, 'converted', 'Local sightseeing tour requirement'),
('David Wilson', 'david.wilson@business.com', '+1-555-0654', 'WEDDING TRAVEL', 'LUXURY BUS - 36 To 50 Seater', 'Noida', '7', NULL, 'meta', 'Instagram Ads', NULL, 'new', 'Destination wedding transportation'),
('Lisa Brown', 'lisa.brown@email.com', '+1-555-0987', 'CORPORATE TRAVEL', 'SUV - 6 To 7 Seater', 'Gurgaon', NULL, '2', 'google', 'Display Ads', 'corporate travel', 'contacted', 'Monthly corporate transportation contract'),
('Robert Taylor', 'robert.taylor@startup.com', '+1-555-0432', 'VACATIONS', 'LUXURY CAR - 4 To 7 Seater', 'Agra', '4', NULL, 'website', 'LinkedIn Referral', NULL, 'qualified', 'Taj Mahal visit with family'),
('Jennifer Lee', 'jennifer.lee@email.com', '+1-555-0765', 'ONE WAY', 'CAR - 4 Seater', 'Varanasi', '1', NULL, 'meta', 'Facebook Lead Ads', NULL, 'lost', 'One-way airport transfer requirement'),
('Alex Kumar', 'alex.kumar@email.com', '+91-9876543210', 'WEDDING TRAVEL', 'LUXURY BUS - 36 To 50 Seater', 'Mumbai', '2', NULL, 'website', 'Direct Traffic', NULL, 'new', 'Bride and groom transportation for wedding'),
('Priya Sharma', 'priya.sharma@company.com', '+91-9876543211', 'CORPORATE TRAVEL', 'MINIBUS - 19 To 35 Seater', 'Pune', '10', NULL, 'meta', 'LinkedIn Campaign', 'business travel', 'contacted', 'Employee transportation for company event'),
('Rahul Singh', 'rahul.singh@email.com', '+91-9876543212', 'VACATIONS', 'TEMPO TRAVELLER - 9 To 26 Seater', 'Goa', NULL, '3', 'google', 'Google Search', 'goa vacation packages', 'qualified', 'Family vacation to Goa beaches'),
('Anjali Patel', 'anjali.patel@email.com', '+91-9876543213', 'LOCAL TRAVEL', 'SUV - 6 To 7 Seater', 'Ahmedabad', '3', NULL, 'website', 'SEO Traffic', NULL, 'converted', 'City sightseeing and shopping tour'),
('Vikram Joshi', 'vikram.joshi@startup.com', '+91-9876543214', 'WEDDING TRAVEL', 'LUXURY CAR - 4 To 7 Seater', 'Jaipur', '5', NULL, 'meta', 'Instagram Stories', NULL, 'new', 'Royal wedding transportation in Jaipur'),
('Meera Reddy', 'meera.reddy@email.com', '+91-9876543215', 'CORPORATE TRAVEL', 'LUXURY BUS - 36 To 50 Seater', 'Hyderabad', '15', NULL, 'google', 'PPC Campaign', 'corporate bus rental', 'contacted', 'Corporate team building event transportation'),
('Arjun Nair', 'arjun.nair@email.com', '+91-9876543216', 'VACATIONS', 'MINIBUS - 19 To 35 Seater', 'Kerala', NULL, '2', 'website', 'Blog Traffic', NULL, 'qualified', 'Backwater houseboat and temple tour'),
('Kavita Gupta', 'kavita.gupta@company.com', '+91-9876543217', 'ONE WAY', 'CAR - 4 Seater', 'Chandigarh', '1', NULL, 'meta', 'Facebook Groups', NULL, 'lost', 'Airport pickup service requirement'),
('Suresh Kumar', 'suresh.kumar@email.com', '+91-9876543218', 'WEDDING TRAVEL', 'TEMPO TRAVELLER - 9 To 26 Seater', 'Chennai', '3', NULL, 'google', 'YouTube Ads', 'wedding car rental', 'new', 'Traditional South Indian wedding transportation'),
('Divya Singh', 'divya.singh@email.com', '+91-9876543219', 'CORPORATE TRAVEL', 'SUV - 6 To 7 Seater', 'Bangalore', '7', NULL, 'website', 'Direct Referral', NULL, 'contacted', 'Tech conference participant transportation'),
('Rajesh Verma', 'rajesh.verma@company.com', '+91-9876543220', 'VACATIONS', 'LUXURY BUS - 36 To 50 Seater', 'Shimla', NULL, '1', 'meta', 'Facebook Carousel', NULL, 'qualified', 'Hill station vacation with extended family'),
('Poonam Agarwal', 'poonam.agarwal@email.com', '+91-9876543221', 'LOCAL TRAVEL', 'CAR - 4 Seater', 'Indore', '2', NULL, 'google', 'Local Search', 'local taxi service', 'converted', 'Medical appointment and shopping assistance');

-- Update some leads with assigned users
UPDATE leads SET assigned_to = 2 WHERE id IN (1, 3, 5, 7, 9, 11, 13, 15, 17, 19);
UPDATE leads SET assigned_to = 3 WHERE id IN (2, 4, 6, 8, 10, 12, 14, 16, 18, 20);