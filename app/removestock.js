import { useEffect, useState } from "react";

function Removestock({ onClose }) {
    const [selectedProductName, setSelectedProductName] = useState('');
    const [products, setProducts] = useState([]);
    const [btnLoading, setBtnLoading] = useState(false);
    const [removeStockModal, setRemoveStockModal] = useState(false);
    const [negativeStockError, setNegativeStockError] = useState(false);
    const [stockQuantity, setStockQuantity] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/products");
                const productData = await response.json();
                setProducts(productData.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleProductSelect = (e) => {
        setSelectedProductName(e.target.value);
    };

    const removeStock = async () => {
        setBtnLoading(true);
        setNegativeStockError(false);
        if (!selectedProductName || stockQuantity <= 0) {
            setNegativeStockError(true); // Set the error state to true
            setBtnLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/products?name=${selectedProductName}`);
            const productData = await response.json();

            if (productData.products.length === 0) {
                setBtnLoading(false);
                console.error('Product not found');
                return;
            }

            const selectedIndex = productData.products.findIndex((product) => product.name === selectedProductName);

            if (selectedIndex === -1) {
                setBtnLoading(false);
                console.error('Product not found');
                return;
            }

            const currentProduct = productData.products[selectedIndex];


            const stockData = {
                name: currentProduct.name,
                stockQuantity: parseInt(stockQuantity, 10),
                date: new Date(currentDate),
            };



            const removeStockResponse = await fetch('/api/remove-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stockData),
            });

            if (removeStockResponse.ok) {
                console.log('Stock removed successfully');
                window.location.reload();
                // Update the stock quantity in your local state (if using React)
                const updatedProducts = [...products];
                updatedProducts[selectedIndex].quantity -= stockData.stockQuantity;
                setProducts(updatedProducts);
                onClose();
                setRemoveStockModal(false);
                setBtnLoading(false);
                setSelectedProductName('');
                setStockQuantity('');
                setCurrentDate('');
            } else {
                console.error('Error removing stock');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    function rohan() {
        onClose();
    }
    return (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-[50rem] my-6 max-w-3xl">

                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-3xl font-semibold">Remove Stock</h3>
                            <button
                                className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={rohan}
                            >
                                <span className="text-black h-6 w-6 text-2xl block">X</span>
                            </button>
                        </div>

                        <main className="relative p-6 flex justify-between">
                            <div className="my-4 text-blueGray-500 text-lg leading-relaxed w-[50rem]">
                                <form>
                                    <div className="mb-4">
                                        <label htmlFor="productName" className="block mb-2">
                                            Select a Product to Remove Stock
                                        </label>
                                        <select
                                            value={selectedProductName}
                                            name="selectedProductName"
                                            onChange={handleProductSelect}
                                            className="w-full border border-gray-300 px-4 py-2"
                                        >
                                            <option value="">Select a product</option>
                                            {products.map((product) => (
                                                <option key={product._id} value={product.name}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {selectedProductName && (
                                        <>
                                            <div className="mb-4">
                                                <label htmlFor="quantity" className="block mb-2">
                                                    Quantity to Remove
                                                </label>
                                                {negativeStockError && (
                                                    <p className="text-red-500">Please enter a valid quantity to remove.</p>
                                                )}
                                                <input
                                                    value={stockQuantity}
                                                    name="quantity"
                                                    min="1"
                                                    onChange={(e) => setStockQuantity(e.target.value)}
                                                    type="number"
                                                    id="quantity"
                                                    className="w-full border border-gray-300 px-4 py-2"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="date" className="block mb-2">
                                                    Date
                                                </label>
                                                <input
                                                    value={currentDate}
                                                    type="date"
                                                    onChange={(e) => setCurrentDate(e.target.value)}
                                                    id="date"
                                                    className="w-full border border-gray-300 px-4 py-2"
                                                />
                                            </div>

                                        </>
                                    )}
                                </form>
                            </div>
                        </main>

                        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={rohan}
                            >
                                Close
                            </button>
                            <button onClick={removeStock}
                                disabled={btnLoading}
                                className="disabled:opacity-10 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold mr-2"
                            >
                                Remove Stock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

        </>
    );
}

export default Removestock;