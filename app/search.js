// search.js
export async function searchProducts(searchTerm) {
    try {
        const response = await fetch(`/api/products?search=${searchTerm}`);
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
}
