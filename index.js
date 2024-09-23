// State with items and cart
const state = {
  items: [
    { id: "001-beetroot", name: "beetroot", price: 0.35, quantity: 0, type: "vegetable" },
    { id: "002-carrot", name: "carrot", price: 0.35, quantity: 0, type: "vegetable" },
    { id: "003-apple", name: "apple", price: 0.35, quantity: 0, type: "fruit" },
    { id: "004-apricot", name: "apricot", price: 0.35, quantity: 0, type: "fruit" },
    { id: "005-avocado", name: "avocado", price: 0.35, quantity: 0, type: "fruit" },
    { id: "006-bananas", name: "bananas", price: 0.35, quantity: 0, type: "fruit" },
    { id: "007-bell-pepper", name: "bell pepper", price: 0.35, quantity: 0, type: "vegetable" },
    { id: "008-berry", name: "berry", price: 0.35, quantity: 0, type: "fruit" },
    { id: "009-blueberry", name: "blueberry", price: 0.35, quantity: 0, type: "fruit" },
    { id: "010-eggplant", name: "eggplant", price: 0.35, quantity: 0, type: "vegetable" }
  ],
  cart: [],
  filterType: "all",
  sortType: "none"
}


function renderStoreItems() {
  const storeItemList = document.querySelector(".store--item-list")
  storeItemList.innerHTML = '' // Clear the store items before re-rendering

  // Filter items based on the selected type (or show all if "all" is selected)
  let filteredItems = state.items.filter(item => {
    if (state.filterType === "all") return true
    return item.type === state.filterType
  })

  if (state.sortType === "price") {
    filteredItems.sort((a, b) => a.price - b.price) // Sort by price (low to high)
  } else if (state.sortType === "name") {
    filteredItems.sort((a, b) => a.name.localeCompare(b.name)) // Sort by name (alphabetically)
  }

  // Loop through the filtered and sorted items and render them
  filteredItems.forEach(item => {
    const li = document.createElement('li')
    li.innerHTML = `
      <div class="store--item-icon">
        <img src="assets/icons/${item.id}.svg" alt="${item.name}" />
      </div>
      <button>Add to cart</button>
    `

    // Add event listener to the "Add to cart" button
    li.querySelector("button").addEventListener("click", () => addToCart(item))

    storeItemList.appendChild(li)
  })
}


function addToCart(item) {
  // Check if the item is already in the cart
  const cartItem = state.cart.find(cartItem => cartItem.id === item.id)
  
  if (cartItem) {
    cartItem.quantity++
  } else {
    // If the item is not in the cart, add it to the cart with quantity 1
    state.cart.push({ ...item, quantity: 1 })
  }

  renderCartItems()
  updateTotalCost()
}


function renderCartItems() {
  const cartItemList = document.querySelector(".cart--item-list")
  cartItemList.innerHTML = '' // Clear the cart before re-rendering

  state.cart.forEach(cartItem => {
    const li = document.createElement('li')
    li.innerHTML = `
      <img class="cart--item-icon" src="assets/icons/${cartItem.id}.svg" alt="${cartItem.name}" />
      <p>${cartItem.name}</p>
      <button class="quantity-btn remove-btn center">-</button>
      <span class="quantity-text center">${cartItem.quantity}</span>
      <button class="quantity-btn add-btn center">+</button>
    `;

    // Add event listeners for the "+" and "-" buttons
    li.querySelector(".add-btn").addEventListener("click", () => increaseQuantity(cartItem))
    li.querySelector(".remove-btn").addEventListener("click", () => decreaseQuantity(cartItem))

    cartItemList.appendChild(li)
  })
}


function increaseQuantity(cartItem) {
  cartItem.quantity++
  renderCartItems()
  updateTotalCost()
}


function decreaseQuantity(cartItem) {
  cartItem.quantity--

  if (cartItem.quantity === 0) {
    // Remove item from the cart if the quantity is 0
    state.cart = state.cart.filter(item => item.id !== cartItem.id)
  }

  updateTotalCost()
  renderCartItems()
}

function updateTotalCost() {
  const totalElement = document.querySelector(".total-number")
  let total = 0

  state.cart.forEach(cartItem => {
    total += cartItem.price * cartItem.quantity
  })

  totalElement.textContent = `£${total.toFixed(2)}`
}

function handleFilterChange() {
  const filterSelect = document.getElementById("type-filter")

  // Update the state with the selected filter value
  filterSelect.addEventListener("change", (event) => {
    state.filterType = event.target.value
    renderStoreItems()
  })
}

function handleSortChange() {
  const sortSelect = document.getElementById("sort-by")

  sortSelect.addEventListener("change", (event) => {
    state.sortType = event.target.value
    renderStoreItems()
  })
}

// Function to handle showing/hiding the product form
function handleShowForm() {
  const showFormBtn = document.getElementById("show-form-btn")
  const productForm = document.getElementById("product-form")

  showFormBtn.addEventListener("click", () => {
    const isVisible = productForm.style.display === "block"
    productForm.style.display = isVisible ? "none" : "block"
  })
}


function handleNewProductForm() {
  const newProductForm = document.getElementById("new-product-form")

  newProductForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const name = document.getElementById("product-name").value
    const price = parseFloat(document.getElementById("product-price").value)
    const type = document.getElementById("product-type").value
    const image = document.getElementById("product-image").value

    // Create a new product object
    const newProduct = {
      id: `new-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name,
      price,
      quantity: 0,
      type
    }

    state.items.push(newProduct)

    // Clear the form inputs
    newProductForm.reset()
    document.getElementById("product-form").style.display = "none"


    renderStoreItems()
  })
}

handleShowForm()

handleNewProductForm()

handleFilterChange()

handleSortChange()

renderStoreItems()
