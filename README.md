# CampusShop - Examen JavaScript Avanzado (Web Components & Pastel UI)

Proyecto rediseñado profesionalmente para cumplir con todos los requerimientos de la evaluación de JavaScript, incorporando una **interfaz moderna de diseño exclusivo con paleta de colores pasteles**, un **panel de selección avanzada de precios y filtros combinables**, y un catálogo ampliado de **12 productos**.

## Estructura del Proyecto
```text
examen-javascript/
│
├── catalogo.html
├── README.md
├── css/
│   └── styles.css
├── datos/
│   └── products.json
└── js/
    ├── api.js
    ├── storage.js
    ├── cart.js
    ├── app.js
    └── componentes/
        ├── product-card.js
        ├── product-list.js
        └── shopping-cart.js
```

## Características y Mejoras Implementadas
1. **Diseño Visual Único (Pastel Theme)**: Interfaz sofisticada con tonos cremas, lavandas, mentas y rosas suaves, tarjetas con efectos de elevación y diseño responsivo de alta gama.
2. **Panel de Filtros Avanzado y Combinable**: Búsqueda por texto, selector de categoría, **filtro deslizante de precio máximo en tiempo real**, checkbox de disponibilidad y ordenamiento dinámico. Todo se combina perfectamente.
3. **Catálogo de 12 Productos**: Productos variados con categorías tecnológicas y de oficina, incluyendo elementos para probar fácilmente la regla de descuento automático.
4. **Control de Inventario y Carrito Robusto**: Prevención de IDs negativos/duplicados, límites de stock estrictos (P07, P08), persistencia segura en `LocalStorage` con recuperación ante corrupción (P14).
5. **Sistema de Descuentos**: Aplicación automática del **10% de descuento** cuando el subtotal alcanza o supera los **$300.000** (P10).
6. **Arquitectura Modular**: Implementación completa con Web Components (Shadow DOM) y Custom Events desacoplados (P15).
