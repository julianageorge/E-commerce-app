document.addEventListener('DOMContentLoaded', function () {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let categories = JSON.parse(localStorage.getItem('categories')) || [];

    const productForm = document.getElementById('product-form');
    const categoryForm = document.getElementById('category-form');
    const productTableBody = document.getElementById('product-list').querySelector('tbody');
    const categoryTableBody = document.getElementById('category-list').querySelector('tbody');
    const productCategorySelect = document.getElementById('product-category');

    function loadCategories() {
        categoryTableBody.innerHTML = '';
        productCategorySelect.innerHTML = '<option value="">Select a category</option>';
        categories.forEach(category => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${category.name}</td>
                <td class="actions">
                    <button onclick="editCategory(${category.id})">Edit</button>
                    <button onclick="deleteCategory(${category.id})">Delete</button>
                </td>
            `;
            categoryTableBody.appendChild(tr);

            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            productCategorySelect.appendChild(option);
        });
    }

    function loadProducts() {
        productTableBody.innerHTML = '';
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.name}</td>
                <td><img src="${product.image}" alt="${product.name}" width="50"></td>
                <td>${product.category}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td>${product.stock}</td>
                <td class="actions">
                    <button onclick="editProduct(${product.id})">Edit</button>
                    <button onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });
    }

    function showError(input, message) {
        const errorElement = document.getElementById(`${input.id}-error`);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.classList.add('error');
    }

    function clearError(input) {
        const errorElement = document.getElementById(`${input.id}-error`);
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        input.classList.remove('error');
    }

    function validateProductForm() {
        let isValid = true;

        const name = document.getElementById('product-name');
        const image = document.getElementById('product-image');
        const category = document.getElementById('product-category');
        const price = document.getElementById('product-price');
        const description = document.getElementById('product-description');
        const stock = document.getElementById('product-stock');

        if (!name.value.trim()) {
            showError(name, 'Product name is required.');
            isValid = false;
        } else {
            clearError(name);
        }

        if (!image.value.trim()) {
            showError(image, 'Product image URL is required.');
            isValid = false;
        } else if (!isValidURL(image.value.trim())) {
            showError(image, 'Please enter a valid URL for the image.');
            isValid = false;
        } else {
            clearError(image);
        }

        if (!category.value) {
            showError(category, 'Please select a category.');
            isValid = false;
        } else {
            clearError(category);
        }

        if (isNaN(price.value) || price.value <= 0) {
            showError(price, 'Price must be a positive number.');
            isValid = false;
        } else {
            clearError(price);
        }

        if (!description.value.trim()) {
            showError(description, 'Product description is required.');
            isValid = false;
        } else {
            clearError(description);
        }

        if (isNaN(stock.value) || stock.value < 0) {
            showError(stock, 'Stock quantity must be a non-negative integer.');
            isValid = false;
        } else {
            clearError(stock);
        }

        return isValid;
    }

    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    function validateCategoryForm() {
        const name = document.getElementById('category-name');
        let isValid = true;

        if (!name.value.trim()) {
            showError(name, 'Category name is required.');
            isValid = false;
        } else if (categories.some(category => category.name.toLowerCase() === name.value.trim().toLowerCase())) {
            showError(name, 'Category name must be unique.');
            isValid = false;
        } else {
            clearError(name);
        }

        return isValid;
    }

    productForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateProductForm()) return;

        const id = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value.trim();
        const image = document.getElementById('product-image').value.trim();
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const description = document.getElementById('product-description').value.trim();
        const stock = parseInt(document.getElementById('product-stock').value, 10);

        if (id) {
            const product = products.find(p => p.id == id);
            product.name = name;
            product.image = image;
            product.category = category;
            product.price = price;
            product.description = description;
            product.stock = stock;
        } else {
            const newProduct = {
                id: Date.now(),
                name,
                image,
                category,
                price,
                description,
                stock
            };
            products.push(newProduct);
        }

        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
        productForm.reset();
    });

    categoryForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validateCategoryForm()) return;

        const id = document.getElementById('category-id').value;
        const name = document.getElementById('category-name').value.trim();

        if (id) {
            const category = categories.find(c => c.id == id);
            category.name = name;
        } else {
            const newCategory = {
                id: Date.now(),
                name
            };
            categories.push(newCategory);
        }

        localStorage.setItem('categories', JSON.stringify(categories));
        loadCategories();
        categoryForm.reset();
    });

    window.editProduct = function (id) {
        const product = products.find(p => p.id == id);
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-stock').value = product.stock;
    };

    window.deleteProduct = function (id) {
        products = products.filter(p => p.id != id);
        localStorage.setItem('products', JSON.stringify(products));
        productForm.reset();
        loadProducts();
    };

    window.editCategory = function (id) {
        const category = categories.find(c => c.id == id);
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
    };

    window.deleteCategory = function (id) {
        categories = categories.filter(c => c.id != id);
        localStorage.setItem('categories', JSON.stringify(categories));
        loadCategories();
    };

    loadCategories();
    loadProducts();
});
