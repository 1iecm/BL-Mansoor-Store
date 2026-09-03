/* =====================================================
   BL-MANSOOR BACKEND
   Node.js + Express + MySQL
===================================================== */

const path = require("path");
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MySQLStore =
    require("express-mysql-session")(session);

/* =====================================================
   APP
===================================================== */

const app = express();
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST || "127.0.0.1",

    port: Number(
        process.env.DB_PORT || 3306
    ),

    user:
        process.env.DB_USER ||
        "root",

    password:
        process.env.DB_PASSWORD ||
        "blmansoor_root_2026",

    database:
        process.env.DB_NAME ||
        "bl_mansoor"
});

app.use(
    session({
        key: "bl_mansoor_admin_session",
        secret:
            process.env.SESSION_SECRET ||
            "BL-Mansoor-Session-Secret-2026",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 8
        }
    })
);
const productsImageDirectory =
    path.join(
        __dirname,
        "..",
        "images",
        "products"
    );

if (!fs.existsSync(productsImageDirectory)) {
    fs.mkdirSync(
        productsImageDirectory,
        {
            recursive: true
        }
    );
}

const PORT =
    process.env.PORT || 4000;


/* =====================================================
   DATABASE
===================================================== */

const db = mysql.createPool({

    host:
        process.env.DB_HOST ||
        "127.0.0.1",

    port:
        Number(
            process.env.DB_PORT ||
            3306
        ),

    user:
        process.env.DB_USER ||
        "root",

    password:
        process.env.DB_PASSWORD ||
        "blmansoor_root_2026",

    database:
        process.env.DB_NAME ||
        "bl_mansoor",

    waitForConnections:
        true,

    connectionLimit:
        10,

    queueLimit:
        0

});


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(
    cors({
        origin: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


app.use(
    express.json({
        limit: "2mb"
    })
);
app.post(
    "/api/admin/login",
    async (req, res) => {

        try {

            const username =
                String(req.body.username || "").trim();

            const password =
                String(req.body.password || "");

            if (!username || !password) {

                return res.status(400).json({
                    success: false,
                    message: "أدخل اسم المستخدم وكلمة المرور"
                });

            }

            const [rows] = await db.query(
                `
                SELECT
                    id,
                    username,
                    password_hash
                FROM admin_users
                WHERE username = ?
                LIMIT 1
                `,
                [username]
            );

            if (
                !rows.length ||
                !(await bcrypt.compare(
                    password,
                    rows[0].password_hash
                ))
            ) {

                return res.status(401).json({
                    success: false,
                    message: "اسم المستخدم أو كلمة المرور غير صحيحة"
                });

            }

            req.session.adminUser = {
                id: rows[0].id,
                username: rows[0].username
            };

            res.json({
                success: true,
                message: "تم تسجيل الدخول بنجاح"
            });

        } catch (error) {

            console.error(
                "Admin Login Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "حدث خطأ أثناء تسجيل الدخول"
            });

        }

    }
);
app.post(
    "/api/admin/logout",
    (req, res) => {

        req.session.destroy((error) => {

            if (error) {

                console.error(
                    "Admin Logout Error:",
                    error
                );

                return res.status(500).json({
                    success: false,
                    message: "فشل تسجيل الخروج"
                });
            }

            res.clearCookie(
                "bl_mansoor_admin_session"
            );

            res.json({
                success: true,
                message: "تم تسجيل الخروج بنجاح"
            });

        });

    }
);
function requireAdmin(req, res, next) {

    if (
        req.session &&
        req.session.adminUser
    ) {
        return next();
    }

    return res.redirect("/admin/index.html");
}


app.get(
    "/admin/dashboard.html",
    requireAdmin,
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "..",
                "admin",
                "dashboard.html"
            )
        );

    }
);
/* =====================================================
   STATIC FILES
===================================================== */

app.use(
    express.static(
        path.join(
            __dirname,
            ".."
        )
    )
);
app.use(
    "/images",
    express.static(
        path.join(
            __dirname,
            "..",
            "images"
        )
    )
);
/* =====================================================
   IMAGE UPLOAD
===================================================== */

const imageStorage = multer.diskStorage({

    destination: function (req, file, cb) {

        cb(
            null,
            productsImageDirectory
        );

    },

    filename: function (req, file, cb) {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        const fileName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(
            null,
            fileName
        );

    }

});


const upload = multer({

    storage: imageStorage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: function (req, file, cb) {

        if (
            file.mimetype.startsWith("image/")
        ) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "الملف يجب أن يكون صورة."
                )
            );

        }

    }

});
/* =====================================================
   HELPERS
===================================================== */

function cleanString(value) {

    return String(
        value ?? ""
    ).trim();

}


function toNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


function normalizeDiscountType(
    value
) {

    const type =
        String(
            value ||
            "NONE"
        )
        .trim()
        .toUpperCase();


    if (
        type === "PERCENTAGE" ||
        type === "FIXED"
    ) {

        return type;

    }


    return "NONE";

}


/* =====================================================
   SLUG GENERATOR
===================================================== */

function makeSlug(value) {

    let slug =
        String(value || "")
            .trim()
            .toLowerCase()
            .normalize("NFKD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .replace(
                /[^a-z0-9\u0600-\u06ff]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );


    if (!slug) {

        slug = "item";

    }


    return slug;

}


