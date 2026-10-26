import { createProductCard } from './product-card.js';

export function renderProductList(container, products, onAddToCart) {
    container.innerHTML = '';
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="no-products">No se encontraron productos disponibles.</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'product-grid';

    products.forEach(product => {
        const card = createProductCard(product, onAddToCart);
        grid.appendChild(card);
    });

    container.appendChild(grid);
}