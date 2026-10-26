export function createProductCard(product, onAddToCart) {
    product = product && typeof product === 'object' ? product : {};
    const card = document.createElement('div');
    card.className = 'product-card';

    const parsedStock = Number(product.stock);
    const stock = Number.isFinite(parsedStock) ? Math.max(0, parsedStock) : 0;
    const parsedPrice = Number(product.price);
    const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;

    card.innerHTML = `
        <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" class="product-img" onerror="this.src='https://via.placeholder.com/300?text=TecnoStock'">
        <div class="product-info">
            <span class="product-category">${escapeHTML(product.category)}</span>
            <h3 class="product-title">${escapeHTML(product.name)}</h3>
            <p class="product-desc">${escapeHTML(product.description)}</p>
            <div class="product-footer">
                <span class="product-price">$${price.toFixed(2)}</span>
                <span class="product-stock ${stock === 0 ? 'out-of-stock' : ''}">Stock: ${stock}</span>
            </div>
            <button class="btn-add" ${stock === 0 ? 'disabled' : ''}>
                ${stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
            </button>
        </div>
    `;

    const btn = card.querySelector('.btn-add');
    if (stock > 0 && typeof onAddToCart === 'function') {
        btn.addEventListener('click', () => {
            onAddToCart(product);
        });
    }

    return card;
}

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}