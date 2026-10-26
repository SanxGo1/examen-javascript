export async function fetchProducts() {
    try {
        const response = await fetch('./data/products.json');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();

        // Validación estricta de datos recibidos de la API
        if (!Array.isArray(data)) {
            throw new Error('El formato del catálogo no es válido.');
        }

        return data.map(item => {
            if (typeof item.id !== 'string' && typeof item.id !== 'number') throw new Error('ID de producto inválido');
            if (typeof item.name !== 'string') throw new Error('Nombre de producto inválido');
            if (typeof item.price !== 'number' || item.price < 0) throw new Error('Precio de producto inválido');
            if (typeof item.stock !== 'number' || item.stock < 0) throw new Error('Stock de producto inválido');

            return {
                id: String(item.id),
                name: item.name,
                price: Number(item.price),
                stock: Number(item.stock),
                category: String(item.category || 'General'),
                image: String(item.image || ''),
                description: String(item.description || '')
            };
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        throw error;
    }
}