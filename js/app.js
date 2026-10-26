import { createProductCard } from './product-card.js';
import { fetchProducts } from './api.js';
import { Cart } from './cart.js';

export function renderProductList(container, products, onAddToCart) {
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="no-products">No se encontraron productos disponibles.</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'product-grid';

    products.forEach((product) => {
        const card = createProductCard(product, onAddToCart);
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

export function renderShoppingCart(container, cart, onUpdateQty, onRemoveItem, onCheckout) {
    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'cart-header';
    header.innerHTML = `<h2>Tu Carrito</h2><span class="cart-count">${cart.getTotalItems()} items</span>`;
    container.appendChild(header);

    if (!cart || !cart.items || cart.items.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'cart-empty';
        emptyMsg.textContent = 'El carrito está vacío.';
        container.appendChild(emptyMsg);
        return;
    }

    const list = document.createElement('div');
    list.className = 'cart-items-list';

    cart.items.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${escapeHTML(item.product.name)}</h4>
                <span class="cart-item-price">$${Number(item.product.price).toFixed(2)} c/u</span>
            </div>
            <div class="cart-item-actions">
                <button class="btn-qty-minus" data-id="${escapeHTML(item.product.id)}">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="btn-qty-plus" data-id="${escapeHTML(item.product.id)}">+</button>
                <button class="btn-remove" data-id="${escapeHTML(item.product.id)}">🗑️</button>
            </div>
        `;

        itemEl.querySelector('.btn-qty-minus').addEventListener('click', () => {
            onUpdateQty(item.product.id, item.quantity - 1);
        });

        itemEl.querySelector('.btn-qty-plus').addEventListener('click', () => {
            onUpdateQty(item.product.id, item.quantity + 1);
        });

        itemEl.querySelector('.btn-remove').addEventListener('click', () => {
            onRemoveItem(item.product.id);
        });

        list.appendChild(itemEl);
    });

    container.appendChild(list);

    const footer = document.createElement('div');
    footer.className = 'cart-footer';
    footer.innerHTML = `
        <div class="cart-total">
            <span>Total:</span>
            <strong>$${cart.getTotalPrice().toFixed(2)}</strong>
        </div>
        <button class="btn-checkout">Finalizar Compra</button>
    `;

    footer.querySelector('.btn-checkout').addEventListener('click', () => {
        onCheckout();
    });

    container.appendChild(footer);
}

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', async () => {
    const productContainer = document.getElementById('product-catalog');
    const cartContainer = document.getElementById('shopping-cart');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartBadge = document.getElementById('cart-badge');

    if (!productContainer || !cartContainer || !searchInput || !categoryFilter || !cartToggleBtn || !cartSidebar || !closeCartBtn || !cartBadge) {
        return;
    }

    let allProducts = [];

    const cart = new Cart((updatedCart) => {
        updateCartUI(updatedCart);
    });

    try {
        productContainer.innerHTML = '<p class="loading">Cargando catálogo...</p>';
        allProducts = await fetchProducts();
        populateCategories(allProducts);
        renderProductList(productContainer, allProducts, (product) => {
            cart.addItem(product);
            showNotification(`Se agregó "${product.name}" al carrito.`);
        });
    } catch (error) {
        productContainer.innerHTML = `<p class="error">Error al cargar productos: ${escapeHTML(error.message)}</p>`;
    }

    updateCartUI(cart);

    cartToggleBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    searchInput.addEventListener('input', filterAndRenderProducts);
    categoryFilter.addEventListener('change', filterAndRenderProducts);

    function filterAndRenderProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

        const filtered = allProducts.filter((product) => {
            const productName = (product.name || '').toLowerCase();
            const productDescription = (product.description || '').toLowerCase();
            const matchesSearch = productName.includes(searchTerm) || productDescription.includes(searchTerm);
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        renderProductList(productContainer, filtered, (product) => {
            cart.addItem(product);
            showNotification(`Se agregó "${product.name}" al carrito.`);
        });
    }

    function populateCategories(products) {
        const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
        categories.forEach((cat) => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }

    function updateCartUI(currentCart) {
        renderShoppingCart(
            cartContainer,
            currentCart,
            (id, qty) => currentCart.updateQuantity(id, qty),
            (id) => currentCart.removeItem(id),
            () => {
                if (currentCart.items.length === 0) return;
                alert('¡Compra realizada con éxito! Gracias por usar TecnoStock.');
                currentCart.clear();
                cartSidebar.classList.remove('open');
            }
        );

        const totalItems = currentCart.getTotalItems();
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }

    function showNotification(message) {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.remove();
        }, 3000);
    }
});