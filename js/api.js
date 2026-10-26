export async function fetchProducts() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error('El formato del catálogo no es válido.');
        }

        // Filtramos solo los productos activos (maneja booleanos o strings "verdadero")
        const activeItems = data.filter(item => 
            item.active === true || item.activo === true || item.activo === 'verdadero'
        );

        return activeItems.map(item => {
            const id = item.id;
            const name = item.name || item.nombre;
            const price = Number(item.price ?? item.precio);
            const stock = Number(item.stock);

            if (typeof id !== 'string' && typeof id !== 'number') throw new Error('ID de producto inválido');
            if (typeof name !== 'string') throw new Error('Nombre de producto inválido');
            if (isNaN(price) || price < 0) throw new Error('Precio de producto inválido');
            if (isNaN(stock) || stock < 0) throw new Error('Stock de producto inválido');

            return {
                id: String(id),
                name: name,
                price: price,
                stock: stock,
                category: String(item.category || item.categoría || 'General'),
                image: String(item.image || ''),
                description: String(item.description || item.descripción || '')
            };
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        throw error;
    }
}