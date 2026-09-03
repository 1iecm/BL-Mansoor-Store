/* =====================================================
   BL-MANSOOR ADMIN DASHBOARD
   REAL MYSQL ADMIN SYSTEM
===================================================== */


/* =====================================================
   STATE
===================================================== */

let products = [];

let filteredProducts = [];

let editingProductId = null;


/* =====================================================
   DOM
===================================================== */

const productsTable =
    document.getElementById(
        "productsTable"
    );

const totalProducts =
    document.getElementById(
        "totalProducts"
    );

const totalStock =
    document.getElementById(
        "totalStock"
    );


/* =====================================================
   HELPERS
===================================================== */

function escapeHTML(value) {

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


function numberValue(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;

}


function formatMoney(value) {

    const number =
        numberValue(
            value
        );

    if (number <= 0) {

        return "غير محدد";

    }


    return (
        number.toLocaleString() +
        " د.ع"
    );

}


function formatDiscount(product) {

    const type =
        String(
            product.discount_type ||
            "NONE"
        ).toUpperCase();


    const value =
        numberValue(
            product.discount_value
        );


    if (
        type === "PERCENTAGE" &&
        value > 0
    ) {

        return `
            <span class="discount-badge">
                ${value}% 
            </span>
        `;

    }


    if (
        type === "FIXED" &&
        value > 0
    ) {

        return `
            <span class="discount-badge">
                ${value.toLocaleString()} د.ع
            </span>
        `;

    }


    return "—";

}


function showMessage(
    message,
    type = "success"
) {

    const element =
        document.getElementById(
            "productFormMessage"
        );


    if (!element) {

        alert(message);

        return;

    }


    element.textContent =
        message;


    element.className =
        "form-message " +
        type;


    setTimeout(
        () => {

            element.textContent =
                "";

            element.className =
                "form-message";

        },
        4000
    );

}


/* =====================================================
   API REQUEST
===================================================== */

async function apiRequest(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {
                ...options,

                headers: {

                    "Content-Type":
                        "application/json",

                    ...(options.headers || {})

                }

            }
        );


    let data = {};

    try {

        data =
            await response.json();

    } catch {

        data = {};

    }


    if (!response.ok) {

        throw new Error(
            data.message ||
            `HTTP ${response.status}`
        );

    }


    return data;

}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

async function loadProducts() {

    try {

        const data =
            await apiRequest(
                "/api/admin/products"
            );


        if (
            !data.success ||
            !Array.isArray(
                data.products
            )
        ) {

            throw new Error(
                "Invalid products response"
            );

        }


        products =
            data.products.map(
                product => ({

                    ...product,

                    id:
                        Number(
                            product.id
                        ),

                    cost_price:
                        Number(
                            product.cost_price || 0
                        ),

                    price:
                        Number(
                            product.price || 0
                        ),

                    discount_value:
                        Number(
                            product.discount_value || 0
                        ),

                    quantity:
                        Number(
                            product.quantity || 0
                        ),

                    min_quantity:
                        Number(
                            product.min_quantity || 0
                        )

                })
            );


        filteredProducts =
            [...products];


        renderProductsTable();

        updateStatistics();

        renderInventory();


        console.log(
            `Loaded ${products.length} products from MySQL`
        );


    } catch (error) {

        console.error(
            "Failed to load admin products:",
            error
        );


        if (productsTable) {

            productsTable.innerHTML = `

                <tr>

                    <td
                        colspan="10"
                        style="
                            text-align:center;
                            padding:40px;
                            color:#b42318;
                        "
                    >

                        ❌

                        <br>

                        فشل تحميل المنتجات

                        <br>

                        <small>
                            ${escapeHTML(
                                error.message
                            )}
                        </small>

                    </td>

                </tr>

            `;

        }

    }

}


/* =====================================================
   RENDER PRODUCTS TABLE
===================================================== */

