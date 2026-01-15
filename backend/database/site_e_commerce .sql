-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 15, 2026 at 04:34 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `site_e_commerce`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(30) DEFAULT 'admin',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password_hash`, `role`, `is_active`, `last_login_at`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'aymen@gmail.com', '$2y$10$e0NR1C1z4Gk9Hq4nKxvDBeZV2...', 'super_admin', 1, NULL, '2026-01-02 16:56:01', '2026-01-02 16:56:01');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Phones', 'phones', 'Smartphones and mobile phones', 1, '2026-01-14 18:51:35', '2026-01-14 18:51:35'),
(2, 'Airpods', 'airpods', 'Wireless earphones and earbuds', 1, '2026-01-14 18:51:35', '2026-01-14 18:51:35'),
(3, 'Tablets', 'tablets', 'Tablets and iPads', 1, '2026-01-14 18:51:35', '2026-01-14 18:51:35'),
(4, 'Accessories', 'accessories', 'Phone and tech accessories', 1, '2026-01-14 18:51:35', '2026-01-14 18:51:35');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `customer_name` varchar(150) NOT NULL,
  `customer_email` varchar(150) NOT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `admin_reply` text DEFAULT NULL,
  `replied_by` int(11) DEFAULT NULL,
  `replied_at` datetime DEFAULT NULL,
  `status` enum('new','replied','archived') DEFAULT 'new',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `delivery_prices`
--

CREATE TABLE `delivery_prices` (
  `id` int(11) NOT NULL,
  `wilaya` varchar(100) NOT NULL,
  `delivery_type` enum('office','home') NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_logs`
--

