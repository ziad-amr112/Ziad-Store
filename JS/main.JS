let category_nav_list = document.querySelector(".category_nav_list");
function Open_Categ_list() {
  category_nav_list.classList.toggle("active");
}

var cart = document.querySelector(".cart");
function Open_Close_cart() {
  cart.classList.toggle("active");
}

let nav_links = document.querySelector(".nav-links");
function Open_Menu_links() {
  nav_links.classList.toggle("active");
}


fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    const addToCartButtons = document.querySelectorAll(".btn_add_cart");

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-id");
        const selectProduct = data.find((product) => product.id == productId);
        addToCart(selectProduct);
        const allMatchingButtons = document.querySelectorAll(
          `.btn_add_cart[data-id="${productId}"]`
        );
        allMatchingButtons.forEach((btn) => {
          btn.classList.add("active");
          btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Item in cart`;
        });
      });
    });
  });
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ ...product, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}
function updateCart() {
  const cartItemsContainer = document.getElementById("cart_items");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  var total_price = 0;

  var total_count = 0;

  cartItemsContainer.innerHTML = "";
  cart.forEach((item, index) => {
    let total_price_item = item.price * item.quantity;

    total_price += total_price_item;
    total_count += item.quantity;

    cartItemsContainer.innerHTML += `

    <div class="item_cart">
          <img src="${item.img}" alt="">
          <div class="content">
            <h4>${item.name}</h4>
            <p class="price_cart">${total_price_item}$</p>
            <div class="quantity_control">
              <button class="neg_quantity" data-index="${index}" >-</button>
              <span class="quantity">${item.quantity}</span>
              <button class="pos_quantity" data-index="${index}">+</button>
            </div>
          </div>

        <button class="delete_item" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button>
        </div>


    `;
  });

  const Count_item_total = document.querySelector(".price_cart_total");

  const Count_item_cart = document.querySelector(".Count_item_cart");

  const Count_item_header = document.querySelector(".count-item-header");

  Count_item_total.innerHTML = `$ ${total_price}`;
  Count_item_header.innerHTML = total_count;
  Count_item_cart.innerHTML = total_count;

  const increaseButtons = document.querySelectorAll(".pos_quantity");

  const decreaseButtons = document.querySelectorAll(".neg_quantity");

  const deleteBtns = document.querySelectorAll(".delete_item");

  increaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemIndex = event.target.getAttribute("data-index");
      increaseQuantity(itemIndex);
    });
  });

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemIndex = event.target.getAttribute("data-index");
      decreaseQuantity(itemIndex);
    });
  });

  deleteBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      const itemIndex = event.target
        .closest("button")
        .getAttribute("data-index");
      removeFromcart(itemIndex);
    });
  });
}
function increaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function decreaseQuantity(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function removeFromcart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const removeProduct = cart.splice(index, 1)[0];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
  updateButonsState(removeProduct.id);
}

function updateButonsState(productId) {
  const allMatchingButtons = document.querySelectorAll(
    `.btn_add_cart[data-id="${productId}"]`
  );
  allMatchingButtons.forEach((button) => {
    button.classList.remove("active");
    button.innerHTML = `  <i class="fa-solid fa-cart-shopping"></i> add to cart`;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  let orderItems = JSON.parse(localStorage.getItem("cart")) || [];

  const itemsContainer = document.getElementById("order-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  // تحديث العناصر في الـ DOM
  function renderOrderItems() {
    itemsContainer.innerHTML = "";

    orderItems.forEach((item, index) => {
      itemsContainer.innerHTML += `
        <div class="item_cart" data-index="${index}">
          <div class="image_name">
            <img src="${item.img}" alt="${item.name}" />
            <div class="content">
              <h4>${item.name}</h4>
              <p class="price_cart">${item.price * item.quantity}$</p>
              <div class="quantity_control">
                <button class="decrease_quantity" data-index="${index}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase_quantity" data-index="${index}">+</button>
              </div>
            </div>
          </div>
          <button class="delete_item" data-index="${index}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    });

    updateTotals();
    attachEventListeners();
  }

  function updateTotals() {
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 25;
    const total = subtotal + shipping;

    subtotalElement.innerText = `${subtotal}$`;
    totalElement.innerText = `${total}$`;
  }

  function attachEventListeners() {
    document.querySelectorAll(".increase_quantity").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        orderItems[index].quantity++;
        updateCart();
      });
    });

    document.querySelectorAll(".decrease_quantity").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        if (orderItems[index].quantity > 1) {
          orderItems[index].quantity--;
          updateCart();
        }
      });
    });

    document.querySelectorAll(".delete_item").forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.index;
        removeItemFromCart(index);
      });
    });
  }

  function removeItemFromCart(index) {
    orderItems.splice(index, 1);
    updateCart();
  }

  function updateCart() {
    localStorage.setItem("cart", JSON.stringify(orderItems));
    renderOrderItems();
  }

  renderOrderItems();
});

updateCart();