function renderProductsTable() {

    if (!productsTable) return;


    if (
        filteredProducts.length === 0
    ) {

        productsTable.innerHTML = `

            <tr>

                <td
                    colspan="10"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#667085;
                    "
                >

                    لا توجد منتجات مطابقة.

                </td>

            </tr>

        `;

        return;

    }


    productsTable.innerHTML =
        filteredProducts
            .map(
                (product, index) => {

                    const active =
                        String(
                            product.status ||
                            ""
                        ).toUpperCase() ===
                        "ACTIVE";


                    return `

                        <tr>


                            <td>

                                ${
                                    index + 1
                                }

                            </td>


                            <td>

                                <strong>

                                    ${escapeHTML(
                                        product.name
                                    )}

                                </strong>

                            </td>


                            <td>

                                ${escapeHTML(
                                    product.model ||
                                    "-"
                                )}

                            </td>


                            <td>

                                ${escapeHTML(
                                    product.brand ||
                                    "-"
                                )}

                            </td>


                            <td>

                                ${escapeHTML(
                                    product.category ||
                                    "-"
                                )}

                            </td>


                            <td>

                                ${formatMoney(
                                    product.price
                                )}

                            </td>


                            <td>

                                ${formatDiscount(
                                    product
                                )}

                            </td>


                            <td>

                                <span
                                    style="
                                        display:inline-block;
                                        min-width:40px;
                                        padding:6px 10px;
                                        border-radius:8px;
                                        background:
                                            ${
                                                product.quantity <=
                                                product.min_quantity
                                                    ? "#fff4e5"
                                                    : "#f2f4f7"
                                            };
                                        color:
                                            ${
                                                product.quantity <=
                                                product.min_quantity
                                                    ? "#b54708"
                                                    : "#344054"
                                            };
                                    "
                                >

                                    ${product.quantity}

                                </span>

                            </td>


                            <td>

                                <span
                                    class="status ${
                                        active
                                            ? "active"
                                            : "inactive"
                                    }"
                                >

                                    ${
                                        active
                                            ? "فعال"
                                            : "غير فعال"
                                    }

                                </span>

                            </td>


                            <td>

                                <div
                                    style="
                                        display:flex;
                                        gap:6px;
                                        justify-content:center;
                                        flex-wrap:wrap;
                                    "
                                >

                                    <button
                                        type="button"
                                        class="view-all"
                                        onclick="
                                            editProduct(
                                                ${product.id}
                                            )
                                        "
                                    >

                                        ✏️ تعديل

                                    </button>


                                    <button
                                        type="button"
                                        class="view-all"
                                        onclick="
                                            deleteProduct(
                                                ${product.id}
                                            )
                                        "
                                        style="
                                            color:#b42318;
                                        "
                                    >

                                        🗑️ حذف

                                    </button>

                                </div>

                            </td>


                        </tr>

                    `;

                }
            )
            .join("");

}


/* =====================================================
   STATISTICS
===================================================== */

function updateStatistics() {

    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    if (totalStock) {

        const stock =
            products.reduce(
                (
                    total,
                    product
                ) =>
                    total +
                    numberValue(
                        product.quantity
                    ),
                0
            );


        totalStock.textContent =
            stock.toLocaleString();

    }

}


/* =====================================================
   SEARCH
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

    if (
        category === "tp-link switches" ||
        category === "tplink switches" ||
        category === "switches"
    ) {
        return "switches";
    }

    if (
        category === "mercusys"
    ) {
        return "mercusys";
    }

    return category;
}
function searchProductsTable() {

    const input =
        document.getElementById(
            "productSearch"
        );


    const query =
        input
            ? input.value
                .trim()
                .toLowerCase()
            : "";


    const category =
        document
            .getElementById(
                "productCategoryFilter"
            )
            ?.value ||
        "all";


    const status =
        document
            .getElementById(
                "productStatusFilter"
            )
            ?.value ||
        "all";


    filteredProducts =
        products.filter(
            product => {

                const text =
                    [
                        product.name,
                        product.model,
                        product.brand,
                        product.category,
                        product.subcategory
                    ]
                    .join(" ")
                    .toLowerCase();


                const matchesQuery =
                    !query ||
                    text.includes(
                        query
                    );

const productCategory =
    normalizeCategory(
        product.category
    );

const selectedCategory =
    normalizeCategory(
        category
    );

const matchesCategory =
    selectedCategory === "all" ||
    productCategory === selectedCategory;


                const active =
                    String(
                        product.status ||
                        ""
                    ).toUpperCase() ===
                    "ACTIVE";


                const matchesStatus =
                    status ===
                        "all" ||
                    (
                        status ===
                            "active" &&
                        active
                    ) ||
                    (
                        status ===
                            "inactive" &&
                        !active
                    );


                return (
                    matchesQuery &&
                    matchesCategory &&
                    matchesStatus
                );

            }
        );


    renderProductsTable();

}


/* =====================================================
   CATEGORY FILTER
===================================================== */

