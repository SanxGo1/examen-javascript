export function renderShoppingCart(container, cart, onUpdateQty, onRemoveItem, onCheckout) {
    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'cart-header';
    header.innerHTML = `<h2>Tu Carrito</h2><span class="cart-count">${cart.getTotalItems()} items</span>`;
    container.appendChild(header);

    if (cart.items.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.className = 'cart-empty';
        emptyMsg.textContent = 'El carrito está vacío.';
        container.appendChild(emptyMsg);
        return;
    }

    const list = document.createElement('div');
    list.className = 'cart-items-list';

    cart.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${escapeHTML(item.name)}</h4>
                <span class="cart-item-price">$${Number(item.price).toLocaleString('es-CO')} c/u</span>
            </div>
            <div class="cart-item-actions">
                <button class="btn-qty-minus" data-id="${escapeHTML(item.id)}">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button class="btn-qty-plus" data-id="${escapeHTML(item.id)}">+</button>
                <button class="btn-remove" data-id="${escapeHTML(item.id)}">🗑️</button>
            </div>
        `;

        itemEl.querySelector('.btn-qty-minus').addEventListener('click', () => {
            onUpdateQty(item.id, item.quantity - 1);
        });

        itemEl.querySelector('.btn-qty-plus').addEventListener('click', () => {
            onUpdateQty(item.id, item.quantity + 1);
        });

        itemEl.querySelector('.btn-remove').addEventListener('click', () => {
            onRemoveItem(item.id);
        });

        list.appendChild(itemEl);
    });

    container.appendChild(list);

    const footer = document.createElement('div');
    footer.className = 'cart-footer';
    footer.innerHTML = `
        <div class="cart-total">
            <span>Total:</span>
            <strong>$${cart.getTotalPrice().toLocaleString('es-CO')}</strong>
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