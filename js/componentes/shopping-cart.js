export class ShoppingCartComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._items = [];
    this._totals = { subtotal: 0, appliesDiscount: false, discount: 0, total: 0 };
  }

  setData(items, totals) {
    this._items = items;
    this._totals = totals;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const { items, _totals } = this;

    this.shadowRoot.innerHTML = `
      <style>
        .cart-container {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 25px -5px rgba(129, 140, 248, 0.08);
          display: flex;
          flex-direction: column;
          height: fit-content;
          position: sticky;
          top: 24px;
          border: 1px solid #e2e8f0;
        }
        h2 {
          font-size: 1.25rem;
          color: #1e293b;
          margin-bottom: 16px;
          border-bottom: 2px solid #e0e7ff;
          padding-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cart-items {
          max-height: 340px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
          padding-right: 4px;
        }
        .cart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          gap: 10px;
        }
        .item-info {
          flex-grow: 1;
        }
        .item-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 2px;
        }
        .item-price {
          font-size: 0.8rem;
          color: #64748b;
        }
        .controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        input[type="number"] {
          width: 50px;
          padding: 6px;
          text-align: center;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.85rem;
          background: white;
          outline: none;
        }
        .btn-icon {
          background: #fee2e2;
          color: #991b1b;
          border: none;
          padding: 7px 9px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background: #fecaca;
        }
        .summary {
          border-top: 1px solid #e2e8f0;
          padding-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 0.95rem;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          color: #475569;
        }
        .summary-row.discount {
          color: #065f46;
          font-weight: 700;
          background: #d1fae5;
          padding: 6px 10px;
          border-radius: 8px;
        }
        .summary-row.total {
          font-size: 1.2rem;
          font-weight: 800;
          color: #1e293b;
          margin-top: 4px;
          border-top: 2px dashed #cbd5e1;
          padding-top: 10px;
        }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }
        .btn {
          flex: 1;
          padding: 11px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .btn-primary {
          background: #818cf8;
          color: white;
          box-shadow: 0 4px 6px rgba(129, 140, 248, 0.2);
        }
        .btn-primary:hover:not(:disabled) {
          background: #6366f1;
        }
        .btn-secondary {
          background: #f1f5f9;
          color: #475569;
        }
        .btn-secondary:hover:not(:disabled) {
          background: #e2e8f0;
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
        .empty-cart {
          text-align: center;
          color: #94a3b8;
          padding: 30px 0;
          font-size: 0.95rem;
        }
        .discount-hint {
          font-size: 0.8rem;
          color: #0d9488;
          background: #ccfbf1;
          padding: 6px 10px;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
        }
      </style>
      <div class="cart-container">
        <h2>🛍️ Carrito de Compras</h2>
        <div class="cart-items" id="items-list">
          ${
            this._items.length === 0
              ? `<div class="empty-cart">El carrito está vacío</div>`
              : this._items.map(item => `
                <div class="cart-item">
                  <div class="item-info">
                    <div class="item-name">${item.nombre}</div>
                    <div class="item-price">$${item.precio.toLocaleString('es-CO')} c/u</div>
                  </div>
                  <div class="controls">
                    <input type="number" min="1" max="${item.stock}" value="${item.cantidad}" data-id="${item.id}" class="qty-input">
                    <button class="btn-icon delete-btn" data-id="${item.id}" title="Eliminar">🗑️</button>
                  </div>
                </div>
              `).join('')
          }
        </div>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${_totals.subtotal.toLocaleString('es-CO')}</span>
          </div>
          ${
            _totals.appliesDiscount
              ? `<div class="summary-row discount">
                  <span>🎉 Descuento (10%):</span>
                  <span>-$${_totals.discount.toLocaleString('es-CO')}</span>
                </div>`
              : `<div class="discount-hint">
                  💡 ¡Faltan $${(300000 - _totals.subtotal).toLocaleString('es-CO')} para obtener un 10% de descuento!
                </div>`
          }
          <div class="summary-row total">
            <span>Total:</span>
            <span>$${_totals.total.toLocaleString('es-CO')}</span>
          </div>
        </div>

        <div class="actions">
          <button class="btn btn-secondary" id="clear-btn" ${this._items.length === 0 ? 'disabled' : ''}>Vaciar</button>
          <button class="btn btn-primary" id="checkout-btn" ${this._items.length === 0 ? 'disabled' : ''}>Confirmar</button>
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const id = Number(e.target.dataset.id);
        const qty = parseInt(e.target.value, 10);
        this.dispatchEvent(new CustomEvent('update-cart-qty', {
          detail: { id, quantity: qty },
          bubbles: true,
          composed: true
        }));
      });
    });

    this.shadowRoot.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(e.currentTarget.dataset.id);
        this.dispatchEvent(new CustomEvent('remove-cart-item', {
          detail: { id },
          bubbles: true,
          composed: true
        }));
      });
    });

    const clearBtn = this.shadowRoot.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('clear-cart', {
          bubbles: true,
          composed: true
        }));
      });
    }

    const checkoutBtn = this.shadowRoot.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('checkout-cart', {
          detail: { totals: this._totals, items: this._items },
          bubbles: true,
          composed: true
        }));
      });
    }
  }
}

customElements.define('shopping-cart', ShoppingCartComponent);