function filterProductsTable() {

    searchProductsTable();

}


/* =====================================================
   OPEN ADD PRODUCT
===================================================== */

function openAddProduct() {

    editingProductId =
        null;


    const title =
        document.getElementById(
            "productModalTitle"
        );


    if (title) {

        title.textContent =
            "إضافة منتج";

    }


    clearProductForm();


    document
        .getElementById(
            "productModal"
        )
        ?.classList.add(
            "show"
        );

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeAddProduct() {

    document
        .getElementById(
            "productModal"
        )
        ?.classList.remove(
            "show"
        );

}


/* =====================================================
   CLEAR FORM
===================================================== */

function clearProductForm() {

    const fields = [

        "productId",
        "productName",
        "productModel",
        "productSubcategory",
        "productCostPrice",
        "productPrice",
        "productQuantity",
        "productMinQuantity",
        "discountValue",
        "discountStart",
        "discountEnd",
        "productImage",
        "productDescription",
        "productSpecifications"

    ];


    fields.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (!element) return;


            element.value =
                "";

        }
    );


    const id =
        document.getElementById(
            "productId"
        );


    if (id) {

        id.value =
            "";

    }


    const cost =
        document.getElementById(
            "productCostPrice"
        );


    if (cost) {

        cost.value =
            "0";

    }


    const price =
        document.getElementById(
            "productPrice"
        );


    if (price) {

        price.value =
            "0";

    }


    const quantity =
        document.getElementById(
            "productQuantity"
        );


    if (quantity) {

        quantity.value =
            "0";

    }


    const minQuantity =
        document.getElementById(
            "productMinQuantity"
        );


    if (minQuantity) {

        minQuantity.value =
            "1";

    }


    const discountValue =
        document.getElementById(
            "discountValue"
        );


    if (discountValue) {

        discountValue.value =
            "0";

    }


    const brand =
        document.getElementById(
            "productBrand"
        );


    if (brand) {

        brand.value =
            "TP-Link";

    }


    const category =
        document.getElementById(
            "productCategory"
        );


    if (category) {

        category.value =
            "omada";

    }


    const discountType =
        document.getElementById(
            "discountType"
        );


    if (discountType) {

        discountType.value =
            "NONE";

    }


    const status =
        document.getElementById(
            "productStatus"
        );


    if (status) {

        status.value =
            "ACTIVE";

    }


    toggleDiscountFields();


    const message =
        document.getElementById(
            "productFormMessage"
        );


    if (message) {

        message.textContent =
            "";

        message.className =
            "form-message";

    }

}


/* =====================================================
   DISCOUNT FIELDS
===================================================== */

function toggleDiscountFields() {

    const type =
        document.getElementById(
            "discountType"
        )
        ?.value ||
        "NONE";


    const value =
        document.getElementById(
            "discountValue"
        );


    if (!value) return;


    if (type === "NONE") {

        value.value =
            "0";

        value.disabled =
            true;

    } else {

        value.disabled =
            false;

    }

}


/* =====================================================
   READ FORM
===================================================== */

