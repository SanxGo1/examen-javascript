import './product-card.js';

export class ProductList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._products = [];
  }

  set products(val) {
    this._products = val;
    this.render();
  }

  get products() {
    return this._products;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        .empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 50px;
          color: #64748b;
          font-size: 1.05rem;
          background: white;
          border-radius: 16px;
          border: 2px dashed #e2e8f0;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
      </style>
      <div class="grid" id="grid-container">
        ${
          this._products.length === 0
            ? `<div class="empty">✨ No se encontraron productos con los filtros combinados seleccionados.</div>`
            : ''
        }
      </div>
    `;

    if (this._products.length > 0) {
      const grid = this.shadowRoot.getElementById('grid-container');
      this._products.forEach(p => {
        const card = document.createElement('product-card');
        card.product = p;
        grid.appendChild(card);
      });
    }
  }
}

customElements.define('product-list', ProductList);
