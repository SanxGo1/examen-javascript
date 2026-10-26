import { fetchProducts } from '.api.js';
import { Cart } from '.cart.js';
import { renderProductList } from 'components/product-list.js';
import { renderShoppingCart } from '.componentes/shopping-cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    const productContainer = document.getElementById('product-catalog');
    const cartContainer = document.getElementById('shopping-cart');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartBadge = document.getElementById('cart-badge');

    let allProducts = [];

    // Inicializar Carrito
    const cart = new Cart((updatedCart) => {
        updateCartUI(updatedCart);
    });

    // Cargar productos desde la API
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

    // Renderizado inicial del carrito
    updateCartUI(cart);

    // Eventos del Sidebar del Carrito
    cartToggleBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Eventos de Búsqueda y Fil
    searchInput.addEventListener('input', filterAndRenderProducts);
    categoryFilter.addEventListener('change', filterAndRenderProducts);

    function filterAndRenderProducts() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;

        const filtered = allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm)
                || product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory
                || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        renderProductList(productContainer, filtered, (product) => {
            cart.addItem(product);
            showNotification(`Se agregó "${product.name}" al carrito.`);
        });
    }

    function populateCategories(products) {
        const categories = [...new Set(products.map(p => p.category))];
        categories.forEach(cat => {
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

    function escapeHTML(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
});