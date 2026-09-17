const products = {
    phone: {
        id: "phone",
        name: "گوشی هوشمند Firan X1",
        price: 17010000
    },

    headphones: {
        id: "headphones",
        name: "هدفون بی‌سیم Firan AirSound",
        price: 2191200
    },

    laptop: {
        id: "laptop",
        name: "لپ‌تاپ FiranBook 15",
        price: 35788000
    },

    watch: {
        id: "watch",
        name: "ساعت هوشمند Firan Watch S2",
        price: 2796500
    },

    keyboard: {
        id: "keyboard",
        name: "ست موس و کیبورد بی‌سیم Firan Office",
        price: 1341000
    },

    charger: {
        id: "charger",
        name: "شارژر سریع Firan Charge 25W",
        price: 783200
    }
};


/* ================= سبد خرید ================= */

let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("firanCart")) || [];
} catch (error) {
    cart = [];
}


function saveCart() {
    localStorage.setItem("firanCart", JSON.stringify(cart));
}


function formatPrice(number) {
    return Number(number).toLocaleString("fa-IR") + " تومان";
}


function updateCartCount() {

    const element = document.getElementById("cartCount");

    if (!element) return;

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    element.textContent = count.toLocaleString("fa-IR");
}


/* ================= افزودن محصول ================= */

function addToCart(productId) {

    const product = products[productId];

    if (!product) {
        console.error("محصول پیدا نشد:", productId);
        return;
    }

    const existing = cart.find(
        item => item.id === productId
    );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    updateCartCount();

    const cartSection = document.getElementById("cart");

    if (cartSection) {
        cartSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


/* ================= نمایش سبد ================= */

function renderCart() {

    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const cartSummary = document.getElementById("cartSummary");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems) return;

    if (cart.length === 0) {

        cartItems.style.display = "none";

        if (emptyCart) {
            emptyCart.style.display = "block";
        }

        if (cartSummary) {
            cartSummary.style.display = "none";
        }

        return;
    }


    if (emptyCart) {
        emptyCart.style.display = "none";
    }

    cartItems.style.display = "grid";

    if (cartSummary) {
        cartSummary.style.display = "block";
    }


    cartItems.innerHTML = "";


    cart.forEach(item => {

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `
            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <div class="cart-item-price">
                    ${formatPrice(item.price)}
                </div>

            </div>

            <div class="quantity-controls">

                <button
                    type="button"
                    onclick="increaseQuantity('${item.id}')">
                    +
                </button>

                <span>
                    ${item.quantity.toLocaleString("fa-IR")}
                </span>

                <button
                    type="button"
                    onclick="decreaseQuantity('${item.id}')">
                    −
                </button>

            </div>

            <button
                type="button"
                class="remove-item"
                onclick="removeFromCart('${item.id}')">

                حذف

            </button>
        `;

        cartItems.appendChild(itemElement);
    });


    const total = cart.reduce(
        (sum, item) =>
            sum + item.price * item.quantity,
        0
    );


    if (cartTotal) {
        cartTotal.textContent = formatPrice(total);
    }
}


/* ================= افزایش تعداد ================= */

function increaseQuantity(productId) {

    const item = cart.find(
        item => item.id === productId
    );

    if (!item) return;

    item.quantity += 1;

    saveCart();
    renderCart();
    updateCartCount();
}


/* ================= کاهش تعداد ================= */

function decreaseQuantity(productId) {

    const item = cart.find(
        item => item.id === productId
    );

    if (!item) return;

    item.quantity -= 1;

    if (item.quantity <= 0) {

        cart = cart.filter(
            item => item.id !== productId
        );
    }

    saveCart();
    renderCart();
    updateCartCount();
}


/* ================= حذف محصول ================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();
    renderCart();
    updateCartCount();
}


/* ================= جستجو ================= */

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;

    searchInput.addEventListener(
        "input",
        function () {

            const searchText =
                this.value.trim().toLowerCase();

            const cards =
                document.querySelectorAll(".product-card");

            let visibleCount = 0;


            cards.forEach(card => {

                const name =
                    card.dataset.name || "";

                const text =
                    name.toLowerCase();

                const visible =
                    text.includes(searchText);

                card.style.display =
                    visible ? "" : "block";

                if (!visible) {
                    card.style.display = "none";
                }

                if (visible) {
                    visibleCount++;
                }
            });


            const noProducts =
                document.getElementById("noProducts");

            if (noProducts) {

                noProducts.style.display =
                    visibleCount === 0
                        ? "block"
                        : "none";
            }
        }
    );
}


