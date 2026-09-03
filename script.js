/* =====================================================
   BL-MANSOOR STORE - FINAL FRONTEND SCRIPT
   Backend API: /api/products
===================================================== */


/* =====================================================
   FALLBACK PRODUCTS
   Used only if the backend is unavailable.
===================================================== */
window.storeSettings = {
    whatsapp_phone: "",
    store_email: "",
    store_address: ""
};
let products = [

    {
        id: 1,
        model: "EAP653",
        name: "Omada EAP653",
        brand: "TP-Link Omada",
        category: "omada",
        subcategory: "Access Points",
        icon: "📡",
        price: 0,
        stock: true,
        description: "AX3000 Ceiling Mount Wi-Fi 6 Access Point",
        specs: {
            "Wi-Fi": "Wi-Fi 6",
            "Speed": "AX3000",
            "5 GHz": "2402 Mbps",
            "2.4 GHz": "574 Mbps",
            "Port": "Gigabit",
            "Power": "802.3at PoE+ / DC"
        }
    },

    {
        id: 2,
        model: "EAP673",
        name: "Omada EAP673",
        brand: "TP-Link Omada",
        category: "omada",
        subcategory: "Access Points",
        icon: "📡",
        price: 0,
        stock: true,
        description: "AX5400 Ceiling Mount Wi-Fi 6 Access Point",
        specs: {
            "Wi-Fi": "Wi-Fi 6",
            "Speed": "AX5400",
            "5 GHz": "4804 Mbps",
            "2.4 GHz": "574 Mbps",
            "Port": "2.5 Gigabit",
            "Power": "802.3at PoE+ / DC"
        }
    },

    {
        id: 3,
        model: "OC200",
        name: "Omada Hardware Controller",
        brand: "TP-Link Omada",
        category: "omada",
        subcategory: "Controllers",
        icon: "🖥️",
        price: 0,
        stock: true,
        description: "Hardware Controller for Omada network management",
        specs: {
            "Category": "Controller",
            "Management": "Omada SDN",
            "Type": "Hardware Controller"
        }
    },

    {
        id: 4,
        model: "Omada Gateway",
        name: "Omada Gateway",
        brand: "TP-Link Omada",
        category: "omada",
        subcategory: "Gateways",
        icon: "🌐",
        price: 0,
        stock: true,
        description: "Gateway for Omada network management",
        specs: {
            "Category": "Gateway",
            "Platform": "Omada SDN"
        }
    },

    {
        id: 5,
        model: "Omada Switch",
        name: "Omada Switch",
        brand: "TP-Link Omada",
        category: "omada",
        subcategory: "Switches",
        icon: "🔌",
        price: 0,
        stock: true,
        description: "Managed network switch for Omada",
        specs: {
            "Category": "Managed Switch",
            "Platform": "Omada SDN"
        }
    },

    {
        id: 6,
        model: "TL-SG105",
        name: "TP-Link TL-SG105",
        brand: "TP-Link",
        category: "switches",
        subcategory: "Unmanaged Switches",
        icon: "🔌",
        price: 0,
        stock: true,
        description: "5-Port Gigabit Desktop Switch",
        specs: {
            "Ports": "5 × Gigabit",
            "Type": "Unmanaged",
            "Installation": "Desktop"
        }
    },

    {
        id: 7,
        model: "TL-SG108",
        name: "TP-Link TL-SG108",
        brand: "TP-Link",
        category: "switches",
        subcategory: "Unmanaged Switches",
        icon: "🔌",
        price: 0,
        stock: true,
        description: "8-Port Gigabit Desktop Switch",
        specs: {
            "Ports": "8 × Gigabit",
            "Type": "Unmanaged",
            "Installation": "Desktop"
        }
    },

    {
        id: 8,
        model: "TP-Link PoE Switch",
        name: "TP-Link PoE Switch",
        brand: "TP-Link",
        category: "switches",
        subcategory: "PoE Switches",
        icon: "🔌",
        price: 0,
        stock: true,
        description: "PoE network switch",
        specs: {
            "Category": "PoE Switch",
            "Use": "IP Cameras / Access Points"
        }
    },

    {
        id: 9,
        model: "Archer BE230",
        name: "TP-Link Archer BE230",
        brand: "TP-Link",
        category: "tplink",
        subcategory: "Routers",
        image: "images/archer-be230.png",
        price: 0,
        stock: true,
        description: "BE3600 Dual-Band Wi-Fi 7 Router",
        specs: {
            "Wi-Fi": "Wi-Fi 7",
            "Class": "BE3600",
            "Bands": "Dual-Band",
            "Antennas": "4 × External",
            "Ports": "2.5G Multi-Gig"
        }
    },

    {
        id: 10,
        model: "Archer AX23",
        name: "TP-Link Archer AX23",
        brand: "TP-Link",
        category: "tplink",
        subcategory: "Routers",
        icon: "📡",
        price: 0,
        stock: true,
        description: "Wi-Fi 6 Router",
        specs: {
            "Wi-Fi": "Wi-Fi 6",
            "Category": "Router"
        }
    },

    {
        id: 11,
        model: "RE315",
        name: "TP-Link RE315",
        brand: "TP-Link",
        category: "tplink",
        subcategory: "Range Extenders",
        icon: "📶",
        price: 0,
        stock: true,
        description: "AC1200 Mesh Wi-Fi Range Extender",
        specs: {
            "Wi-Fi": "Dual-Band",
            "Class": "AC1200",
            "2.4 GHz": "300 Mbps",
            "5 GHz": "867 Mbps",
            "Mode": "Range Extender / Access Point"
        }
    },

    {
        id: 12,
        model: "TP-Link Wi-Fi Adapter",
        name: "TP-Link Wi-Fi Adapter",
        brand: "TP-Link",
        category: "tplink",
        subcategory: "Adapters",
        icon: "💻",
        price: 0,
        stock: true,
        description: "USB Wi-Fi Adapter",
        specs: {
            "Category": "Wi-Fi Adapter",
            "Interface": "USB"
        }
    },

    {
        id: 13,
        model: "VIGI C340",
        name: "VIGI C340",
        brand: "TP-Link VIGI",
        category: "vigi",
        subcategory: "Bullet Cameras",
        icon: "📹",
        image: "images/vigi-c340.png",
        price: 0,
        stock: true,
        description: "4MP Outdoor Full-Color Bullet Network Camera",
        specs: {
            "Resolution": "4MP",
            "Type": "Bullet",
            "Use": "Outdoor",
            "Brand": "VIGI"
        }
    },

    {
        id: 14,
        model: "VIGI Dome Camera",
        name: "VIGI Dome Camera",
        brand: "TP-Link VIGI",
        category: "vigi",
        subcategory: "Dome Cameras",
        icon: "📷",
        price: 0,
        stock: true,
        description: "VIGI Dome Network Camera",
        specs: {
            "Type": "Dome",
            "Category": "Network Camera"
        }
    },

    {
        id: 15,
        model: "VIGI IP Camera",
        name: "VIGI IP Camera",
        brand: "TP-Link VIGI",
        category: "vigi",
        subcategory: "IP Cameras",
        icon: "📹",
        price: 0,
        stock: true,
        description: "VIGI Network Camera",
        specs: {
            "Type": "IP Camera",
            "Brand": "VIGI"
        }
    },

    {
        id: 16,
        model: "VIGI NVR",
        name: "VIGI NVR",
        brand: "TP-Link VIGI",
        category: "vigi",
        subcategory: "NVR",
        icon: "💾",
        price: 0,
        stock: true,
        description: "Network Video Recorder for VIGI",
        specs: {
            "Category": "NVR",
            "Brand": "VIGI"
        }
    },

    {
        id: 17,
        model: "Tapo C220",
        name: "Tapo C220",
        brand: "TP-Link Tapo",
        category: "tapo",
        subcategory: "Cameras",
        icon: "📷",
        image: "images/tapo-c220.png",
        price: 0,
        stock: true,
        description: "Pan/Tilt Home Security Wi-Fi Camera",
        specs: {
            "Resolution": "2K QHD",
            "Pan": "360° Coverage",
            "Tilt": "111.3° Coverage",
            "Storage": "microSD up to 512GB",
            "Wi-Fi": "2.4 GHz"
        }
    },

    {
        id: 18,
        model: "Tapo Smart Plug",
        name: "Tapo Smart Plug",
        brand: "TP-Link Tapo",
        category: "tapo",
        subcategory: "Smart Plugs",
        icon: "🔌",
        price: 0,
        stock: true,
        description: "Smart Wi-Fi Plug",
        specs: {
            "Category": "Smart Plug",
            "Platform": "Tapo"
        }
    },

    {
        id: 19,
        model: "Tapo Smart Bulb",
        name: "Tapo Smart Bulb",
        brand: "TP-Link Tapo",
        category: "tapo",
        subcategory: "Smart Bulbs",
        icon: "💡",
        price: 0,
        stock: true,
        description: "Smart Wi-Fi Bulb",
        specs: {
            "Category": "Smart Bulb",
            "Platform": "Tapo"
        }
    },

    {
        id: 20,
        model: "Tapo Smart Sensor",
        name: "Tapo Smart Sensor",
        brand: "TP-Link Tapo",
        category: "tapo",
        subcategory: "Sensors",
        icon: "📡",
        price: 0,
        stock: true,
        description: "Smart Home Sensor",
        specs: {
            "Category": "Sensor",
            "Platform": "Tapo"
        }
    }

];