/* =====================================================
   SPECIFICATIONS
===================================================== */

function parseSpecifications(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return {};

    }


    if (
        typeof value === "object"
    ) {

        return value;

    }


    try {

        return JSON.parse(
            value
        );

    } catch {

        throw new Error(
            "المواصفات يجب أن تكون JSON صحيحة."
        );

    }

}


/* =====================================================
   CATEGORY
   Creates slug automatically
===================================================== */

async function getOrCreateCategory(
    connection,
    categoryName
) {

    const name =
        cleanString(
            categoryName
        );


    if (!name) {

        throw new Error(
            "Category is required"
        );

    }


    /* ---------------------------------------------
       Search existing category
    --------------------------------------------- */

    const [
        rows
    ] =
        await connection.query(
            `
            SELECT
                id,
                name,
                slug
            FROM categories
            WHERE LOWER(name) = LOWER(?)
            LIMIT 1
            `,
            [name]
        );


    if (
        rows.length > 0
    ) {

        return rows[0].id;

    }


    /* ---------------------------------------------
       Generate unique slug
    --------------------------------------------- */

    const baseSlug =
        makeSlug(name);


    let slug =
        baseSlug;


    let counter =
        2;


    while (true) {

        const [
            slugRows
        ] =
            await connection.query(
                `
                SELECT id
                FROM categories
                WHERE slug = ?
                LIMIT 1
                `,
                [slug]
            );


        if (
            slugRows.length === 0
        ) {

            break;

        }


        slug =
            `${baseSlug}-${counter}`;

        counter++;

    }


    /* ---------------------------------------------
       Create category
    --------------------------------------------- */

    const [
        result
    ] =
        await connection.query(
            `
            INSERT INTO categories
            (
                name,
                slug
            )
            VALUES
            (
                ?,
                ?
            )
            `,
            [
                name,
                slug
            ]
        );


    return result.insertId;

}


/* =====================================================
   SUBCATEGORY
   Creates slug automatically
===================================================== */

async function getOrCreateSubcategory(
    connection,
    subcategoryName,
    categoryId
) {

    const name =
        cleanString(
            subcategoryName
        );


    if (!name) {

        return null;

    }


    /* ---------------------------------------------
       Search existing subcategory
    --------------------------------------------- */

    const [
        rows
    ] =
        await connection.query(
            `
            SELECT
                id,
                name,
                slug
            FROM subcategories
            WHERE category_id = ?
              AND LOWER(name) = LOWER(?)
            LIMIT 1
            `,
            [
                categoryId,
                name
            ]
        );


    if (
        rows.length > 0
    ) {

        return rows[0].id;

    }


    /* ---------------------------------------------
       Generate slug
    --------------------------------------------- */

    const baseSlug =
        makeSlug(name);


    let slug =
        baseSlug;


    let counter =
        2;


    while (true) {

        const [
            slugRows
        ] =
            await connection.query(
                `
                SELECT id
                FROM subcategories
                WHERE slug = ?
                LIMIT 1
                `,
                [slug]
            );


        if (
            slugRows.length === 0
        ) {

            break;

        }


        slug =
            `${baseSlug}-${counter}`;

        counter++;

    }


    /* ---------------------------------------------
       Create subcategory
    --------------------------------------------- */

    const [
        result
    ] =
        await connection.query(
            `
            INSERT INTO subcategories
            (
                category_id,
                name,
                slug
            )
            VALUES
            (
                ?,
                ?,
                ?
            )
            `,
            [
                categoryId,
                name,
                slug
            ]
        );


    return result.insertId;

}


/* =====================================================
   ROOT
===================================================== */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                __dirname,
                "..",
                "index.html"
            )
        );

    }
);


/* =====================================================
   HEALTH
===================================================== */
/* =====================================================
   UPLOAD PRODUCT IMAGE API
===================================================== */

app.post(
    "/api/admin/upload-image",
    upload.single("image"),
    (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    success: false,
                    message: "لم يتم اختيار صورة"
                });

            }

            const imagePath =
                `images/products/${req.file.filename}`;

            res.json({
                success: true,
                image: imagePath,
                filename: req.file.filename
            });

        } catch (error) {

            console.error(
                "IMAGE UPLOAD ERROR:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "فشل رفع الصورة"
            });

        }

    }
);
app.get(
    "/api/health",
    async (req, res) => {

        try {

            const [
                rows
            ] =
                await db.query(
                    `
                    SELECT
                        DATABASE()
                        AS database_name
                    `
                );


            res.json({

                success:
                    true,

                server:
                    "online",

                database:
                    rows[0]
                        ?.database_name ||
                    null

            });


        } catch (error) {

            console.error(
                "Health Error:",
                error
            );


            res.status(500)
                .json({

                    success:
                        false,

                    server:
                        "online",

                    database:
                        "connection failed"

                });

        }

    }
);


/* =====================================================
   DATABASE TEST
===================================================== */

app.get(
    "/api/db-test",
    async (req, res) => {

        try {

            const [
                rows
            ] =
                await db.query(
                    `
                    SELECT
                        DATABASE()
                        AS database_name
                    `
                );


            res.json({

                success:
                    true,

                database:
                    rows[0]
                        .database_name

            });


        } catch (error) {

            console.error(
                "Database Test Error:",
                error
            );


            res.status(500)
                .json({

                    success:
                        false,

                    message:
                        "Database connection failed"

                });

        }

    }
);


