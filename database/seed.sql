USE bl_mansoor;

INSERT INTO products
(
    name,
    model,
    brand,
    category_id,
    subcategory_id,
    cost_price,
    price,
    discount_type,
    discount_value,
    quantity,
    min_quantity,
    image,
    description,
    specifications,
    status
)
VALUES

(
    'Omada EAP653',
    'EAP653',
    'TP-Link Omada',
    (SELECT id FROM categories WHERE slug = 'omada'),
    (SELECT id FROM subcategories
        WHERE slug = 'access-points'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'omada'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    NULL,
    'AX3000 Ceiling Mount Wi-Fi 6 Access Point',
    JSON_OBJECT(
        'Wi-Fi', 'Wi-Fi 6',
        'Class', 'AX3000',
        'Port', 'Gigabit',
        'Power', '802.3at PoE+ / DC'
    ),
    'ACTIVE'
),

(
    'Omada EAP673',
    'EAP673',
    'TP-Link Omada',
    (SELECT id FROM categories WHERE slug = 'omada'),
    (SELECT id FROM subcategories
        WHERE slug = 'access-points'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'omada'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    NULL,
    'AX5400 Ceiling Mount Wi-Fi 6 Access Point',
    JSON_OBJECT(
        'Wi-Fi', 'Wi-Fi 6',
        'Class', 'AX5400',
        'Port', '2.5 Gigabit',
        'Power', '802.3at PoE+ / DC'
    ),
    'ACTIVE'
),

(
    'Omada Hardware Controller',
    'OC200',
    'TP-Link Omada',
    (SELECT id FROM categories WHERE slug = 'omada'),
    (SELECT id FROM subcategories
        WHERE slug = 'controllers'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'omada'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    NULL,
    'Hardware Controller for Omada network management',
    JSON_OBJECT(
        'Category', 'Controller',
        'Platform', 'Omada SDN'
    ),
    'ACTIVE'
),

(
    'TP-Link TL-SG105',
    'TL-SG105',
    'TP-Link',
    (SELECT id FROM categories WHERE slug = 'switches'),
    (SELECT id FROM subcategories
        WHERE slug = 'unmanaged'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'switches'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    NULL,
    '5-Port Gigabit Desktop Switch',
    JSON_OBJECT(
        'Ports', '5 x Gigabit',
        'Type', 'Unmanaged',
        'Installation', 'Desktop'
    ),
    'ACTIVE'
),

(
    'TP-Link TL-SG108',
    'TL-SG108',
    'TP-Link',
    (SELECT id FROM categories WHERE slug = 'switches'),
    (SELECT id FROM subcategories
        WHERE slug = 'unmanaged'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'switches'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    NULL,
    '8-Port Gigabit Desktop Switch',
    JSON_OBJECT(
        'Ports', '8 x Gigabit',
        'Type', 'Unmanaged',
        'Installation', 'Desktop'
    ),
    'ACTIVE'
),

(
    'TP-Link Archer BE230',
    'Archer BE230',
    'TP-Link',
    (SELECT id FROM categories WHERE slug = 'tplink'),
    (SELECT id FROM subcategories
        WHERE slug = 'routers'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'tplink'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    'images/archer-be230.png',
    'BE3600 Dual-Band Wi-Fi 7 Router',
    JSON_OBJECT(
        'Wi-Fi', 'Wi-Fi 7',
        'Class', 'BE3600',
        'Bands', 'Dual-Band',
        'Port', '2.5G Multi-Gig'
    ),
    'ACTIVE'
),

(
    'TP-Link Archer AX23',
    'Archer AX23',
    'TP-Link',
    (SELECT id FROM categories WHERE slug = 'tplink'),
    (SELECT id FROM subcategories
        WHERE slug = 'routers'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'tplink'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    NULL,
    'Wi-Fi 6 Router',
    JSON_OBJECT(
        'Wi-Fi', 'Wi-Fi 6',
        'Category', 'Router'
    ),
    'ACTIVE'
),

(
    'VIGI C340',
    'VIGI C340',
    'TP-Link VIGI',
    (SELECT id FROM categories WHERE slug = 'vigi'),
    (SELECT id FROM subcategories
        WHERE slug = 'bullet-cameras'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'vigi'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    'images/vigi-c340.png',
    '4MP Outdoor Full-Color Bullet Network Camera',
    JSON_OBJECT(
        'Resolution', '4MP',
        'Type', 'Bullet',
        'Use', 'Outdoor'
    ),
    'ACTIVE'
),

(
    'Tapo C220',
    'Tapo C220',
    'TP-Link Tapo',
    (SELECT id FROM categories WHERE slug = 'tapo'),
    (SELECT id FROM subcategories
        WHERE slug = 'cameras'
        AND category_id = (
            SELECT id FROM categories WHERE slug = 'tapo'
        )),
    0,
    0,
    'NONE',
    0,
    0,
    1,
    'images/tapo-c220.png',
    'Pan/Tilt Home Security Wi-Fi Camera',
    JSON_OBJECT(
        'Resolution', '2K QHD',
        'Pan', '360° Coverage',
        'Tilt', '111.3° Coverage',
        'Storage', 'microSD'
    ),
    'ACTIVE'
);