let cart = [];


/* =====================================================
   HELPERS
===================================================== */

function normalizeCategory(value) {

    const category =
        String(value || "")
            .trim()
            .toLowerCase();

    if (
        category === "tp-link" ||
        category === "tplink"
    ) {
        return "tplink";
    }
    if (category === "mercusys") {
    return "mercusys";
}

    if (
        category === "tp-link switches" ||
        category === "tplink switches" ||
        category === "switches"
    ) {
        return "switches";
    }

    return category;
}


function getProductIcon(category) {

    const c =
        normalizeCategory(category);

    if (c === "omada") return "🌐";
    if (c === "mercusys") return "📶";

    if (c === "vigi") return "📹";

    if (c === "tapo") return "🏠";

    if (
        c === "switches" ||
        c === "tp-link switches"
    ) {
        return "🔌";
    }

    if (
        c === "tplink" ||
        c === "tp-link"
    ) {
        return "📡";
    }

    return "📦";

}


function calculateDiscount(product) {

    const price =
        Number(product.price || 0);

    const value =
        Number(product.discount_value || 0);

    const type =
        String(
            product.discount_type || "NONE"
        ).toUpperCase();

    let finalPrice = price;
    let percent = 0;
    let hasDiscount = false;


    if (
        price > 0 &&
        value > 0 &&
        type !== "NONE"
    ) {

        if (type === "PERCENTAGE") {

            percent =
                Math.min(
                    100,
                    Math.max(0, value)
                );

            finalPrice =
                Math.max(
                    0,
                    price -
                    (price * percent / 100)
                );

            hasDiscount =
                finalPrice < price;

        }


        else if (type === "FIXED") {

            finalPrice =
                Math.max(
                    0,
                    price - value
                );

            percent =
                ((price - finalPrice) / price) * 100;

            hasDiscount =
                finalPrice < price;

        }

    }


    return {

        finalPrice,
        discountPercent: percent,
        hasDiscount

    };

}


