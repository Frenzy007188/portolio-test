document.addEventListener('DOMContentLoaded', () => {
    // Mock product data based on Cindy's Beauty products
    const products = [
        { id: 1, name: "GlowClean Brush - Mint", category: "brushes", price: 19.99, image: "5.jpg.jpg", rating: 4, badge: "24% OFF" },
        { id: 2, name: "GlowClean Brush - Pink", category: "brushes", price: 19.99, image: "pink.jpg", rating: 5, badge: "SALE" },
        { id: 3, name: "GlowClean Brush - Yellow", category: "brushes", price: 19.99, image: "pencil.jpg", rating: 4 },
        { id: 4, name: "GlowClean Brush - Teal", category: "brushes", price: 19.99, image: "red&pink.jpg", rating: 5, badge: "NEW" },
        { id: 5, name: "Lip Shine - Clear Gloss", category: "lipgloss", price: 14.99, image: "brush.jpg", rating: 4, badge: "SALE" },
        { id: 6, name: "Lip Shine - Pink Gloss", category: "lipgloss", price: 14.99, image: "5.jpg", rating: 5 },
        { id: 7, name: "Lip Shine - Nude Gloss", category: "lipgloss", price: 14.99, image: "pencil.jpg", rating: 4 },
        { id: 8, name: "Lip Shine - Deep Nude", category: "lipgloss", price: 14.99, image: "pink.jpg", rating: 5, badge: "SALE" }
    ];

    const bestSellers = [
        { id: 9, name: "GlowClean Brush - Pink", category: "brushes", price: 19.99, image: "pencil.jpg", rating: 5 },
        { id: 10, name: "Lip Shine - Pink Gloss", category: "lipgloss", price: 14.99, image: "pink.jpg", rating: 5, badge: "SALE" },
        { id: 11, name: "Lip Shine - Clear Gloss", category: "lipgloss", price: 14.99, image: "5.jpg", rating: 4 },
        { id: 12, name: "GlowClean Brush - Teal", category: "brushes", price: 19.99, image: "red&pink.jpg", rating: 5 }
    ];

    let cart = [];

    // DOM Elements
    const productGrid = document.getElementById('product-grid');
    const bestSellersGrid = document.getElementById('best-sellers-grid');
    const categoryLinks = document.querySelectorAll('.category-list a');
    const cartCount = document.getElementById('cart-count');
    const orderBox = document.getElementById('order-box');
    const orderItemsContainer = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    const closeOrderBox = document.querySelector('.close-order-box');
    const confirmationBox = document.getElementById('confirmation-box');
    const initializeOrderLink = document.getElementById('initialize-order-link');
    const recentPurchase = document.getElementById('recent-purchase');
    const closeRecentPurchase = document.querySelector('.close-recent-purchase');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav ul');
    const contactForm = document.getElementById('contact-form');

    // Display Products
    function displayProducts(productsToDisplay, container) {
        container.innerHTML = '';
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <div class="rating">${'★'.repeat(product.rating)}${'☆'.repeat(5 - product.rating)}</div>
                ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            container.appendChild(productCard);
        });
    }

    // Initial Display
    displayProducts(products, productGrid);
    displayProducts(bestSellers, bestSellersGrid);

    // Filter Products by Category
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            const filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
            displayProducts(filteredProducts, productGrid);
        });
    });

    // Add to Cart
    window.addToCart = (productId) => {
        const product = [...products, ...bestSellers].find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (cartItem.quantity < 100) {
                cartItem.quantity++;
            } else {
                alert('Maximum quantity of 100 reached for this item.');
            }
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateOrderBox();
        orderBox.classList.add('active');
        showRecentPurchase();
    };

    // Update Order Box
    function updateOrderBox() {
        orderItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="order-item-controls">
                    <button onclick="adjustQuantity(${item.id}, -1)">-</button>
                    <input type="number" value="${item.quantity}" readonly>
                    <button onclick="adjustQuantity(${item.id}, 1)">+</button>
                </div>
            `;
            orderItemsContainer.appendChild(orderItem);
        });
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        orderTotal.textContent = total.toFixed(2);
    }

    // Adjust Quantity
    window.adjustQuantity = (productId, change) => {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity += change;
            if (cartItem.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            } else if (cartItem.quantity > 100) {
                cartItem.quantity = 100;
                alert('Maximum quantity of 100 reached for this item.');
            }
            updateOrderBox();
            showConfirmationBox();
        }
    };

    // Show Confirmation Box
    function showConfirmationBox() {
        confirmationBox.classList.remove('active');
        void confirmationBox.offsetWidth; // Trigger reflow to restart animation
        confirmationBox.classList.add('active');
    }

    // Close Order Box
    closeOrderBox.addEventListener('click', () => {
        orderBox.classList.remove('active');
    });

    // Initialize Order Link (Mock API Submission)
    initializeOrderLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const order = {
            items: cart,
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            timestamp: new Date().toISOString()
        };

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(response => response.json())
        .then(data => {
            alert('Order initialized successfully! Order ID: ' + data.id);
            cart = [];
            updateOrderBox();
            orderBox.classList.remove('active');
            confirmationBox.classList.remove('active');
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            alert('There was an error initializing your order. Please try again.');
        });
    });

    // Show Recent Purchase Notification
    function showRecentPurchase() {
        recentPurchase.style.display = 'flex';
        setTimeout(() => {
            recentPurchase.style.display = 'none';
        }, 5000);
    }

    closeRecentPurchase.addEventListener('click', () => {
        recentPurchase.style.display = 'none';
    });

    // Hamburger Menu for Mobile
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Contact Form Submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(() => {
            alert('Message sent successfully!');
            contactForm.reset();
        })
        .catch(error => {
            console.error('Error submitting message:', error);
            alert('There was an error sending your message. Please try again.');
        });
    });
});