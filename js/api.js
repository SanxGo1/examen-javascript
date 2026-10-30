export async function fetchProducts() {
  try {
    const response = await fetch('./datos/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    const seenIds = new Set();
    const validProducts = [];
    
    for (const prod of data) {
      if (prod.id == null || prod.id < 0 || seenIds.has(prod.id)) {
        console.warn(`Producto descartado por ID negativo o duplicado:`, prod);
        continue;
      }
      seenIds.add(prod.id);
      validProducts.push(prod);
    }
    
    return validProducts;
  } catch (error) {
    console.error("Error al cargar el catálogo de productos:", error);
    throw new Error("No se pudo cargar el catálogo de productos. Verifique la conexión o el archivo JSON.");
  }
}