/* =====================================================
   LOAD PRODUCTS FROM BACKEND / MYSQL
===================================================== */

async function loadProductsFromAPI() {

    try {

        const response =
            await fetch(
                "/api/products",
                {
                    headers: {
                        "Accept": "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !data.success ||
            !Array.isArray(data.products)
        ) {

            throw new Error(
                "Invalid products response"
            );

        }


        products =
            data.products.map(product => {

                const quantity =
                    Number(
                        product.quantity || 0
                    );


                const price =
                    Number(
                        product.price || 0
                    );


                const category =
                    normalizeCategory(
                        product.category
                    );


                const discount =
                    calculateDiscount(product);


                return {

                    id:
                        Number(product.id),

                    model:
                        product.model || "",

                    name:
                        product.name || "",

                    brand:
                        product.brand || "",

                    category:
                        category,

                    subcategory:
                        product.subcategory || "",

                    image:
                        product.image || "",

                    icon:
                        getProductIcon(category),


                    price:
                        price,

                    finalPrice:
                        discount.finalPrice,

                    hasDiscount:
                        discount.hasDiscount,

                    discountType:
                        String(
                            product.discount_type || "NONE"
                        ).toUpperCase(),

                    discountValue:
                        Number(
                            product.discount_value || 0
                        ),

                    discountPercent:
                        discount.discountPercent,


                    quantity:
                        quantity,

                    stock:
                        quantity > 0 &&
                        String(
                            product.status || ""
                        ).toUpperCase() === "ACTIVE",


                    description:
                        product.description || "",

                    specs:
                        product.specifications || {}

                };

            });


        console.log(
            `Loaded ${products.length} products from MySQL`
        );


        renderProducts(products);

        updateCart();

    }


    catch (error) {

        console.error(
            "Failed to load products from API:",
            error
        );


        console.warn(
            "Using local fallback products."
        );


        renderProducts(products);

        updateCart();

    }

}


/* =====================================================
   PRICE HTML
===================================================== */

function getPriceHTML(product) {

    const price =
        Number(
            product.price || 0
        );


    const finalPrice =
        Number(
            product.finalPrice ?? price
        );


    if (price <= 0) {

        return `
            <div class="normal-price">
                السعر عند الطلب
            </div>
        `;

    }


    if (product.hasDiscount) {

        return `
            <div class="old-price">
                ${price.toLocaleString()} د.ع
            </div>

            <div class="discount-price">
                ${finalPrice.toLocaleString()} د.ع
            </div>

            <div class="discount-badge">
                خصم ${Math.round(product.discountPercent)}%
            </div>
        `;

    }


    return `
        <div class="normal-price">
            ${price.toLocaleString()} د.ع
        </div>
    `;

}


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(
    customProducts = null
) {

    const grid =
        document.getElementById(
            "productsGrid"
        );


    if (!grid) return;


    const list =
        Array.isArray(customProducts)
            ? customProducts
            : products;


    if (list.length === 0) {

        grid.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px;
                color:#777;
            ">

                <h3>
                    لا توجد منتجات
                </h3>

                <p>
                    جرب تغيير البحث أو القسم.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML = "";


    list.forEach(product => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "product-card";


        const stockText =
            product.stock
                ? "متوفر"
                : "غير متوفر";


        const disabled =
            product.stock
                ? ""
                : "disabled";


        card.innerHTML = `

            <div class="product-image">

                ${
                    product.image

                    ?

                    `<img
                        src="${product.image}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                    >`

                    :

                    `<span>
                        ${product.icon || "📦"}
                    </span>`
                }

            </div>


            <div class="product-info">

                <div class="product-brand">
                    ${escapeHTML(product.brand)}
                </div>


                <div class="product-name">
                    ${escapeHTML(product.name)}
                </div>


                <div class="product-category">
                    ${escapeHTML(product.subcategory)}
                </div>


                <p>
                    ${escapeHTML(product.description)}
                </p>


                <div class="product-bottom">

                    <div>

                        <div class="price">
                            ${getPriceHTML(product)}
                        </div>


                        <small class="stock">
                            ${stockText}
                        </small>

                    </div>


                    <div class="product-actions">

                        <button
                            type="button"
                            onclick="showProduct(${product.id})"
                            title="تفاصيل المنتج">

                            👁️

                        </button>


                        <button
                            type="button"
                            onclick="addToCart(${product.id})"
                            title="إضافة للسلة"
                            ${disabled}>

                            🛒

                        </button>

                    </div>

                </div>

            </div>

        `;


        grid.appendChild(card);

    });

}


/* =====================================================
   FILTER CATEGORY
===================================================== */

function filterCategory(category) {

    const filter =
        document.getElementById(
            "categoryFilter"
        );


    if (filter) {

        filter.value =
            category;

    }


    const selected =
        normalizeCategory(category);
        console.log("Selected category:", selected);
console.log(
    "Product categories:",
    products.map(product => ({
        name: product.name,
        category: product.category
    }))
);


    const filtered =
        selected === "all"

            ? products

            : products.filter(
                product =>
                    normalizeCategory(
                        product.category
                    ) === selected
            );


    renderProducts(
        filtered
    );


    document
        .getElementById("products")
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   FILTER SUBCATEGORY
===================================================== */

function filterSubcategory(
    subcategory
) {

    const selected =
        String(
            subcategory || ""
        )
        .trim()
        .toLowerCase();


    const filtered =
        products.filter(
            product =>
                String(
                    product.subcategory || ""
                )
                .trim()
                .toLowerCase() === selected
        );


    renderProducts(
        filtered
    );


    document
        .getElementById("products")
        ?.scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   SEARCH
===================================================== */

function searchProducts() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) return;


    const query =
        input.value
            .trim()
            .toLowerCase();


    const categorySelect =
        document.getElementById(
            "categoryFilter"
        );


    const category =
        categorySelect
            ? normalizeCategory(
                categorySelect.value
            )
            : "all";


    let filtered =
        products;


    if (category !== "all") {

        filtered =
            filtered.filter(
                product =>
                    normalizeCategory(
                        product.category
                    ) === category
            );

    }


    if (query) {

        filtered =
            filtered.filter(
                product => {

                    const fields = [

                        product.name,

                        product.model,

                        product.brand,

                        product.subcategory,

                        product.description

                    ];


                    return fields.some(
                        field =>
                            String(
                                field || ""
                            )
                            .toLowerCase()
                            .includes(query)
                    );

                }
            );

    }


    renderProducts(
        filtered
    );

}


/* =====================================================
   FOCUS SEARCH
===================================================== */

function focusSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) return;


    input.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    setTimeout(
        () => input.focus(),
        400
    );

}


/* =====================================================
   PRODUCT DETAILS
===================================================== */

function showProduct(id) {

    const product =
        products.find(
            item =>
                item.id === Number(id)
        );


    if (!product) return;


    const modal =
        document.getElementById(
            "productModal"
        );


    const content =
        document.getElementById(
            "modalContent"
        );


    if (
        !modal ||
        !content
    ) {
        return;
    }


    let specsHTML =
        "";


    if (
        product.specs &&
        typeof product.specs === "object"
    ) {

        Object
            .entries(
                product.specs
            )
            .forEach(
                ([key, value]) => {

                    specsHTML += `

                        <div class="spec-row">

                            <span>
                                ${escapeHTML(key)}
                            </span>

                            <strong>
                                ${escapeHTML(
                                    String(value)
                                )}
                            </strong>

                        </div>

                    `;

                }
            );

    }


    content.innerHTML = `

        <div class="product-detail">


            <div class="product-detail-image">

                ${
                    product.image

                    ?

                    `<img
                        src="${product.image}"
                        alt="${escapeHTML(product.name)}"
                    >`

                    :

                    `<div
                        class="detail-product-icon">

                        ${product.icon || "📦"}

                    </div>`
                }

            </div>


            <div class="product-detail-info">


                <div class="product-brand">
                    ${escapeHTML(product.brand)}
                </div>


                <h2>
                    ${escapeHTML(product.name)}
                </h2>


                <div
                    class="product-detail-category">

                    ${escapeHTML(
                        product.category
                    )}

                    /

                    ${escapeHTML(
                        product.subcategory
                    )}

                </div>


                <p
                    class="product-detail-description">

                    ${escapeHTML(
                        product.description
                    )}

                </p>


                <div
                    class="product-detail-row">

                    <span>
                        الموديل
                    </span>

                    <strong>
                        ${escapeHTML(
                            product.model
                        )}
                    </strong>

                </div>


                <div
                    class="product-detail-row">

                    <span>
                        السعر
                    </span>

                    <strong
                        class="detail-price">

                        ${getPriceHTML(
                            product
                        )}

                    </strong>

                </div>


                <div
                    class="product-detail-row">

                    <span>
                        الكمية
                    </span>

                    <strong>

                        ${Number(
                            product.quantity || 0
                        )}

                    </strong>

                </div>


                <div
                    class="product-detail-row">

                    <span>
                        الحالة
                    </span>

                    <strong
                        class="stock">

                        ${
                            product.stock
                                ? "متوفر"
                                : "غير متوفر"
                        }

                    </strong>

                </div>


                <div
                    class="specifications">

                    <h3>
                        المواصفات
                    </h3>

                    ${
                        specsHTML ||
                        "<p>لا توجد مواصفات مضافة.</p>"
                    }

                </div>


                <button
                    class="detail-add-button"
                    onclick="
                        addToCart(${product.id});
                        closeModal();
                    "
                    ${
                        product.stock
                            ? ""
                            : "disabled"
                    }>

                    🛒 إضافة إلى السلة

                </button>


            </div>

        </div>

    `;


    modal.classList.add(
        "show"
    );

}


/* =====================================================
   CLOSE PRODUCT MODAL
===================================================== */

function closeModal() {

    document
        .getElementById(
            "productModal"
        )
        ?.classList.remove(
            "show"
        );

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(id) {

    const product =
        products.find(
            item =>
                item.id === Number(id)
        );


    if (!product) return;


    if (!product.stock) {

        alert(
            "هذا المنتج غير متوفر حالياً."
        );

        return;

    }


    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        if (
            existing.quantity >=
            Number(product.quantity || 0)
        ) {

            alert(
                "لا يمكن إضافة كمية أكبر من المخزون المتوفر."
            );

            return;

        }


        existing.quantity += 1;

    }


    else {

        cart.push({

            id:
                product.id,

            quantity:
                1

        });

    }


    updateCart();

}


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    const count =
        cart.reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,
            0
        );


    const cartCount =
        document.getElementById(
            "cartCount"
        );


    if (cartCount) {

        cartCount.textContent =
            count;

    }


    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `

            <div style="
                text-align:center;
                padding:40px;
                color:#777;
            ">

                🛒

                <p>
                    السلة فارغة
                </p>

            </div>

        `;


        updateCartTotal(
            0
        );


        return;

    }


    container.innerHTML =
        "";


    let total =
        0;


    cart.forEach(
        (
            item,
            index
        ) => {

            const product =
                products.find(
                    p =>
                        p.id === item.id
                );


            if (!product) return;


            const unitPrice =
                product.hasDiscount

                    ? Number(
                        product.finalPrice || 0
                    )

                    : Number(
                        product.price || 0
                    );


            total +=
                unitPrice *
                item.quantity;


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "cart-item";


            div.innerHTML = `

                <div>

                    <div
                        class="cart-item-name">

                        ${product.icon || "📦"}

                        ${escapeHTML(
                            product.name
                        )}

                    </div>


                    <small>

                        الكمية:
                        ${item.quantity}

                    </small>

                </div>


                <div>

                    ${
                        unitPrice > 0

                            ?

                            `${(
                                unitPrice *
                                item.quantity
                            ).toLocaleString()}
                            د.ع`

                            :

                            "عند الطلب"
                    }

                </div>


                <button
                    onclick="
                        removeCartItem(${index})
                    ">

                    حذف

                </button>

            `;


            container.appendChild(
                div
            );

        }
    );


    updateCartTotal(
        total
    );

}


/* =====================================================
   CART TOTAL
===================================================== */

function updateCartTotal(
    total
) {

    const element =
        document.getElementById(
            "cartTotal"
        );


    if (!element) return;


    element.textContent =
        Number(
            total
        )
        .toLocaleString();

}


/* =====================================================
   REMOVE CART ITEM
===================================================== */

function removeCartItem(
    index
) {

    cart.splice(
        index,
        1
    );


    updateCart();

}


/* =====================================================
   OPEN CART
===================================================== */

function openCart() {

    updateCart();


    document
        .getElementById(
            "cartModal"
        )
        ?.classList.add(
            "show"
        );

}


/* =====================================================
   CLOSE CART
===================================================== */

function closeCart() {

    document
        .getElementById(
            "cartModal"
        )
        ?.classList.remove(
            "show"
        );

}


/* =====================================================
   TOGGLE CART
===================================================== */

function toggleCart() {

    const modal =
        document.getElementById(
            "cartModal"
        );


    if (!modal) return;


    if (
        modal.classList.contains(
            "show"
        )
    ) {

        closeCart();

    }

    else {

        openCart();

    }

}


/* =====================================================
   OUTSIDE CART
===================================================== */

function closeCartOutside(
    event
) {

    if (
        event.target &&
        event.target.id ===
            "cartOverlay"
    ) {

        closeCart();

    }

}


/* =====================================================
   CHECKOUT
===================================================== */
async function checkout() {

    if (cart.length === 0) {

        alert("السلة فارغة.");
        return;

    }


    const customerName =
        document
            .getElementById("customerName")
            .value
            .trim();


    const customerPhone =
        document
            .getElementById("customerPhone")
            .value
            .trim();


    const customerAddress =
        document
            .getElementById("customerAddress")
            .value
            .trim();


    if (!customerName) {

        alert("يرجى إدخال الاسم الكامل.");
        return;

    }


    if (!customerPhone) {

        alert("يرجى إدخال رقم الهاتف.");
        return;

    }


    if (!customerAddress) {

        alert("يرجى إدخال عنوان التوصيل.");
        return;

    }


    const orderItems = [];


    cart.forEach(item => {

        const product =
            products.find(
                p => p.id === item.id
            );


        if (!product) return;


        orderItems.push({

            id: product.id,

            name: product.name,

            quantity: item.quantity,

            price:
                Number(product.price) || 0

        });

    });


    if (orderItems.length === 0) {

        alert("تعذر تجهيز المنتجات.");
        return;

    }


    const totalAmount =
        orderItems.reduce(
            (total, item) =>
                total +
                (item.price * item.quantity),
            0
        );


    try {

        const response =
            await fetch(
                "/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customer_name:
                            customerName,

                        customer_phone:
                            customerPhone,

                        customer_address:
                            customerAddress,

                        items:
                            orderItems,

                        total_amount:
                            totalAmount

                    })
                }
            );


        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            alert(
                result.message ||
                "فشل إنشاء الطلب."
            );

            return;

        }


        let message =
            "السلام عليكم، أريد تأكيد الطلب:%0A%0A";


        message +=
            `رقم الطلب: ${result.order_number}%0A`;

        message +=
            `الاسم: ${customerName}%0A`;

        message +=
            `الهاتف: ${customerPhone}%0A`;

        message +=
            `العنوان: ${customerAddress}%0A%0A`;

        message +=
            "المنتجات:%0A";


        orderItems.forEach(item => {

            message +=
                `• ${item.name} - الكمية: ${item.quantity}%0A`;

        });


        message +=
            `%0Aالمجموع: ${totalAmount.toLocaleString("en-US")} د.ع`;


        const phone =
            window.storeSettings?.whatsapp_phone
                ? String(
                    window.storeSettings.whatsapp_phone
                )
                    .replace(/\D/g, "")
                    .replace(/^0/, "964")
                : "";


        if (!phone) {

            alert(
                "تم إنشاء الطلب، لكن رقم واتساب المتجر غير متوفر."
            );

            return;

        }


        window.open(
            `https://wa.me/${phone}?text=${message}`,
            "_blank"
        );


        alert(
            `تم إنشاء الطلب بنجاح ✅\nرقم الطلب: ${result.order_number}`
        );


        cart = [];

        updateCart();


    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );


        alert(
            "تعذر الاتصال بالخادم."
        );

    }

}

/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   INITIAL LOAD
===================================================== */
async function loadStoreSettings() {

    try {

        const response =
            await fetch(
                "/api/admin/settings"
            );

        const result =
            await response.json();
           window.storeSettings = result.settings;

        if (
            !response.ok ||
            !result.success ||
            !result.settings
        ) {
            return;
        }

        const address =
            document.getElementById(
                "storeAddress"
            );

        const whatsapp =
            document.getElementById(
                "storeWhatsapp"
            );

        const email =
            document.getElementById(
                "storeEmail"
            );


        if (address) {

            address.textContent =
                "📍 " +
                (
                    result.settings.store_address ||
                    "بغداد - العراق"
                );

        }


        if (whatsapp) {

            whatsapp.textContent =
                "📞 " +
                (
                    result.settings.whatsapp_phone ||
                    "0770 XXX XXXX"
                );

        }


        if (email) {

            email.textContent =
                "📧 " +
                (
                    result.settings.store_email ||
                    "info@bl-mansoor.com"
                );

        }

    } catch (error) {

        console.error(
            "Store Settings Error:",
            error
        );

    }

}
document.addEventListener(
    "DOMContentLoaded",
    async function () {

        loadProductsFromAPI();

        updateCart();

        await loadStoreSettings();

    }
);