/* =====================================================
   PUBLIC PRODUCTS
===================================================== */

app.get(
    "/api/products",
    async (req, res) => {

        try {

            const [
                rows
            ] =
                await db.query(
                    `
                    SELECT

                        p.id,

                        p.name,

                        p.model,

                        p.brand,

                        c.name
                            AS category,

                        s.name
                            AS subcategory,

                        p.cost_price,

                        p.price,

                        p.discount_type,

                        p.discount_value,

                        p.discount_start,

                        p.discount_end,

                        p.quantity,

                        p.min_quantity,

                        p.image,

                        p.description,

                        p.specifications,

                        p.status

                    FROM products p

                    LEFT JOIN categories c
                        ON
                            p.category_id =
                            c.id

                    LEFT JOIN subcategories s
                        ON
                            p.subcategory_id =
                            s.id

                    WHERE
                        p.status =
                        'ACTIVE'

                    ORDER BY
                        p.id DESC
                    `
                );


            res.json({

                success:
                    true,

                count:
                    rows.length,

                products:
                    rows

            });


        } catch (error) {

            console.error(
                "Products API Error:",
                error
            );


            res.status(500)
                .json({

                    success:
                        false,

                    message:
                        "Failed to load products"

                });

        }

    }
);


/* =====================================================
   ADMIN PRODUCTS - GET ALL
===================================================== */

