import { fetchProducts } from './api.js';
import { ShoppingCartManager } from './cart.js';
import './componentes/product-list.js';
import './componentes/shopping-cart.js';

class App {
  async init() {
    this.products = [];
    this.maxPriceGlobal = 1000000;
    this.cartManager = new ShoppingCartManager();

    this.initUI();
    await this.loadData();
    this.setupEventListeners();
  }

  initUI() {
    const container = document.getElementById('app');
    container.innerHTML = `
      <header>
        <h1>✨ CampusShop Pastel & Tech ✨</h1>
        <p>Catálogo interactivo con Web Components, Filtros Combinables y Descuentos Automáticos</p>
      </header>

      <div class="error-banner" id="error-banner"></div>

      <div class="main-container">
        <section class="catalog-section">
          <!-- Advanced Selection Panel -->
          <div class="filters-panel">
            <div class="filters-title">
              <span>🎛️ Panel de Selección y Filtros Combinados</span>
            </div>
            <div class="filters-grid">
              <div class="filter-group">
                <label for="search-input">Buscar producto</label>
                <input type="text" id="search-input" placeholder="Ej. Teclado, Monitor...">
              </div>
              <div class="filter-group">
                <label for="category-select">Categoría</label>
                <select id="category-select">
                  <option value="">Todas las categorías</option>
                </select>
              </div>
              <div class="filter-group">
                <label for="sort-select">Ordenar por precio</label>
                <select id="sort-select">
                  <option value="">Sin orden específico</option>
                  <option value="asc">Menor a Mayor precio</option>
                  <option value="desc">Mayor a Menor precio</option>
                </select>
              </div>
              <div class="filter-group">
                <div class="price-slider-container">
                  <label for="price-range">Precio Máximo: <span id="price-val-label">$1.000.000</span></label>
                  <input type="range" id="price-range" min="0" max="1000000" step="10000" value="1000000">
                </div>
                <div class="checkbox-group">
                  <input type="checkbox" id="availability-filter">
                  <span>Mostrar solo productos con stock disponible</span>
                </div>
              </div>
            </div>
          </div>

          <product-list id="product-list-comp"></product-list>
        </section>

        <aside>
          <shopping-cart id="shopping-cart-comp"></shopping-cart>
        </aside>
      </div>
    `;

    this.updateCartUI();
  }

  async loadData() {
    const errorBanner = document.getElementById('error-banner');
    try {
      this.products = await fetchProducts();
      errorBanner.style.display = 'none';

      // Calcular precio máximo real del JSON para ajustar el slider
      if (this.products.length > 0) {
        const prices = this.products.map(p => p.precio);
        this.maxPriceGlobal = Math.max(...prices);
        const priceRange = document.getElementById('price-range');
        priceRange.max = this.maxPriceGlobal;
        priceRange.value = this.maxPriceGlobal;
        document.getElementById('price-val-label').textContent = '$' + this.maxPriceGlobal.toLocaleString('es-CO');
      }

      this.populateCategories();
      this.filterAndRenderProducts();
    } catch (error) {
      errorBanner.textContent = error.message;
      errorBanner.style.display = 'block';
      this.products = [];
      this.filterAndRenderProducts();
    }
  }

  populateCategories() {
    const categorySelect = document.getElementById('category-select');
    const categories = [...new Set(this.products.map(p => p.categoria))];
    
    categorySelect.innerHTML = `<option value="">Todas las categorías</option>` +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  filterAndRenderProducts() {
    const searchVal = document.getElementById('search-input').value.toLowerCase().trim();
    const categoryVal = document.getElementById('category-select').value;
    const maxPriceVal = Number(document.getElementById('price-range').value);
    const onlyAvailable = document.getElementById('availability-filter').checked;
    const sortVal = document.getElementById('sort-select').value;

    // Actualizar etiqueta visual del precio deslizante
    document.getElementById('price-val-label').textContent = '$' + maxPriceVal.toLocaleString('es-CO');

    let filtered = this.products.filter(p => {
      const matchSearch = p.nombre.toLowerCase().includes(searchVal);
      const matchCategory = !categoryVal || p.categoria === categoryVal;
      const matchPrice = p.precio <= maxPriceVal;
      const matchAvailability = !onlyAvailable || (p.activo && p.stock > 0);
      return matchSearch && matchCategory && matchPrice && matchAvailability;
    });

    if (sortVal === 'asc') {
      filtered.sort((a, b) => a.precio - b.precio);
    } else if (sortVal === 'desc') {
      filtered.sort((a, b) => b.precio - a.precio);
    }

    const productListComp = document.getElementById('product-list-comp');
    productListComp.products = filtered;
  }

  updateCartUI() {
    const cartComp = document.getElementById('shopping-cart-comp');
    if (cartComp) {
      cartComp.setData(this.cartManager.getItems(), this.cartManager.calculateTotals());
    }
  }

  setupEventListeners() {
    document.getElementById('search-input').addEventListener('input', () => this.filterAndRenderProducts());
    document.getElementById('category-select').addEventListener('change', () => this.filterAndRenderProducts());
    document.getElementById('price-range').addEventListener('input', () => this.filterAndRenderProducts());
    document.getElementById('availability-filter').addEventListener('change', () => this.filterAndRenderProducts());
    document.getElementById('sort-select').addEventListener('change', () => this.filterAndRenderProducts());

    document.addEventListener('add-to-cart', (e) => {
      try {
        this.cartManager.addItem(e.detail, 1);
        this.updateCartUI();
      } catch (err) {
        alert(err.message);
      }
    });

    document.addEventListener('update-cart-qty', (e) => {
      try {
        const { id, quantity } = e.detail;
        this.cartManager.updateQuantity(id, quantity);
        this.updateCartUI();
      } catch (err) {
        alert(err.message);
        this.updateCartUI();
      }
    });

    document.addEventListener('remove-cart-item', (e) => {
      const { id } = e.detail;
      this.cartManager.removeItem(id);
      this.updateCartUI();
    });

    document.addEventListener('clear-cart', () => {
      this.cartManager.clear();
      this.updateCartUI();
    });

    document.addEventListener('checkout-cart', (e) => {
      const { totals, items } = e.detail;
      if (items.length === 0) {
        alert("El carrito está vacío. No se puede confirmar la compra (P16).");
        return;
      }
      const orderId = 'ORD-PASTEL-' + Math.floor(100000 + Math.random() * 900000);
      alert(`🎉 ¡Compra confirmada con éxito!
ID de Pedido: ${orderId}
Total pagado: $${totals.total.toLocaleString('es-CO')}`);
      this.cartManager.clear();
      this.updateCartUI();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
