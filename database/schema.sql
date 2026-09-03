-- =====================================================
-- BL-MANSOOR DATABASE
-- Business Land Al-Mansoor
-- =====================================================

CREATE DATABASE IF NOT EXISTS bl_mansoor
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE bl_mansoor;


-- =====================================================
-- USERS
-- المدير والموظفين
-- =====================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    username VARCHAR(100) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM(
        'ADMIN',
        'SALES',
        'INVENTORY',
        'DATA_ENTRY'
    ) NOT NULL DEFAULT 'SALES',

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =====================================================
-- CATEGORIES
-- الأقسام الرئيسية
-- =====================================================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    slug VARCHAR(100) NOT NULL UNIQUE,

    description VARCHAR(255),

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- SUBCATEGORIES
-- الأقسام الفرعية
-- =====================================================

CREATE TABLE subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,

    category_id INT NOT NULL,

    name VARCHAR(100) NOT NULL,

    slug VARCHAR(100) NOT NULL,

    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_subcategory_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    UNIQUE KEY unique_subcategory (
        category_id,
        name
    )
);


-- =====================================================
-- PRODUCTS
-- المنتجات
-- =====================================================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(200) NOT NULL,

    model VARCHAR(100) NOT NULL,

    brand VARCHAR(100) NOT NULL DEFAULT 'TP-Link',

    category_id INT NOT NULL,

    subcategory_id INT NULL,


    -- أسعار المنتج

    cost_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    price DECIMAL(12,2) NOT NULL DEFAULT 0.00,


    -- التخفيضات

    discount_type ENUM(
        'NONE',
        'PERCENTAGE',
        'FIXED'
    ) NOT NULL DEFAULT 'NONE',

    discount_value DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    discount_start DATETIME NULL,

    discount_end DATETIME NULL,


    -- المخزون

    quantity INT NOT NULL DEFAULT 0,

    min_quantity INT NOT NULL DEFAULT 1,


    -- المنتج

    image VARCHAR(500) NULL,

    description TEXT NULL,

    specifications JSON NULL,


    status ENUM(
        'ACTIVE',
        'INACTIVE'
    ) NOT NULL DEFAULT 'ACTIVE',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_product_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,


    CONSTRAINT fk_product_subcategory
        FOREIGN KEY (subcategory_id)
        REFERENCES subcategories(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,


    UNIQUE KEY unique_product_model (
        brand,
        model
    )
);


-- =====================================================
-- PRODUCT IMAGES
-- أكثر من صورة للمنتج مستقبلاً
-- =====================================================

CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    image_path VARCHAR(500) NOT NULL,

    sort_order INT NOT NULL DEFAULT 0,

    is_primary BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_images_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- =====================================================
-- CUSTOMERS
-- الزبائن
-- =====================================================

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    phone VARCHAR(30) NOT NULL,

    governorate VARCHAR(100) NULL,

    district VARCHAR(150) NULL,

    address TEXT NULL,

    notes TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =====================================================
-- ORDERS
-- الطلبات
-- =====================================================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_id INT NULL,

    order_number VARCHAR(50) NOT NULL UNIQUE,

    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    total DECIMAL(12,2) NOT NULL DEFAULT 0.00,


    status ENUM(
        'NEW',
        'CONFIRMED',
        'PROCESSING',
        'READY',
        'SHIPPED',
        'COMPLETED',
        'CANCELLED'
    ) NOT NULL DEFAULT 'NEW',


    payment_method ENUM(
        'CASH_ON_DELIVERY',
        'BANK_TRANSFER',
        'ZAIN_CASH',
        'ASIA_HAWALA',
        'OTHER'
    ) NOT NULL DEFAULT 'CASH_ON_DELIVERY',


    payment_status ENUM(
        'PENDING',
        'PAID',
        'FAILED'
    ) NOT NULL DEFAULT 'PENDING',


    shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    shipping_governorate VARCHAR(100) NULL,

    shipping_address TEXT NULL,

    notes TEXT NULL,


    created_by INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,


    CONSTRAINT fk_order_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE SET NULL,


    CONSTRAINT fk_order_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- =====================================================
-- ORDER ITEMS
-- تفاصيل الطلب
-- =====================================================

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT NOT NULL,

    product_id INT NULL,


    -- نحفظ بيانات المنتج وقت الطلب
    -- حتى لا تتغير الطلبات القديمة إذا تغير السعر لاحقاً

    product_name VARCHAR(200) NOT NULL,

    model VARCHAR(100) NULL,


    quantity INT NOT NULL DEFAULT 1,

    unit_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    discount DECIMAL(12,2) NOT NULL DEFAULT 0.00,

    total DECIMAL(12,2) NOT NULL DEFAULT 0.00,


    CONSTRAINT fk_order_item_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_order_item_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE SET NULL
);


