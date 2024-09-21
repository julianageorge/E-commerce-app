const cart = JSON.parse(localStorage.getItem('cart')) || [];
function addToCart(productName, price, imageUrl) {
    const quantityInput = event.target.previousElementSibling;
    const quantity = parseInt(quantityInput.value); 

    if (isNaN(quantity) || quantity < 1) {
        alert('Please select a valid quantity.');
        return;
    }

 
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const existingProduct = products.find(item => item.name === productName);

   
    if (existingProduct && existingProduct.stock >= quantity) {
        existingProduct.stock -= quantity; 
        localStorage.setItem('products', JSON.stringify(products)); 

        
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingCartProduct = cart.find(item => item.name === productName);

        if (existingCartProduct) {
            existingCartProduct.quantity += quantity; 
        } else {
            cart.push({ name: productName, price, quantity, imageUrl }); 
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        
        updateProductStockDisplay(productName, existingProduct.stock);

        alert(`Added ${quantity} of ${productName} to cart at $${price} each.`);
    } else {
        alert('Not enough stock available.');
    }
}

function updateProductStockDisplay(productName, newStock) {
    const productElements = document.querySelectorAll('.product');
    productElements.forEach(productElement => {
        const nameElement = productElement.querySelector('h2');
        const stockElement = productElement.querySelector('p.stock');
        if (nameElement.textContent === productName) {
            stockElement.textContent = `Stock: ${newStock}`;
        }
    });
}

function showPage(page) {
    document.getElementById('product-list').style.display = page === 'product-list' ? 'block' : 'none';
    document.getElementById('cart').style.display = page === 'cart' ? 'block' : 'none';
    if (page === 'cart') {
        displayCartItems();
    }
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div>Your cart is empty.</div>';
        return;
    }
    cart.forEach(item => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-image">
                <div>${item.name}</div>
                <div>$${item.price.toFixed(2)}</div>
                <div>${item.quantity}</div>
            </div>
        `;
    });
    updateTotalAmount();
}

function updateTotalAmount() {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = document.getElementById('shipping').value === 'express' ? 10 : 0;
    total += shippingCost;
    document.getElementById('total-amount').textContent = total.toFixed(2);
}

function showCheckoutForm() {
    document.getElementById('checkout-modal').style.display = 'block';
    displayReviewProducts();
    updateTotalAmount();
}

function displayReviewProducts() {
    const reviewContainer = document.getElementById('review-products');
    reviewContainer.innerHTML = '';
    cart.forEach(item => {
        reviewContainer.innerHTML += `${item.quantity} x ${item.name} - $${(item.price * item.quantity).toFixed(2)}<br>`;
    });
}



function placeOrder() {
    const address = document.getElementById('address').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const totalAmount = document.getElementById('total-amount').textContent;
    clearErrorMessages();

    let isValid = true;

    if (address === '') {
        isValid = false;
        showError('address', 'Address is required.');
    }

    if (phone === '') {
        isValid = false;
        showError('phone', 'Phone number is required.');
    }

    if (isValid) {
     
        const order = {
            id: Date.now(),
            items: cart,
            address: address,
            phone: phone,
            totalAmount: totalAmount
        };

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);

        localStorage.setItem('orders', JSON.stringify(orders));

        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        cart.length = 0;
        showPage('products');
        closeModal();
    }
}

function closeModal() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('div');
    error.style.color = 'red';
    error.textContent = message;
    field.parentNode.insertBefore(error, field.nextSibling);
}

function clearErrorMessages() {
    const errors = document.querySelectorAll('.checkout-form div.error-message');
    errors.forEach(error => error.remove());
}

window.onload = function() {
    if (document.getElementById('cart').style.display === 'block') {
        displayCartItems();
    }
};
 

   
document.addEventListener('DOMContentLoaded', function () {
    const productList = document.getElementById('product-list');
    const products = JSON.parse(localStorage.getItem('products')) || [];

    if (products.length === 0) {
        productList.innerHTML = '<p>No products available.</p>';
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}">
            <p>Category: ${product.category}</p>
            <p class="product-price">Price: $${product.price.toFixed(2)}</p>
            <p>Description: ${product.description}</p>
            <p class="stock">Stock: ${product.stock}</p>
            <input type="number" min="1" value="1" class="quantity-input" />
            <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
             <button class="add-to-favorites" onclick="addToFavorites('${product.name}', ${product.price}, '${product.image}')">
                  <i class="fa-solid fa-heart"></i>
              </button>
        `;
        productList.appendChild(productDiv);
    });
});
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];


function addToFavorites(name, price, image) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const item = { name, price, image };
    
     const itemExists=favorites.some(favItem=>favItem.name===item.name
    );
    
    if (!itemExists) {
        favorites.push(item);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Item added to favorites!');
    } else {
        alert('Item is already in favorites.');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    function updateFavoritesUI() {
        const favoritesContainer = document.getElementById('favorite-items'); 
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesContainer.innerHTML = '';

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>No favorites added yet.</p>';
            return;
        }

        favorites.forEach((item, index) => {
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('row');

            favoriteItem.innerHTML = `
            <div class="product-card">
            <div class="product">
                <h2>${item.name}</h2>
                <p class="product-price">Price: $${item.price}</p>
                <img src="${item.image}" alt="${item.name}" width="100">
                <button class="remove-button" data-index="${index}">x</button>
                </div>
                </div>
            `;

            favoritesContainer.appendChild(favoriteItem);
        });
        document.querySelectorAll('.remove-button').forEach((button) => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                removeFromFavorites(index);
            });
        });
    }
    function removeFromFavorites(index) {
        favorites.splice(index, 1); 
        localStorage.setItem('favorites', JSON.stringify(favorites)); 
        updateFavoritesUI(); 
    }
    
    // Call the function to display favorites
    updateFavoritesUI();
});

