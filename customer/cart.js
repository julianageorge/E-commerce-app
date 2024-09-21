const cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(event, productName, price, imageUrl) {
    
    event.preventDefault();
    
    const quantityInput = event.target.previousElementSibling;
    const quantity = parseInt(quantityInput.value);

    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ name: productName, price, quantity, imageUrl });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Added ${quantity} of ${productName} to cart at $${price} each.`);
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div>Your cart is empty.</div>';
        return;
    }
    cart.forEach((item, index) => {
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.imageUrl}" alt="${item.name}" class="cart-image">
                <div>${item.name}</div>
                <div>$${item.price.toFixed(2)}</div>
                <div>${item.quantity}</div>
                <button onclick="removeFromCart(${index})">Remove</button>
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
            totalAmount: totalAmount,
            orderDate: new Date().toLocaleString(), 
            status: 'Pending',
        };

        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);

        localStorage.setItem('orders', JSON.stringify(orders));

        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        cart.length = 0;
        displayCartItems();
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

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

window.onload = function() {
    displayCartItems(); 
};