app.get(
    "/api/admin/products",
    async (req, res) => {

        try {

            const [
                rows
            ] =
                await db.query(
                    `
                    SELECT

                        p.id,

                        p.name,

                        p.model,

                        p.brand,

                        p.category_id,

                        c.name
                            AS category,

                        p.subcategory_id,

                        s.name
                            AS subcategory,

                        p.cost_price,

                        p.price,

                        p.discount_type,

                        p.discount_value,

                        p.discount_start,

                        p.discount_end,

                        p.quantity,

                        p.min_quantity,

                        p.image,

                        p.description,

                        p.specifications,

                        p.status

                    FROM products p

                    LEFT JOIN categories c
                        ON
                            p.category_id =
                            c.id

                    LEFT JOIN subcategories s
                        ON
                            p.subcategory_id =
                            s.id

                    ORDER BY
                        p.id DESC
                    `
                );


            res.json({

                success:
                    true,

                count:
                    rows.length,

                products:
                    rows

            });


        } catch (error) {

            console.error(
                "Admin Products GET Error:",
                error
            );


            res.status(500)
                .json({

                    success:
                        false,

                    message:
                        "Failed to load admin products"

                });

        }

    }
);
app.post(
    "/api/orders",
    async (req, res) => {

        let connection;

        try {

            const customerName =
                String(
                    req.body.customer_name || ""
                ).trim();

            const customerPhone =
                String(
                    req.body.customer_phone || ""
                ).trim();

            const customerAddress =
                String(
                    req.body.customer_address || ""
                ).trim();

            const items =
                Array.isArray(req.body.items)
                    ? req.body.items
                    : [];


            if (!customerName) {

                return res.status(400).json({
                    success: false,
                    message: "الاسم الكامل مطلوب"
                });

            }


            if (!customerPhone) {

                return res.status(400).json({
                    success: false,
                    message: "رقم الهاتف مطلوب"
                });

            }


            if (!customerAddress) {

                return res.status(400).json({
                    success: false,
                    message: "عنوان التوصيل مطلوب"
                });

            }


            if (!items.length) {

                return res.status(400).json({
                    success: false,
                    message: "السلة فارغة"
                });

            }


            connection =
                await db.getConnection();


            await connection.beginTransaction();


            /* =========================================
               CUSTOMER
            ========================================= */

            const [customerRows] =
                await connection.query(
                    `
                    SELECT
                        id
                    FROM customers
                    WHERE phone = ?
                    LIMIT 1
                    `,
                    [
                        customerPhone
                    ]
                );


            let customerId;


            if (customerRows.length) {

                customerId =
                    customerRows[0].id;


                await connection.query(
                    `
                    UPDATE customers
                    SET
                        name = ?,
                        address = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    `,
                    [
                        customerName,
                        customerAddress,
                        customerId
                    ]
                );

            } else {

                const [customerResult] =
                    await connection.query(
                        `
                        INSERT INTO customers
                        (
                            name,
                            phone,
                            address
                        )
                        VALUES
                        (?, ?, ?)
                        `,
                        [
                            customerName,
                            customerPhone,
                            customerAddress
                        ]
                    );


                customerId =
                    customerResult.insertId;

            }


            /* =========================================
               PRODUCTS + TOTAL
            ========================================= */

            const orderItems = [];

            let subtotal = 0;


            for (
                const item of items
            ) {

                const productId =
                    Number(item.id);

                const quantity =
                    Number(item.quantity);


                if (
                    !Number.isInteger(productId) ||
                    !Number.isInteger(quantity) ||
                    quantity <= 0
                ) {

                    throw new Error(
                        "بيانات المنتج غير صحيحة"
                    );

                }


                const [productRows] =
                    await connection.query(
                        `
                        SELECT
                            id,
                            name,
                            model,
                            price,
                            discount_type,
                            discount_value,
                            quantity AS stock
                        FROM products
                        WHERE
                            id = ?
                            AND status = 'ACTIVE'
                        LIMIT 1
                        `,
                        [
                            productId
                        ]
                    );


                if (!productRows.length) {

                    throw new Error(
                        "أحد المنتجات غير موجود أو غير فعال"
                    );

                }


                const product =
                    productRows[0];


                if (
                    Number(product.stock) <
                    quantity
                ) {

                    throw new Error(
                        `المنتج "${product.name}" غير متوفر بالكمية المطلوبة`
                    );

                }


                const unitPrice =
                    Number(product.price) || 0;


                const lineTotal =
                    unitPrice * quantity;


                subtotal += lineTotal;


                orderItems.push({

                    product_id:
                        product.id,

                    product_name:
                        product.name,

                    model:
                        product.model,

                    quantity:
                        quantity,

                    unit_price:
                        unitPrice,

                    discount:
                        0,

                    total:
                        lineTotal

                });

            }


            /* =========================================
               ORDER
            ========================================= */

            const orderNumber =
                "BL-" +
                Date.now().toString().slice(-10);


            const shippingFee = 0;

            const discount = 0;

            const total =
                subtotal -
                discount +
                shippingFee;


            const [orderResult] =
                await connection.query(
                    `
                    INSERT INTO orders
                    (
                        customer_id,
                        order_number,
                        subtotal,
                        discount,
                        total,
                        status,
                        payment_method,
                        payment_status,
                        shipping_fee,
                        shipping_address
                    )
                    VALUES
                    (
                        ?, ?, ?, ?, ?,
                        'NEW',
                        'CASH_ON_DELIVERY',
                        'PENDING',
                        ?,
                        ?
                    )
                    `,
                    [
                        customerId,
                        orderNumber,
                        subtotal,
                        discount,
                        total,
                        shippingFee,
                        customerAddress
                    ]
                );


            const orderId =
                orderResult.insertId;


            /* =========================================
               ORDER ITEMS
            ========================================= */

            for (
                const item of orderItems
            ) {

                await connection.query(
                    `
                    INSERT INTO order_items
                    (
                        order_id,
                        product_id,
                        product_name,
                        model,
                        quantity,
                        unit_price,
                        discount,
                        total
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        orderId,
                        item.product_id,
                        item.product_name,
                        item.model,
                        item.quantity,
                        item.unit_price,
                        item.discount,
                        item.total
                    ]
                );

            }


            await connection.commit();


            res.json({
                success: true,
                message: "تم إنشاء الطلب بنجاح",
                order_id: orderId,
                order_number: orderNumber,
                total: total
            });


        } catch (error) {


            if (connection) {

                await connection.rollback();

            }


            console.error(
                "Create Order Error:",
                error
            );


            res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "فشل إنشاء الطلب"
            });


        } finally {


            if (connection) {

                connection.release();

            }

        }

    }
);
app.get(
    "/api/admin/orders",
    requireAdmin,
    async (req, res) => {

        try {

            const [rows] = await db.query(`
                SELECT
                    o.id,
                    o.order_number,
                    c.name AS customer_name,
                    c.phone AS customer_phone,
                    c.address AS customer_address,
                    o.subtotal,
                    o.discount,
                    o.total,
                    o.status,
                    o.payment_method,
                    o.payment_status,
                    o.created_at,

                    COUNT(oi.id) AS item_count,

                    COALESCE(
                        GROUP_CONCAT(
                            CONCAT(
                                oi.product_name,
                                ' × ',
                                oi.quantity
                            )
                            SEPARATOR '، '
                        ),
                        ''
                    ) AS items

                FROM orders o

                LEFT JOIN customers c
                    ON c.id = o.customer_id

                LEFT JOIN order_items oi
                    ON oi.order_id = o.id

                GROUP BY
                    o.id,
                    o.order_number,
                    c.name,
                    c.phone,
                    c.address,
                    o.subtotal,
                    o.discount,
                    o.total,
                    o.status,
                    o.payment_method,
                    o.payment_status,
                    o.created_at

                ORDER BY
                    o.id DESC

                LIMIT 20
            `);

            res.json({
                success: true,
                orders: rows
            });

        } catch (error) {

            console.error(
                "Admin Orders Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "فشل تحميل الطلبات"
            });

        }

    }
);
app.get(
    "/api/admin/orders/:id",
    requireAdmin,
    async (req, res) => {
        try {
            const orderId = Number(req.params.id);

            if (!Number.isInteger(orderId) || orderId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "رقم الطلب غير صالح"
                });
            }

            const [orderRows] = await db.query(
                `
                SELECT
                    o.id,
                    o.order_number,
                    o.subtotal,
                    o.discount,
                    o.total,
                    o.status,
                    o.payment_method,
                    o.payment_status,
                    o.shipping_fee,
                    o.shipping_address,
                    o.notes,
                    o.created_at,
                    c.name AS customer_name,
                    c.phone AS customer_phone,
                    c.governorate AS customer_governorate,
                    c.district AS customer_district,
                    c.address AS customer_address
                FROM orders o
                LEFT JOIN customers c
                    ON c.id = o.customer_id
                WHERE o.id = ?
                `,
                [orderId]
            );

            if (orderRows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "الطلب غير موجود"
                });
            }

            const [itemRows] = await db.query(
                `
                SELECT
                    id,
                    product_id,
                    product_name,
                    model,
                    quantity,
                    unit_price,
                    discount,
                    total
                FROM order_items
                WHERE order_id = ?
                ORDER BY id ASC
                `,
                [orderId]
            );

            res.json({
                success: true,
                order: orderRows[0],
                items: itemRows
            });

        } catch (error) {
            console.error(
                "Admin Order Details Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "فشل تحميل تفاصيل الطلب"
            });
        }
    }
);
app.put(
    "/api/admin/orders/:id/status",
    requireAdmin,
    async (req, res) => {
        let connection;

        try {
            const orderId = Number(req.params.id);
            const newStatus = String(req.body.status || "").trim();

            const allowedStatuses = [
                "NEW",
                "CONFIRMED",
                "PROCESSING",
                "READY",
                "SHIPPED",
                "COMPLETED",
                "CANCELLED"
            ];

            if (
                !Number.isInteger(orderId) ||
                orderId <= 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: "رقم الطلب غير صالح"
                });
            }

            if (!allowedStatuses.includes(newStatus)) {
                return res.status(400).json({
                    success: false,
                    message: "حالة الطلب غير صالحة"
                });
            }

            connection = await db.getConnection();

            await connection.beginTransaction();

            const [orderRows] = await connection.query(
                `
                SELECT id, status
                FROM orders
                WHERE id = ?
                FOR UPDATE
                `,
                [orderId]
            );

            if (orderRows.length === 0) {
                await connection.rollback();

                return res.status(404).json({
                    success: false,
                    message: "الطلب غير موجود"
                });
            }

            const oldStatus = orderRows[0].status;
            if (
    newStatus === "CANCELLED" &&
    (
        oldStatus === "SHIPPED" ||
        oldStatus === "COMPLETED"
    )
) {
    await connection.rollback();

    return res.status(400).json({
        success: false,
        message: "لا يمكن إلغاء الطلب بعد شحنه أو إكماله"
    });
}

            const [items] = await connection.query(
                `
                SELECT
                    product_id,
                    quantity,
                    product_name
                FROM order_items
                WHERE order_id = ?
                `,
                [orderId]
            );

            if (newStatus === "CONFIRMED") {

                const [saleTransactions] =
                    await connection.query(
                        `
                        SELECT id
                        FROM inventory_transactions
                        WHERE reference_type = 'ORDER'
                          AND reference_id = ?
                          AND transaction_type = 'SALE'
                        LIMIT 1
                        `,
                        [orderId]
                    );

                if (
    saleTransactions.length === 0 ||
    oldStatus === "CANCELLED"
) {

                    for (const item of items) {

                        const [products] =
                            await connection.query(
                                `
                                SELECT
                                    id,
                                    quantity
                                FROM products
                                WHERE id = ?
                                FOR UPDATE
                                `,
                                [item.product_id]
                            );

                        if (products.length === 0) {
                            throw new Error(
                                `المنتج غير موجود: ${item.product_name}`
                            );
                        }

                        const currentQuantity =
                            Number(products[0].quantity);

                        const requestedQuantity =
                            Number(item.quantity);

                        if (
                            currentQuantity <
                            requestedQuantity
                        ) {
                            throw new Error(
                                `الكمية غير كافية للمنتج: ${item.product_name}`
                            );
                        }

                        await connection.query(
                            `
                            UPDATE products
                            SET quantity = quantity - ?
                            WHERE id = ?
                            `,
                            [
                                requestedQuantity,
                                item.product_id
                            ]
                        );

                        await connection.query(
                            `
                            INSERT INTO inventory_transactions
                            (
                                product_id,
                                user_id,
                                transaction_type,
                                quantity,
                                reference_type,
                                reference_id,
                                note
                            )
                            VALUES (?, ?, 'SALE', ?, 'ORDER', ?, ?)
                            `,
                            [
                                item.product_id,
                                null,
                                requestedQuantity,
                                orderId,
                                `بيع ضمن الطلب ${orderId}`
                            ]
                        );
                    }
                }
            }

            if (newStatus === "CANCELLED") {

                const [saleTransactions] =
                    await connection.query(
                        `
                        SELECT
                            product_id,
                            quantity
                        FROM inventory_transactions
                        WHERE reference_type = 'ORDER'
                          AND reference_id = ?
                          AND transaction_type = 'SALE'
                        `,
                        [orderId]
                    );

                const [returnTransactions] =
                    await connection.query(
                        `
                        SELECT
                            product_id,
                            quantity
                        FROM inventory_transactions
                        WHERE reference_type = 'ORDER'
                          AND reference_id = ?
                          AND transaction_type = 'RETURN'
                        `,
                        [orderId]
                    );

                if (
                    saleTransactions.length > 0 &&
                    returnTransactions.length === 0
                ) {

                    for (const transaction of saleTransactions) {

                        await connection.query(
                            `
                            UPDATE products
                            SET quantity = quantity + ?
                            WHERE id = ?
                            `,
                            [
                                transaction.quantity,
                                transaction.product_id
                            ]
                        );

                        await connection.query(
                            `
                            INSERT INTO inventory_transactions
                            (
                                product_id,
                                user_id,
                                transaction_type,
                                quantity,
                                reference_type,
                                reference_id,
                                note
                            )
                            VALUES (?, ?, 'RETURN', ?, 'ORDER', ?, ?)
                            `,
                            [
                                transaction.product_id,
                                null,
                                transaction.quantity,
                                orderId,
                                `إرجاع مخزون بسبب إلغاء الطلب ${orderId}`
                            ]
                        );
                    }
                }
            }

            await connection.query(
                `
                UPDATE orders
                SET
                    status = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                `,
                [
                    newStatus,
                    orderId
                ]
            );

            await connection.commit();

            res.json({
                success: true,
                message: "تم تحديث حالة الطلب وتحديث المخزون بنجاح",
                old_status: oldStatus,
                new_status: newStatus
            });

        } catch (error) {

            if (connection) {
                await connection.rollback();
            }

            console.error(
                "Update Order Status Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    error.message ||
                    "فشل تحديث حالة الطلب"
            });

        } finally {

            if (connection) {
                connection.release();
            }
        }
    }
);
app.get(
    "/api/admin/sales",
    requireAdmin,
    async (req, res) => {
        try {
            const [rows] = await db.query(`
                SELECT
                    o.id,
                    o.order_number,
                    c.name AS customer_name,
                    o.total,
                    o.created_at
                FROM orders o
                LEFT JOIN customers c
                    ON c.id = o.customer_id
                WHERE o.status = 'COMPLETED'
                ORDER BY o.id DESC
                LIMIT 100
            `);

            const [summaryRows] = await db.query(`
                SELECT
                    COUNT(*) AS sales_count,
                    COALESCE(SUM(total), 0) AS sales_total
                FROM orders
                WHERE status = 'COMPLETED'
            `);

            res.json({
                success: true,
                sales: rows,
                summary: summaryRows[0]
            });

        } catch (error) {
            console.error(
                "Admin Sales Error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "فشل تحميل المبيعات"
            });
        }
    }
);
/* =====================================================
   ADMIN PRODUCTS - CREATE
===================================================== */

app.post(
    "/api/admin/products",
    async (req, res) => {

        const connection =
            await db.getConnection();


        try {

            const body =
                req.body || {};


            const name =
                cleanString(
                    body.name
                );


            const model =
                cleanString(
                    body.model
                );


            const brand =
                cleanString(
                    body.brand
                );


            const category =
                cleanString(
                    body.category
                );


            const subcategory =
                cleanString(
                    body.subcategory
                );


            /* ---------------------------------------
               Validation
            --------------------------------------- */

            if (!name) {

                return res.status(400)
                    .json({

                        success:
                            false,

                        message:
                            "اسم المنتج مطلوب"

                    });

            }


            if (!model) {

                return res.status(400)
                    .json({

                        success:
                            false,

                        message:
                            "الموديل مطلوب"

                    });

            }


            if (!category) {

                return res.status(400)
                    .json({

                        success:
                            false,

                        message:
                            "القسم مطلوب"

                    });

            }


            /* ---------------------------------------
               Numbers
            --------------------------------------- */

            const costPrice =
                Math.max(
                    0,
                    toNumber(
                        body.cost_price
                    )
                );


            const price =
                Math.max(
                    0,
                    toNumber(
                        body.price
                    )
                );


            const quantity =
                Math.max(
                    0,
                    Math.trunc(
                        toNumber(
                            body.quantity
                        )
                    )
                );


            const minQuantity =
                Math.max(
                    0,
                    Math.trunc(
                        toNumber(
                            body.min_quantity,
                            1
                        )
                    )
                );


            /* ---------------------------------------
               Discount
            --------------------------------------- */

            const discountType =
                normalizeDiscountType(
                    body.discount_type
                );


            let discountValue =
                Math.max(
                    0,
                    toNumber(
                        body.discount_value
                    )
                );


            if (
                discountType ===
                    "PERCENTAGE" &&
                discountValue > 100
            ) {

                discountValue = 100;

            }


            if (
                discountType ===
                "NONE"
            ) {

                discountValue = 0;

            }


            const discountStart =
                body.discount_start ||
                null;


            const discountEnd =
                body.discount_end ||
                null;


            /* ---------------------------------------
               Other fields
            --------------------------------------- */

            const image =
                cleanString(
                    body.image
                ) ||
                null;


            const description =
                cleanString(
                    body.description
                ) ||
                null;


            const specifications =
                parseSpecifications(
                    body.specifications
                );


            const status =
                String(
                    body.status ||
                    "ACTIVE"
                )
                .toUpperCase() ===
                "INACTIVE"

                    ? "INACTIVE"

                    : "ACTIVE";


            /* ---------------------------------------
               Validate discount dates
            --------------------------------------- */

            if (
                discountStart &&
                discountEnd
            ) {

                if (
                    new Date(
                        discountEnd
                    ) <
                    new Date(
                        discountStart
                    )
                ) {

                    return res.status(400)
                        .json({

                            success:
                                false,

                            message:
                                "نهاية التخفيض يجب أن تكون بعد البداية"

                        });

                }

            }


            /* ---------------------------------------
               Transaction
            --------------------------------------- */

            await connection.beginTransaction();


            /* ---------------------------------------
               Category
            --------------------------------------- */

            const categoryId =
                await getOrCreateCategory(
                    connection,
                    category
                );


            /* ---------------------------------------
               Subcategory
            --------------------------------------- */

            const subcategoryId =
                await getOrCreateSubcategory(
                    connection,
                    subcategory,
                    categoryId
                );


            /* ---------------------------------------
               Insert Product
            --------------------------------------- */

            const [
                result
            ] =
                await connection.query(
                    `
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
                        discount_start,
                        discount_end,
                        quantity,
                        min_quantity,
                        image,
                        description,
                        specifications,
                        status
                    )

                    VALUES
                    (
                        ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?
                    )
                    `,
                    [

                        name,

                        model,

                        brand,

                        categoryId,

                        subcategoryId,

                        costPrice,

                        price,

                        discountType,

                        discountValue,

                        discountStart,

                        discountEnd,

                        quantity,

                        minQuantity,

                        image,

                        description,

                        JSON.stringify(
                            specifications
                        ),

                        status

                    ]
                );


            await connection.commit();


            res.status(201)
                .json({

                    success:
                        true,

                    message:
                        "تمت إضافة المنتج بنجاح",

                    id:
                        result.insertId

                });


        } catch (error) {

            await connection.rollback();


            console.error(
                "CREATE PRODUCT ERROR:",
                error
            );


            res.status(500)
                .json({

                    success:
                        false,

                    message:
                        error.message ||
                        "فشل إضافة المنتج"

                });


        } finally {

            connection.release();

        }

    }
);


/* =====================================================
   ADMIN PRODUCTS - UPDATE
===================================================== */

app.put(
    "/api/admin/products/:id",
    async (req, res) => {

        const connection =
            await db.getConnection();


        try {

            const id =
                Number(
                    req.params.id
                );


            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400)
                    .json({

                        success:
                            false,

                        message:
                            "معرف المنتج غير صحيح"

                    });

            }


            const body =
                req.body || {};


            const name =
                cleanString(
                    body.name
                );


            const model =
                cleanString(
                    body.model
                );


            const brand =
                cleanString(
                    body.brand
                );


            const category =
                cleanString(
                    body.category
                );


            const subcategory =
                cleanString(
                    body.subcategory
                );


            if (!name) {

                return res.status(400)
                    .json({

                        success:
                            false,

                        message:
                            "اسم المنتج مطلوب"

                    });

            }


            if (!model) {

                return res.status(400)
                    .json({

                        success:
                            false,

                        message:
                            "الموديل مطلوب"

                    });

            }


            if (!category) {

                return res.status(400)
                    .json({

                        success:
                            false,

                        message:
                            "القسم مطلوب"

                    });

            }


            const costPrice =
                Math.max(
                    0,
                    toNumber(
                        body.cost_price
                    )
                );


            const price =
                Math.max(
                    0,
                    toNumber(
                        body.price
                    )
                );


            const quantity =
                Math.max(
                    0,
                    Math.trunc(
                        toNumber(
                            body.quantity
                        )
                    )
                );


            const minQuantity =
                Math.max(
                    0,
                    Math.trunc(
                        toNumber(
                            body.min_quantity,
                            1
                        )
                    )
                );


            const discountType =
                normalizeDiscountType(
                    body.discount_type
                );


            let discountValue =
                Math.max(
                    0,
                    toNumber(
                        body.discount_value
                    )
                );


            if (
                discountType ===
                    "PERCENTAGE" &&
                discountValue > 100
            ) {

                discountValue = 100;

            }


            if (
                discountType ===
                "NONE"
            ) {

                discountValue = 0;

            }


            const discountStart =
                body.discount_start ||
                null;


            const discountEnd =
                body.discount_end ||
                null;


            const image =
                cleanString(
                    body.image
                ) ||
                null;


            const description =
                cleanString(
                    body.description
                ) ||
                null;


            const specifications =
                parseSpecifications(
                    body.specifications
                );


            const status =
                String(
                    body.status ||
                    "ACTIVE"
                )
                .toUpperCase() ===
                "INACTIVE"

                    ? "INACTIVE"

                    : "ACTIVE";


            /* ---------------------------------------
               Date validation
            --------------------------------------- */

            if (
                discountStart &&
                discountEnd
            ) {

                if (
                    new Date(
                        discountEnd
                    ) <
                    new Date(
                        discountStart
                    )
                ) {

                    return res.status(400)
                        .json({

                            success:
                                false,

                            message:
                                "نهاية التخفيض يجب أن تكون بعد البداية"

                        });

                }

            }


            await connection.beginTransaction();


            /* ---------------------------------------
               Verify product
            --------------------------------------- */

            const [
                existing
            ] =
                await connection.query(
                    `
                    SELECT id
                    FROM products
                    WHERE id = ?
                    LIMIT 1
                    `,
                    [id]
                );


            if (
                existing.length ===
                0
            )
             {

                await connection.rollback();

                return res.status(404)
                    .json({

                        success:
                            false,

                        message:
                            "المنتج غير موجود"

                    });

            }


            /* ---------------------------------------
               Category
            --------------------------------------- */

            const categoryId =
                await getOrCreateCategory(
                    connection,
                    category
                );


            /* ---------------------------------------
               Subcategory
            --------------------------------------- */

            const subcategoryId =
                await getOrCreateSubcategory(
                    connection,
                    subcategory,
                    categoryId
                );


            /* ---------------------------------------
               Update
            --------------------------------------- */

            await connection.query(
                `
                UPDATE products

                SET

                    name = ?,

                    model = ?,

                    brand = ?,

                    category_id = ?,

                    subcategory_id = ?,

                    cost_price = ?,

                    price = ?,

                    discount_type = ?,

                    discount_value = ?,

                    discount_start = ?,

                    discount_end = ?,

                    quantity = ?,

                    min_quantity = ?,

                    image = ?,

                    description = ?,

                    specifications = ?,

                    status = ?

                WHERE id = ?
                `,
                [

                    name,

                    model,

                    brand,

                    categoryId,

                    subcategoryId,

                    costPrice,

                    price,

                    discountType,

                    discountValue,

                    discountStart,

                    discountEnd,

                    quantity,

                    minQuantity,

                    image,

                    description,

                    JSON.stringify(
                        specifications
                    ),

                    status,

                    id

                ]
            );


            await connection.commit();


            res.json({

                success:
                    true,

                message:
                    "تم تحديث المنتج بنجاح"

            });


        } catch (error) {

            await connection.rollback();


            console.error(
                "UPDATE PRODUCT ERROR:",
                error
            );


            res.status(500)
                .json({

                    success:
                        false,

                    message:
                        error.message ||
                        "فشل تحديث المنتج"

                });


        } finally {

            connection.release();

        }

    }
);


/* =====================================================
   ADMIN PRODUCTS - DELETE
===================================================== */

app.delete(
    "/api/admin/products/:id",
    async (req, res) => {

        try {

            const id =
                Number(
                    req.params.id
                );


            if (
                !Number.isInteger(id) ||
                id <= 0
            ) {

                return res.status(400)
                    .json({

                        success:
                            false,

                        message:
                            "معرف المنتج غير صحيح"

                    });

            }


            const [
                result
            ] =
                await db.query(
                    `
                    DELETE FROM products
                    WHERE id = ?
                    `,
                    [id]
                );


            if (
                result.affectedRows ===
                0
            ) {

                return res.status(404)
                    .json({

                        success:
                            false,

                        message:
                            "المنتج غير موجود"

                    });

            }


            res.json({

                success:
                    true,

                message:
                    "تم حذف المنتج بنجاح"

            });


        } catch (error) {

            console.error(
                "DELETE PRODUCT ERROR:",
                error
            );


            res.status(500)
                .json({

                    success:
                        false,

                    message:
                        error.message ||
                        "فشل حذف المنتج"

                });

        }

    }
);


/* =====================================================
   TEST API
===================================================== */

app.get(
    "/api/test",
    (req, res) => {

        res.json({

            success:
                true,

            store:
                "BL-Mansoor",

            message:
                "API connection is working"

        });

    }
);


/* =====================================================
   404
===================================================== */
/* =====================================================
   STORE SETTINGS
===================================================== */
/* =====================================================
   STORE SETTINGS
===================================================== */

app.get(
    "/api/admin/settings",
    async (req, res) => {

        try {

            const [rows] =
                await db.query(`
                    SELECT
                        whatsapp_phone,
                        store_email,
                        store_address
                    FROM store_settings
                    WHERE id = 1
                    LIMIT 1
                `);

            res.json({
                success: true,

                settings:
                    rows[0] || {
                        whatsapp_phone: "",
                        store_email: "",
                        store_address: ""
                    }
            });

        } catch (error) {

            console.error(
                "Settings Load Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "فشل تحميل إعدادات المتجر"
            });

        }

    }
);


app.put(
    "/api/admin/settings",
    async (req, res) => {

        try {

            const whatsappPhone =
                String(
                    req.body.whatsapp_phone || ""
                ).trim();


            const storeEmail =
                String(
                    req.body.store_email || ""
                ).trim();


            const storeAddress =
                String(
                    req.body.store_address || ""
                ).trim();


            if (!whatsappPhone) {

                return res.status(400).json({
                    success: false,
                    message:
                        "أدخل رقم واتساب المتجر"
                });

            }


            await db.query(
                `
                    INSERT INTO store_settings
                    (
                        id,
                        whatsapp_phone,
                        store_email,
                        store_address
                    )
                    VALUES
                    (
                        1,
                        ?,
                        ?,
                        ?
                    )
                    ON DUPLICATE KEY UPDATE
                        whatsapp_phone =
                            VALUES(whatsapp_phone),

                        store_email =
                            VALUES(store_email),

                        store_address =
                            VALUES(store_address)
                `,
                [
                    whatsappPhone,
                    storeEmail,
                    storeAddress
                ]
            );


            res.json({
                success: true,
                message:
                    "تم حفظ إعدادات المتجر بنجاح"
            });

        } catch (error) {

            console.error(
                "Settings Save Error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "فشل حفظ إعدادات المتجر"
            });

        }

    }
);
app.use(
    (req, res) => {

        res.status(404)
            .json({

                success:
                    false,

                message:
                    "API endpoint not found"

            });

    }
);


/* =====================================================
   ERROR HANDLER
===================================================== */

app.use(
    (
        err,
        req,
        res,
        next
    ) => {

        console.error(
            "GLOBAL ERROR:",
            err
        );


        res.status(500)
            .json({

                success:
                    false,

                message:
                    "Internal server error"

            });

    }
);


/* =====================================================
   START SERVER
===================================================== */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");

        console.log(
            "======================================"
        );

        console.log(
            "         BL-MANSOOR BACKEND"
        );

        console.log(
            "======================================"
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            "======================================"
        );

        console.log("");

    }
);