-- =====================================================
-- INVENTORY TRANSACTIONS
-- حركة المخزون
-- =====================================================

CREATE TABLE inventory_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    user_id INT NULL,


    transaction_type ENUM(
        'PURCHASE',
        'SALE',
        'RETURN',
        'ADJUSTMENT',
        'DAMAGE'
    ) NOT NULL,


    quantity INT NOT NULL,

    reference_type VARCHAR(50) NULL,

    reference_id INT NULL,

    note TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,


    CONSTRAINT fk_inventory_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,


    CONSTRAINT fk_inventory_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE SET NULL
);


-- =====================================================
-- SETTINGS
-- إعدادات المتجر
-- =====================================================

CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    setting_key VARCHAR(100) NOT NULL UNIQUE,

    setting_value TEXT NULL,

    updated_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- =====================================================
-- DEFAULT CATEGORIES
-- الأقسام الرئيسية
-- =====================================================

INSERT INTO categories
    (name, slug, description)
VALUES
    ('TP-Link', 'tplink', 'منتجات TP-Link'),
    ('TP-Link Switches', 'switches', 'سويجات TP-Link'),
    ('Omada', 'omada', 'منتجات TP-Link Omada'),
    ('VIGI', 'vigi', 'منتجات المراقبة VIGI'),
    ('Tapo', 'tapo', 'منتجات المنزل الذكي Tapo');


-- =====================================================
-- OMADA SUBCATEGORIES
-- =====================================================

INSERT INTO subcategories
    (category_id, name, slug)
VALUES

(
    (SELECT id FROM categories WHERE slug = 'omada'),
    'Access Points',
    'access-points'
),

(
    (SELECT id FROM categories WHERE slug = 'omada'),
    'Switches',
    'switches'
),

(
    (SELECT id FROM categories WHERE slug = 'omada'),
    'Gateways',
    'gateways'
),

(
    (SELECT id FROM categories WHERE slug = 'omada'),
    'Controllers',
    'controllers'
);


-- =====================================================
-- TP-LINK SWITCHES SUBCATEGORIES
-- =====================================================

INSERT INTO subcategories
    (category_id, name, slug)
VALUES

(
    (SELECT id FROM categories WHERE slug = 'switches'),
    'Unmanaged Switches',
    'unmanaged'
),

(
    (SELECT id FROM categories WHERE slug = 'switches'),
    'PoE Switches',
    'poe'
);


-- =====================================================
-- TP-LINK SUBCATEGORIES
-- =====================================================

INSERT INTO subcategories
    (category_id, name, slug)
VALUES

(
    (SELECT id FROM categories WHERE slug = 'tplink'),
    'Routers',
    'routers'
),

(
    (SELECT id FROM categories WHERE slug = 'tplink'),
    'Range Extenders',
    'range-extenders'
),

(
    (SELECT id FROM categories WHERE slug = 'tplink'),
    'Adapters',
    'adapters'
);


-- =====================================================
-- VIGI SUBCATEGORIES
-- =====================================================

INSERT INTO subcategories
    (category_id, name, slug)
VALUES

(
    (SELECT id FROM categories WHERE slug = 'vigi'),
    'IP Cameras',
    'ip-cameras'
),

(
    (SELECT id FROM categories WHERE slug = 'vigi'),
    'Bullet Cameras',
    'bullet-cameras'
),

(
    (SELECT id FROM categories WHERE slug = 'vigi'),
    'Dome Cameras',
    'dome-cameras'
),

(
    (SELECT id FROM categories WHERE slug = 'vigi'),
    'NVR',
    'nvr'
);


-- =====================================================
-- TAPO SUBCATEGORIES
-- =====================================================

INSERT INTO subcategories
    (category_id, name, slug)
VALUES

(
    (SELECT id FROM categories WHERE slug = 'tapo'),
    'Cameras',
    'cameras'
),

(
    (SELECT id FROM categories WHERE slug = 'tapo'),
    'Smart Plugs',
    'smart-plugs'
),

(
    (SELECT id FROM categories WHERE slug = 'tapo'),
    'Smart Bulbs',
    'smart-bulbs'
),

(
    (SELECT id FROM categories WHERE slug = 'tapo'),
    'Sensors',
    'sensors'
);


-- =====================================================
-- STORE SETTINGS
-- =====================================================

INSERT INTO settings
    (setting_key, setting_value)
VALUES
    ('store_name', 'BL-Mansoor'),
    ('store_name_en', 'Business Land Al-Mansoor'),
    ('currency', 'IQD'),
    ('country', 'Iraq'),
    ('city', 'Baghdad');