/* ================= دسته‌بندی ================= */

function setupCategories() {

    const buttons =
        document.querySelectorAll(".category-btn");

    const cards =
        document.querySelectorAll(".product-card");


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                buttons.forEach(btn =>
                    btn.classList.remove("active")
                );

                this.classList.add("active");


                const category =
                    this.dataset.category;

                let visibleCount = 0;


                cards.forEach(card => {

                    const cardCategory =
                        card.dataset.category;


                    if (
                        category === "all" ||
                        cardCategory === category
                    ) {

                        card.style.display = "";
                        visibleCount++;

                    } else {

                        card.style.display = "none";
                    }
                });


                const noProducts =
                    document.getElementById("noProducts");

                if (noProducts) {

                    noProducts.style.display =
                        visibleCount === 0
                            ? "block"
                            : "none";
                }
            }
        );
    });
}


/* ================= دکمه‌های افزودن ================= */

function setupAddToCartButtons() {

    const buttons =
        document.querySelectorAll(".add-to-cart-btn");


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    this.dataset.id;

                addToCart(productId);

            }
        );
    });
}


/* ================= رفتن به پرداخت ================= */

function setupCheckout() {

    const button =
        document.getElementById("checkoutButton");

    const checkout =
        document.getElementById("checkout");


    if (!button || !checkout) return;


    button.addEventListener(
        "click",
        function () {

            if (cart.length === 0) {
                alert("سبد خرید شما خالی است.");
                return;
            }

            checkout.style.display = "block";

            checkout.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    );
}


/* ================= ثبت سفارش ================= */

function setupCheckoutForm() {

    const form =
        document.getElementById("checkoutForm");

    const result =
        document.getElementById("orderResult");


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (cart.length === 0) {

                alert("سبد خرید شما خالی است.");
                return;
            }


            const name =
                document.getElementById(
                    "customerName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "customerPhone"
                ).value.trim();


            const address =
                document.getElementById(
                    "customerAddress"
                ).value.trim();


            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                )?.value || "cod";


            if (!name || !phone || !address) {

                alert(
                    "لطفاً تمام اطلاعات سفارش را وارد کنید."
                );

                return;
            }


            const total =
                cart.reduce(
                    (sum, item) =>
                        sum +
                        item.price *
                        item.quantity,
                    0
                );


            const order = {

                customer: {
                    name,
                    phone,
                    address
                },

                payment,

                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),

                total,

                createdAt:
                    new Date().toISOString()
            };


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

                            body:
                                JSON.stringify(order)
                        }
                    );


                if (!response.ok) {
                    throw new Error(
                        "خطا در ثبت سفارش"
                    );
                }


                const data =
                    await response.json();


                cart = [];

                saveCart();
                updateCartCount();
                renderCart();


                form.style.display = "none";


                if (result) {

                    result.style.display = "block";

                    result.innerHTML = `

                        <h3>
                            ✅ سفارش شما با موفقیت ثبت شد
                        </h3>

                        <p>
                            شماره سفارش:
                            <strong>
                                ${data.orderId || "ثبت شد"}
                            </strong>
                        </p>

                        <p>
                            مبلغ سفارش:
                            <strong>
                                ${formatPrice(total)}
                            </strong>
                        </p>

                        <button
                            type="button"
                            onclick="window.print()"
                            class="submit-order-btn">

                            🖨️ چاپ رسید سفارش

                        </button>
                    `;
                }


            } catch (error) {

                console.error(error);

                alert(
                    "ثبت سفارش انجام نشد. مطمئن شوید سرور فیران کالا در حال اجراست."
                );
            }
        }
    );
}


/* ================= اجرای برنامه ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        renderCart();

        setupSearch();

        setupCategories();

        setupAddToCartButtons();

        setupCheckout();

        setupCheckoutForm();

    }
);