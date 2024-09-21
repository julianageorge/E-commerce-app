function displayOrderHistory() {
    const orderHistoryContainer = document.getElementById('order-history-items');
    const orders = JSON.parse(localStorage.getItem('orders')) || []; 
    orderHistoryContainer.innerHTML = '';

    if (orders.length === 0) {
        orderHistoryContainer.innerHTML = '<div>No orders found.</div>';
        return;
    }

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <img src="${order.items[0]?.imageUrl}" alt="${order.items[0]?.name}" class="order-image">
            <div>Order ID: ${order.id}</div>
            <div>Date: ${order.orderDate}</div>
            <div>Status: <span id="status-${order.id}">${order.status}</span></div>
            <h4>Items:</h4>
            <ul>
                ${order.items.map(item => `
                    <li>
                        <div>Product: ${item.name}</div>
                        <div>Price: $${item.price.toFixed(2)}</div>
                        <div>Quantity: ${item.quantity}</div>
                    </li>`).join('')}
            </ul>
        `;
        orderHistoryContainer.appendChild(orderDiv);
    });
}

// Call the function to display the order history
displayOrderHistory();