function getProductFormData() {

    let specifications =
        {};


    const specificationsText =
        document.getElementById(
            "productSpecifications"
        )
        ?.value
        ?.trim() ||
        "";


    if (specificationsText) {

        try {

            specifications =
                JSON.parse(
                    specificationsText
                );

        } catch {

            throw new Error(
                "المواصفات يجب أن تكون JSON صحيحة."
            );

        }

    }


    const categoryValue =
        document.getElementById(
            "productCategory"
        )
        ?.value ||
        "omada";


    const category =
        getCategoryDisplayName(
            categoryValue
        );


    return {

        name:
            document.getElementById(
                "productName"
            )
            ?.value
            .trim() ||
            "",

        model:
            document.getElementById(
                "productModel"
            )
            ?.value
            .trim() ||
            "",

        brand:
            document.getElementById(
                "productBrand"
            )
            ?.value ||
            "TP-Link",


        category:
            category,


        subcategory:
            document.getElementById(
                "productSubcategory"
            )
            ?.value
            .trim() ||
            "",


        cost_price:
            numberValue(
                document.getElementById(
                    "productCostPrice"
                )
                ?.value
            ),


        price:
            numberValue(
                document.getElementById(
                    "productPrice"
                )
                ?.value
            ),


        quantity:
            Math.max(
                0,
                Math.trunc(
                    numberValue(
                        document.getElementById(
                            "productQuantity"
                        )
                        ?.value
                    )
                )
            ),


        min_quantity:
            Math.max(
                0,
                Math.trunc(
                    numberValue(
                        document.getElementById(
                            "productMinQuantity"
                        )
                        ?.value
                    )
                )
            ),


        discount_type:
            document.getElementById(
                "discountType"
            )
            ?.value ||
            "NONE",


        discount_value:
            Math.max(
                0,
                numberValue(
                    document.getElementById(
                        "discountValue"
                    )
                    ?.value
                )
            ),


        discount_start:
            document.getElementById(
                "discountStart"
            )
            ?.value ||
            null,


        discount_end:
            document.getElementById(
                "discountEnd"
            )
            ?.value ||
            null,


        image:
            document.getElementById(
                "productImage"
            )
            ?.value
            .trim() ||
            "",


        description:
            document.getElementById(
                "productDescription"
            )
            ?.value
            .trim() ||
            "",


        specifications:


            specifications,


        status:
            document.getElementById(
                "productStatus"
            )
            ?.value ||
            "ACTIVE"

    };

}


/* =====================================================
   CATEGORY DISPLAY NAME
===================================================== */

function getCategoryDisplayName(
    value
) {

    const map = {

        omada:
            "Omada",

        tplink:
            "TP-Link",

        switches:
            "Switches",

        vigi:
            "VIGI",

        tapo:
            "Tapo"

    };


    return (
        map[value] ||
        value
    );

}


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(id) {

    const product =
        products.find(
            item =>
                Number(
                    item.id
                ) ===
                Number(id)
        );


    if (!product) {

        alert(
            "المنتج غير موجود."
        );

        return;

    }


    editingProductId =
        Number(id);


    const title =
        document.getElementById(
            "productModalTitle"
        );


    if (title) {

        title.textContent =
            "تعديل المنتج";

    }


    setField(
        "productId",
        product.id
    );


    setField(
        "productName",
        product.name
    );


    setField(
        "productModel",
        product.model
    );


    setField(
        "productBrand",
        product.brand
    );


    setField(
        "productCategory",
        getCategorySelectValue(
            product.category
        )
    );


    setField(
        "productSubcategory",
        product.subcategory
    );


    setField(
        "productCostPrice",
        product.cost_price
    );


    setField(
        "productPrice",
        product.price
    );


    setField(
        "productQuantity",
        product.quantity
    );


    setField(
        "productMinQuantity",
        product.min_quantity
    );


    setField(
        "discountType",
        product.discount_type ||
        "NONE"
    );


    setField(
        "discountValue",
        product.discount_value
    );


    setField(
        "discountStart",
        toDatetimeLocal(
            product.discount_start
        )
    );


    setField(
        "discountEnd",
        toDatetimeLocal(
            product.discount_end
        )
    );


    setField(
        "productImage",
        product.image
    );


    setField(
        "productDescription",
        product.description
    );


    setField(
        "productStatus",
        product.status ||
        "ACTIVE"
    );


    let specifications =
        product.specifications;


    if (
        typeof specifications ===
        "string"
    ) {

        try {

            specifications =
                JSON.parse(
                    specifications
                );

        } catch {

            specifications =
                {};

        }

    }


    setField(
        "productSpecifications",
        JSON.stringify(
            specifications ||
            {},
            null,
            2
        )
    );


    toggleDiscountFields();


    document
        .getElementById(
            "productModal"
        )
        ?.classList.add(
            "show"
        );

}