CREATE TABLE `email_logs` (
  `id` int(11) NOT NULL,
  `recipient_email` varchar(150) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `related_order_id` int(11) DEFAULT NULL,
  `sent_at` datetime DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_reference` varchar(50) NOT NULL,
  `customer_first_name` varchar(100) NOT NULL,
  `customer_last_name` varchar(100) NOT NULL,
  `customer_email` varchar(150) DEFAULT NULL,
  `customer_phone` varchar(30) DEFAULT NULL,
  `customer_address` text DEFAULT NULL,
  `wilaya` varchar(100) DEFAULT NULL,
  `delivery_type` enum('office','home') DEFAULT NULL,
  `products_total` decimal(10,2) NOT NULL,
  `delivery_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `paid_amount` decimal(10,2) NOT NULL,
  `remaining_amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_confirmed_at` datetime DEFAULT NULL,
  `status` enum('pending_confirmation','confirmed_20_paid','shipped','delivered','completed','cancelled') DEFAULT 'pending_confirmation',
  `admin_notes` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(150) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(180) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `short_description` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `specifications` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `is_available` tinyint(1) DEFAULT 1,
  `main_image` varchar(255) DEFAULT NULL,
  `gallery_images` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `category_id`, `brand`, `short_description`, `description`, `specifications`, `price`, `stock_quantity`, `is_available`, `main_image`, `gallery_images`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'iPhone 15 Pro', 'iphone-15-pro', 1, 'Apple', 'Apple flagship with titanium design', 'Apple flagship with titanium design', '{\"RAM\":\"8 GB\",\"Storage\":\"256 GB\",\"Color\":\"Natural Titanium\",\"Battery\":\"3274 mAh\"}', 195000.00, 10, 1, 'https://fonez.ie/cdn/shop/files/iPhone15ProBlueTitanium_1024x.webp?v=1741000684', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(2, 'Redmi Note 13 Pro', 'redmi-note-13-pro', 1, 'Redmi', 'Affordable phone with AMOLED display', 'Affordable phone with AMOLED display', '{\"RAM\":\"8 GB\",\"Storage\":\"256 GB\",\"Display\":\"AMOLED\",\"Battery\":\"5100 mAh\"}', 58000.00, 10, 1, 'https://i0.wp.com/mstore.ie/wp-content/uploads/2024/02/Redmi-Note-13-Pro-5G-Purple.webp', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(3, 'Huawei MatePad 11', 'huawei-matepad-11', 3, 'Huawei', 'Powerful tablet for work and study', 'Powerful tablet for work and study', '{\"Screen\":\"11 inches\",\"RAM\":\"6 GB\",\"Storage\":\"128 GB\",\"Battery\":\"7250 mAh\"}', 82000.00, 10, 1, 'https://pimcdn.sharafdg.com/images/S200775083_1', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(4, 'Anker Power Bank 20000mAh', 'anker-power-bank-20000mah', 4, 'Anker', 'High capacity fast charging power bank', 'High capacity fast charging power bank', '{\"Capacity\":\"20000 mAh\",\"Ports\":\"USB / USB-C\",\"Fast Charge\":\"Yes\"}', 7800.00, 10, 1, 'https://dz.jumia.is/product/90/5145/1.jpg', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(5, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 1, 'Samsung', 'The ultimate AI-powered flagship', 'The ultimate AI-powered flagship', '{\"RAM\":\"12 GB\",\"Storage\":\"512 GB\",\"Camera\":\"200 MP\",\"Stylus\":\"S-Pen Included\"}', 215000.00, 10, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJRtISxuURSp7ognfp76nQn9', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(6, 'AirPods Pro 2nd Gen', 'airpods-pro-2nd-gen', 2, 'Apple', 'Active Noise Cancellation and transparency', 'Active Noise Cancellation and transparency', '{\"Chip\":\"H2\",\"Battery\":\"6 hours\",\"Case\":\"MagSafe USB-C\"}', 42000.00, 10, 1, 'https://incredideals.co/cdn/shop/files/MTJV3.webp', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(7, 'iPad Air M2', 'ipad-air-m2', 3, 'Apple', 'Light, thin, and incredibly powerful', 'Light, thin, and incredibly powerful', '{\"Processor\":\"Apple M2\",\"Screen\":\"11 inch Liquid Retina\",\"Storage\":\"128 GB\"}', 145000.00, 10, 1, 'https://www.wonderprice.co.uk/image/cache/apple-ipad-air-2024', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(8, 'Logitech MX Master 3S', 'logitech-mx-master-3s', 4, 'Logitech', 'Precision wireless mouse for creators', 'Precision wireless mouse for creators', '{\"DPI\":\"8000\",\"Connectivity\":\"Logi Bolt / BT\",\"Silent\":\"Yes\"}', 18500.00, 10, 1, 'https://www.istudio.store/logitech_mx_master_3s.webp', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(9, 'Realme Buds Air 5', 'realme-buds-air-5', 2, 'Realme', 'Deep bass and clear audio quality', 'Deep bass and clear audio quality', '{\"Driver\":\"12.4mm\",\"Noise Control\":\"Active ANC\",\"Battery\":\"38 hours\"}', 8500.00, 10, 1, 'https://maajkart.com/wp-content/uploads/Realme-Buds-Air-5.webp', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(10, 'Samsung Galaxy Tab S9', 'samsung-galaxy-tab-s9', 3, 'Samsung', 'Water-resistant premium Android tablet', 'Water-resistant premium Android tablet', '{\"Display\":\"Dynamic AMOLED 2X\",\"Protection\":\"IP68\",\"Refresh\":\"120 Hz\"}', 125000.00, 10, 1, 'https://iservicejo.com/wp-content/uploads/2024/08/SM-X616B.png', NULL, 1, '2026-01-14 18:58:24', '2026-01-14 18:58:24'),
(11, 'Xiaomi 13T Pro', 'xiaomi-13t-pro', 1, 'Xiaomi', 'Flagship killer with Leica camera', 'Flagship killer with Leica camera', '{\"RAM\":\"12 GB\",\"Storage\":\"512 GB\",\"Camera\":\"Leica 50 MP\",\"Processor\":\"Dimensity 9200+\"}', 125000.00, 10, 1, 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/xiaomi-13t-pro.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(12, 'Samsung Galaxy A55', 'samsung-galaxy-a55', 1, 'Samsung', 'Mid-range phone with premium design', 'Mid-range phone with premium design', '{\"RAM\":\"8 GB\",\"Storage\":\"256 GB\",\"Camera\":\"50 MP\",\"Battery\":\"5000 mAh\"}', 62000.00, 10, 1, 'https://images.samsung.com/is/image/samsung/p6pim/galaxy-a55.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(13, 'Lenovo Tab P12', 'lenovo-tab-p12', 3, 'Lenovo', 'Large screen tablet for entertainment', 'Large screen tablet for entertainment', '{\"Screen\":\"12.7 inch\",\"RAM\":\"8 GB\",\"Storage\":\"256 GB\",\"Audio\":\"Quad JBL Speakers\"}', 89000.00, 10, 1, 'https://p4-ofp.static.pub/fes/cms/2023/lenovo-tab-p12.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(14, 'Apple Magic Mouse', 'apple-magic-mouse', 4, 'Apple', 'Multi-touch wireless mouse', 'Multi-touch wireless mouse', '{\"Connectivity\":\"Bluetooth\",\"Charging\":\"Lightning\",\"Surface\":\"Multi-Touch\"}', 14500.00, 10, 1, 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/magic-mouse.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(15, 'Sony WH-1000XM5', 'sony-wh-1000xm5', 2, 'Sony', 'Industry-leading noise cancelling headphones', 'Industry-leading noise cancelling headphones', '{\"Noise Canceling\":\"Yes\",\"Battery\":\"30 hours\",\"Microphones\":\"8\"}', 68000.00, 10, 1, 'https://www.sony.com/image/wh1000xm5.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(16, 'OnePlus Nord 3', 'oneplus-nord-3', 1, 'OnePlus', 'Fast and smooth mid-range smartphone', 'Fast and smooth mid-range smartphone', '{\"RAM\":\"16 GB\",\"Storage\":\"256 GB\",\"Processor\":\"Dimensity 9000\",\"Charging\":\"80W\"}', 72000.00, 10, 1, 'https://image01.oneplus.net/ebp/2023/oneplus-nord-3.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(17, 'JBL Charge 5', 'jbl-charge-5', 4, 'JBL', 'Portable waterproof Bluetooth speaker', 'Portable waterproof Bluetooth speaker', '{\"Battery\":\"20 hours\",\"Waterproof\":\"IP67\",\"Bass\":\"Powerful\"}', 22000.00, 10, 1, 'https://www.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/jbl-charge-5.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(18, 'iPad 10th Gen', 'ipad-10th-gen', 3, 'Apple', 'Colorful and powerful everyday tablet', 'Colorful and powerful everyday tablet', '{\"Screen\":\"10.9 inch\",\"Chip\":\"A14 Bionic\",\"Storage\":\"64 GB\"}', 98000.00, 10, 1, 'https://store.storeimages.cdn-apple.com/ipad-10th-gen.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(19, 'Huawei FreeBuds 5', 'huawei-freebuds-5', 2, 'Huawei', 'Open-fit earbuds with ANC', 'Open-fit earbuds with ANC', '{\"Noise Canceling\":\"ANC\",\"Battery\":\"30 hours\",\"Charging\":\"USB-C\"}', 19500.00, 10, 1, 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/audio/freebuds-5.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04'),
(20, 'Baseus USB-C Hub', 'baseus-usb-c-hub', 4, 'Baseus', 'Multiport adapter for laptops', 'Multiport adapter for laptops', '{\"Ports\":\"HDMI, USB 3.0, USB-C\",\"Material\":\"Aluminum\",\"Power Delivery\":\"Yes\"}', 7500.00, 10, 1, 'https://cdn.shopify.com/s/files/baseus-usb-c-hub.webp', NULL, 1, '2026-01-14 19:02:04', '2026-01-14 19:02:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_contact_admin` (`replied_by`);

--
-- Indexes for table `delivery_prices`
--
ALTER TABLE `delivery_prices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_email_order` (`related_order_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_reference` (`order_reference`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_items_order` (`order_id`),
  ADD KEY `fk_order_items_product` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_products_category` (`category_id`),
  ADD KEY `fk_products_admin` (`created_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delivery_prices`
--
ALTER TABLE `delivery_prices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_logs`
--
ALTER TABLE `email_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `fk_contact_admin` FOREIGN KEY (`replied_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `email_logs`
--
ALTER TABLE `email_logs`
  ADD CONSTRAINT `fk_email_order` FOREIGN KEY (`related_order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_admin` FOREIGN KEY (`created_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
