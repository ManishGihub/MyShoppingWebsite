// Single Product page

var mainImg = document.getElementById("mainImg");
var smallImg = document.getElementsByClassName("small-img");

for (var imageIndex = 0; imageIndex < smallImg.length; imageIndex++) {
  smallImg[imageIndex].onclick = function (event) {
    mainImg.src = event.target.src;
  };
}

//shop page

// search function

const search = () => {
  const searchBox = document.getElementById("search-item").value.toUpperCase();
  const storeItems = document.getElementById("product-list");
  const product = storeItems.querySelectorAll(".pro");
  const productName = storeItems.querySelectorAll("h5");
  let textvalue;
  let match;

  for (
    var productIndex = 0;
    productIndex < productName.length;
    productIndex++
  ) {
    match = productName[productIndex];

    if (match) {
      textvalue = match.textContent || match.innerHTML;

      if (textvalue.toUpperCase().indexOf(searchBox) > -1) {
        product[productIndex].style.display = "";
      } else {
        product[productIndex].style.display = "none";
      }
    }
  }
};

//cart page

// Initialize the cart element
let cart = document.querySelector(".cart");

// Initialize an empty array to store cart items
let cartItems = [];

// Check if the document is fully loaded
if (document.readyState == "loading") {
  // If not fully loaded, wait for DOMContentLoaded event
  document.addEventListener("DOMContentLoaded", ready);
} else {
  // If already loaded, call ready function directly
  ready();
}

// Function to execute when the document is ready
function ready() {
  // Initialize cart items from local storage if available
  if (localStorage.getItem("cartItems")) {
    cartItems = JSON.parse(localStorage.getItem("cartItems"));
    // Update cart display with items from local storage
    updateCartDisplay();
  }

  // Add event listeners for remove buttons
  var removeCartButtons = document.getElementsByClassName("cart-remove");
  for (buttonIndex = 0; buttonIndex < removeCartButtons.length; buttonIndex++) {
    var button = removeCartButtons[buttonIndex];
    button.addEventListener("click", removeCartItem);
  }

  // Add event listeners for quantity changes
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (inputIndex = 0; inputIndex < quantityInputs.length; inputIndex++) {
    var input = quantityInputs[inputIndex];
    input.addEventListener("change", quantityChanged);
  }

  // Add event listeners for add to cart buttons
  var addCart = document.getElementsByClassName("cart-icon");
  for (buttonIndex = 0; buttonIndex < addCart.length; buttonIndex++) {
    var button = addCart[buttonIndex];
    button.addEventListener("click", addCartClicked);
  }

  // Add event listener for buy button
  document
    .getElementsByClassName("buy-btn")[0]
    .addEventListener("click", buyButtonClicked);
}

// Function to handle buy button click
function buyButtonClicked() {
  // Create a new toast element
  var toast = document.createElement("div");
  toast.classList.add("toast");
  toast.classList.add("align-items-center");
  toast.classList.add("text-bg-primary");
  toast.classList.add("border-0");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  // Construct the toast content
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        Your order has been placed successfully!
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  // Append the toast to the toast container
  var toastContainer = document.getElementById("toastContainer");
  toastContainer.appendChild(toast);

  // Initialize Bootstrap toast object
  var bsToast = new bootstrap.Toast(toast);

  // Show the toast
  bsToast.show();

  // Clear cart items
  cartItems = [];

  // Update cart display
  updateCartDisplay();

  // Remove cart items from local storage
  localStorage.removeItem("cartItems");
}

// Function to handle remove button click
function removeCartItem(event) {
  // Get the index of the item to remove
  var indexToRemove = event.target.getAttribute("data-index");
  // Remove the item from cartItems array
  cartItems.splice(indexToRemove, 1);
  // Update cart display
  updateCartDisplay();
  // Update local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to handle quantity changes
function quantityChanged(event) {
  // Get the input element
  var input = event.target;
  // Get the index of the item to update
  var indexToUpdate =
    input.parentElement.parentElement.getAttribute("data-index");
  // Parse the input value as an integer
  var newQuantity = parseInt(input.value);

  // If the new quantity is less than or equal to 0, reset it to 1
  if (newQuantity <= 0) {
    input.value = 1;
    newQuantity = 1;
  }

  // Update quantity in cartItems array
  cartItems[indexToUpdate].quantity = newQuantity;
  // Update cart display
  updateCartDisplay();
  // Update local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to handle add to cart button click
function addCartClicked(event) {
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImg = shopProducts.getElementsByClassName("product-img")[0].src;

  // Check if item is already in cart
  var itemExists = cartItems.some((item) => item.title === title);
  if (itemExists) {
    // Increment quantity by 1 if item already exists
    var existingItem = cartItems.find((item) => item.title === title);
    existingItem.quantity++;
    // Update cart display
    updateCartDisplay();
    // Update local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    return;
  }

  // Add item to cartItems array
  cartItems.push({
    title: title,
    price: price,
    productImg: productImg,
    quantity: 1, // Default quantity is 1
  });

  // Update cart display
  updateCartDisplay();
  // Update local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to update total and cart display
function updateCartDisplay() {
  var cartContent = document.querySelector(".cart-content");
  cartContent.innerHTML = ""; // Clear existing cart content
  var totalPrice = 0;
  cartItems.forEach(function (item, index) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    cartShopBox.setAttribute("data-index", index); // Set data-index attribute
    var cartBoxContent = `
      <img src="${item.productImg}" alt="" class="cart-img" />
      <div class="detail-box">
        <div class="cart-product-title">${item.title}</div>
        <div class="cart-price">${item.price}</div>
        <input type="number" value="${item.quantity}" class="cart-quantity" />
      </div>
      <!-- Remove cart -->
      <i class="fa-solid fa-trash cart-remove" data-index="${index}"></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartContent.appendChild(cartShopBox);

    // Update total price
    var price = parseFloat(item.price.replace("Rs.", ""));
    totalPrice += price * item.quantity;
  });

  // If price contains some value in points
  totalPrice = Math.round(totalPrice * 100) / 100;

  // Update total price display
  document.getElementsByClassName("total-price")[0].innerText =
    "Rs." + totalPrice;

  // Add event listeners to quantity inputs
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var inputIndex = 0; inputIndex < quantityInputs.length; inputIndex++) {
    quantityInputs[inputIndex].addEventListener("change", quantityChanged);
  }

  // Add event listeners to remove buttons
  var removeButtons = document.querySelectorAll(".cart-remove");
  removeButtons.forEach(function (button) {
    button.addEventListener("click", removeCartItem);
  });
}