/* =====================================================
   SET FIELD
===================================================== */

function setField(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value ??
            "";

    }

}


/* =====================================================
   CATEGORY SELECT VALUE
===================================================== */

function getCategorySelectValue(
    category
) {

    const value =
        String(
            category ||
            ""
        )
        .trim()
        .toLowerCase();


    if (
        value ===
        "omada"
    ) {
        return "omada";
    }


    if (
        value ===
        "tp-link"
    ) {
        return "tplink";
    }


    if (
        value ===
        "switches"
    ) {
        return "switches";
    }


    if (
        value ===
        "vigi"
    ) {
        return "vigi";
    }


    if (
        value ===
        "tapo"
    ) {
        return "tapo";
    }


    return "tplink";

}


/* =====================================================
   DATETIME LOCAL
===================================================== */

function toDatetimeLocal(
    value
) {

    if (!value) return "";


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    const pad =
        number =>
            String(
                number
            )
            .padStart(
                2,
                "0"
            );


    return (
        date.getFullYear() +
        "-" +
        pad(
            date.getMonth() + 1
        ) +
        "-" +
        pad(
            date.getDate()
        ) +
        "T" +
        pad(
            date.getHours()
        ) +
        ":" +
        pad(
            date.getMinutes()
        )
    );

}


/* =====================================================
   SAVE PRODUCT
===================================================== */

async function saveProduct() {

    try {

        const data =
            getProductFormData();
            /* =====================================================
   UPLOAD PRODUCT IMAGE
===================================================== */

const imageFile =
    document.getElementById(
        "productImageFile"
    )?.files?.[0];


if (imageFile) {

    const imageFormData =
        new FormData();


    imageFormData.append(
        "image",
        imageFile
    );


    const uploadResponse =
        await fetch(
            "/api/admin/upload-image",
            {
                method: "POST",
                body: imageFormData
            }
        );


    const uploadData =
        await uploadResponse.json();


    if (
        !uploadResponse.ok ||
        !uploadData.success
    ) {

        throw new Error(
            uploadData.message ||
            "فشل رفع صورة المنتج"
        );

    }


    data.image =
        uploadData.image;

}


        if (!data.name) {

            throw new Error(
                "أدخل اسم المنتج."
            );

        }


        if (
            data.discount_type ===
                "PERCENTAGE" &&
            data.discount_value > 100
        ) {

            throw new Error(
                "نسبة التخفيض لا يمكن أن تتجاوز 100%."
            );

        }


        if (
            data.discount_start &&
            data.discount_end
        ) {

            if (
                new Date(
                    data.discount_end
                ) <
                new Date(
                    data.discount_start
                )
            ) {

                throw new Error(
                    "نهاية التخفيض يجب أن تكون بعد البداية."
                );

            }

        }


        const isEdit =
            Boolean(
                editingProductId
            );


        const url =
            isEdit

                ?
                `/api/admin/products/${editingProductId}`

                :
                "/api/admin/products";


        const method =
            isEdit
                ? "PUT"
                : "POST";


        const button =
            document.querySelector(
                "#productModal .primary-button"
            );


        if (button) {

            button.disabled =
                true;

            button.textContent =
                "⏳ جاري الحفظ...";

        }


        const result =
            await apiRequest(
                url,
                {

                    method:

                        method,

                    body:
                        JSON.stringify(
                            data
                        )

                }
            );


        showMessage(
            result.message ||
            "تم الحفظ بنجاح.",
            "success"
        );


        await loadProducts();


        setTimeout(
            () => {

                closeAddProduct();

            },
            700
        );


    } catch (error) {

        console.error(
            "Save Product Error:",
            error
        );


        showMessage(
            error.message,
            "error"
        );


    } finally {

        const button =
            document.querySelector(
                "#productModal .primary-button"
            );


        if (button) {

            button.disabled =
                false;

            button.textContent =
                "💾 حفظ المنتج";

        }

    }

}


/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(
    id
) {

    const product =
        products.find(
            item =>
                Number(
                    item.id
                ) ===
                Number(id)
        );


    if (!product) return;


    const confirmed =
        confirm(
            `هل أنت متأكد من حذف المنتج:

${product.name}

لا يمكن التراجع عن هذا الإجراء.`
        );


    if (!confirmed) return;


    try {

        await apiRequest(
            `/api/admin/products/${id}`,
            {
                method:
                    "DELETE"
            }
        );


        await loadProducts();


        alert(
            "تم حذف المنتج بنجاح."
        );


    } catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );


        alert(
            "فشل حذف المنتج:\n\n" +
            error.message
        );

    }

}


/* =====================================================
   INVENTORY
===================================================== */

function renderInventory() {

    const container =
        document.getElementById(
            "inventoryList"
        );


    if (!container) return;


    const lowStock =
        products.filter(
            product =>
                numberValue(
                    product.quantity
                ) <=
                numberValue(
                    product.min_quantity
                )
        );


    if (
        lowStock.length ===
        0
    ) {

        container.innerHTML = `

            <div
                class="inventory-empty"
            >

                <span>
                    ✅
                </span>

                <p>
                    المخزون بحالة جيدة.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        lowStock
            .map(
                product => `

                    <div
                        class="inventory-item"
                    >

                        <div>

                            <strong>

                                ${escapeHTML(
                                    product.name
                                )}

                            </strong>

                            <small>

                                الكمية الحالية:
                                ${product.quantity}

                            </small>

                        </div>


                        <strong
                            style="
                                color:#b54708;
                            "
                        >

                            مخزون منخفض

                        </strong>

                    </div>

                `
            )
            .join("");

}


/* =====================================================
   QUICK ACTIONS
===================================================== */

function openInventory() {

    document
        .getElementById(
            "inventory"
        )
        ?.scrollIntoView({

            behavior:
                "smooth"

        });

}


function openOrders() {

    document
        .getElementById(
            "orders"
        )
        ?.scrollIntoView({

            behavior:
                "smooth"

        });

}


function openReports() {

    document
        .getElementById(
            "reports"
        )
        ?.scrollIntoView({

            behavior:
                "smooth"

        });

}


/* =====================================================
   LOGOUT
===================================================== */
async function logout() {

    const confirmed =
        confirm("هل تريد تسجيل الخروج؟");

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                "/api/admin/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        const result =
            await response.json();

        if (!response.ok || !result.success) {

            alert(
                result.message ||
                "فشل تسجيل الخروج"
            );

            return;
        }

        window.location.href =
            "index.html";

    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );

        alert(
            "تعذر الاتصال بالخادم"
        );

    }
}


/* =====================================================
   SIDEBAR ACTIVE
===================================================== */

function setupSidebar() {

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".menu-item"
                            )
                            .forEach(
                                link =>
                                    link.classList.remove(
                                        "active"
                                    )
                            );


                        this.classList.add(
                            "active"
                        );

                    }
                );

            }
        );

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        setupSidebar();

        toggleDiscountFields();

        await loadProducts();
        await loadStoreSettings();
        await loadRecentOrders();
        await loadSales();

    }
);
/* =====================================================
   STORE SETTINGS
===================================================== */
async function loadStoreSettings() {

    try {

        const result =
            await apiRequest(
                "/api/admin/settings"
            );

        if (
            result.success &&
            result.settings
        ) {

            const whatsappInput =
                document.getElementById(
                    "storeWhatsapp"
                );

            const emailInput =
                document.getElementById(
                    "storeEmail"
                );

            const addressInput =
                document.getElementById(
                    "storeAddress"
                );


            if (whatsappInput) {

                whatsappInput.value =
                    result.settings.whatsapp_phone || "";

            }


            if (emailInput) {

                emailInput.value =
                    result.settings.store_email || "";

            }


            if (addressInput) {

                addressInput.value =
                    result.settings.store_address || "";

            }

        }

    } catch (error) {

        console.error(
            "Load Store Settings Error:",
            error
        );

    }

}
async function saveStoreSettings() {

    try {

        const whatsappInput =
            document.getElementById(
                "storeWhatsapp"
            );

        const emailInput =
            document.getElementById(
                "storeEmail"
            );

        const addressInput =
            document.getElementById(
                "storeAddress"
            );


        const whatsappPhone =
            whatsappInput?.value.trim() || "";

        const storeEmail =
            emailInput?.value.trim() || "";

        const storeAddress =
            addressInput?.value.trim() || "";


        if (!whatsappPhone) {

            throw new Error(
                "أدخل رقم واتساب المتجر"
            );

        }


        const result =
            await apiRequest(
                "/api/admin/settings",
                {

                    method: "PUT",

                    body:
                        JSON.stringify({
                            whatsapp_phone:
                                whatsappPhone,

                            store_email:
                                storeEmail,

                            store_address:
                                storeAddress
                        })

                }
            );


        const message =
            document.getElementById(
                "settingsMessage"
            );


        if (message) {

            message.textContent =
                result.message ||
                "تم حفظ الإعدادات بنجاح";

            message.className =
                "form-message success";

        }


    } catch (error) {

        console.error(
            "Save Store Settings Error:",
            error
        );


        const message =
            document.getElementById(
                "settingsMessage"
            );


        if (message) {

            message.textContent =
                error.message;

            message.className =
                "form-message error";

        } else {

            alert(
                error.message
            );

        }

    }

}
async function loadRecentOrders() {

    try {

        const response =
            await fetch("/api/admin/orders");

        const result =
            await response.json();


        if (
            !response.ok ||
            !result.success
        ) {

            console.error(
                "Orders API Error:",
                result.message
            );

            return;

        }


        const table =
            document.getElementById(
                "recentOrdersTable"
            );


        if (!table) return;


        if (!result.orders.length) {

            table.innerHTML = `
                <tr>
                    <td>—</td>
                    <td>لا توجد طلبات</td>
                    <td>—</td>
                    <td>—</td>
                    <td>
                        <span class="status empty">
                            فارغ
                        </span>
                    </td>
                </tr>
            `;

            return;

        }


        table.innerHTML =
            result.orders
                .map(order => {

                    return `
                        <tr>

                            <td>
                                ${order.order_number}
                            </td>

                            <td>
                                ${order.customer_name || "—"}
                            </td>

                            <td>
                                ${order.items || "—"}
                            </td>

                            <td>
                                ${Number(order.total || 0).toLocaleString("en-US")}
                                د.ع
                            </td>

                            <td>
                                <span class="status">
                                    ${order.status}
                                </span>
                            </td>
                            <td>
    <button
        class="view-all"
        onclick="viewOrderDetails(${order.id})"
    >
        تفاصيل
    </button>
</td>

                        </tr>
                    `;

                })
                .join("");


    } catch (error) {

        console.error(
            "Load Recent Orders Error:",
            error
        );

    }

}
async function viewOrderDetails(orderId) {
    const modal = document.getElementById("orderDetailsModal");
    const content = document.getElementById("orderDetailsContent");

    if (!modal || !content) return;

    modal.style.display = "flex";

    content.innerHTML = `
        <p>جاري تحميل تفاصيل الطلب...</p>
    `;

    try {
        const response = await fetch(`/api/admin/orders/${orderId}`);

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "فشل تحميل تفاصيل الطلب"
            );
        }

        const order = result.order;
        const items = result.items || [];

        content.innerHTML = `
            <div>
                <p>
                    <strong>رقم الطلب:</strong>
                    ${order.order_number}
                </p>

                <p>
                    <strong>العميل:</strong>
                    ${order.customer_name || "—"}
                </p>

                <p>
                    <strong>الهاتف:</strong>
                    ${order.customer_phone || "—"}
                </p>

                <p>
                    <strong>العنوان:</strong>
                    ${order.customer_address || order.shipping_address || "—"}
                </p>

                <hr>

                <h3>المنتجات</h3>

                ${
                    items.length
                        ? items.map(item => `
                            <div>
                                ${item.product_name}
                                × ${item.quantity}
                            </div>
                        `).join("")
                        : "<p>لا توجد منتجات</p>"
                }

                <hr>

                <p>
                    <strong>المجموع:</strong>
                    ${Number(order.total || 0).toLocaleString("en-US")} د.ع
                </p>

              <div style="margin-top: 15px;">
    <strong>الحالة:</strong>

    <select
        id="orderStatusSelect"
        style="
            margin-top: 8px;
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #d0d5dd;
        "
    >
        <option value="NEW" ${order.status === "NEW" ? "selected" : ""}>
            NEW
        </option>

        <option value="CONFIRMED" ${order.status === "CONFIRMED" ? "selected" : ""}>
            CONFIRMED
        </option>

        <option value="PROCESSING" ${order.status === "PROCESSING" ? "selected" : ""}>
            PROCESSING
        </option>

        <option value="READY" ${order.status === "READY" ? "selected" : ""}>
            READY
        </option>

        <option value="SHIPPED" ${order.status === "SHIPPED" ? "selected" : ""}>
            SHIPPED
        </option>

        <option value="COMPLETED" ${order.status === "COMPLETED" ? "selected" : ""}>
            COMPLETED
        </option>

        <option value="CANCELLED" ${order.status === "CANCELLED" ? "selected" : ""}>
            CANCELLED
        </option>
    </select>
    <br><br>

<button
    class="view-all"
    onclick="updateOrderStatus(${order.id})"
>
    حفظ الحالة
</button>
</div>
            </div>
        `;

    } catch (error) {
        console.error("Order Details Error:", error);

        content.innerHTML = `
            <p>
                ${error.message}
            </p>
        `;
    }
}

function closeOrderDetails() {
    const modal = document.getElementById("orderDetailsModal");

    if (modal) {
        modal.style.display = "none";
    }
}
async function updateOrderStatus(orderId) {
    const select = document.getElementById("orderStatusSelect");

    if (!select) return;

    const status = select.value;

    try {
        const response = await fetch(
            `/api/admin/orders/${orderId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    status: status
                })
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "فشل تحديث حالة الطلب"
            );
        }

        alert("تم تحديث حالة الطلب بنجاح");

        await loadRecentOrders();
        await loadSales();

        closeOrderDetails();

    } catch (error) {
        console.error(
            "Update Order Status Error:",
            error
        );

        alert(error.message);
    }
}
async function loadSales() {
    try {
        const response = await fetch("/api/admin/sales");

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "فشل تحميل المبيعات"
            );
        }

        const table = document.getElementById("salesTable");
        const salesCount = document.getElementById("salesCount");
const salesTotal = document.getElementById("salesTotal");

if (salesCount) {
    salesCount.textContent = Number(
        result.summary?.sales_count || 0
    ).toLocaleString("en-US");
}

if (salesTotal) {
    salesTotal.textContent =
        Number(
            result.summary?.sales_total || 0
        ).toLocaleString("en-US") + " د.ع";
}

        if (!table) return;

        if (!result.sales || result.sales.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="4">
                        لا توجد مبيعات مكتملة
                    </td>
                </tr>
            `;

            return;
        }

        table.innerHTML = result.sales.map(sale => `
            <tr>
                <td>
                    ${sale.order_number}
                </td>

                <td>
                    ${sale.customer_name || "—"}
                </td>

                <td>
                    ${Number(sale.total || 0).toLocaleString("en-US")} د.ع
                </td>

                <td>
                    ${new Date(sale.created_at).toLocaleDateString("ar-IQ")}
                </td>
            </tr>
        `).join("");

    } catch (error) {
        console.error(
            "Load Sales Error:",
            error
        );
    }
}