import { fetchServerResponse } from "next/dist/client/components/router-reducer/fetch-server-response";
import { useEffect, useState } from "react";

function Addstock({ onClose }) {
    const [selectedProductName, setSelectedProductName] = useState('');
    const [stockmodal, setStockModal] = useState(false);
    const [negativeStockError, setNegativeStockError] = useState(false);
    const [stockQuantity, setStockQuantity] = useState('');
    const [products, setProducts] = useState([]);
    const [btnLoading, setBtnLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // Fetch products when the component mounts
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
    console.log(products);

    const addStock = async () => {
        setBtnLoading(true);
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

            const selectedIndex = productData.products.findIndex(product => product.name === selectedProductName);

            if (selectedIndex === -1) {
                setBtnLoading(false);
                console.error('Product not found');
                return;
            }

            const currentProduct = productData.products[selectedIndex];
            console.log(currentProduct);

            const stockData = {
                name: currentProduct.name,
                stockQuantity: parseInt(stockQuantity, 10),
                date: new Date(currentDate),
                type: "ADD",
            };
            console.log("after", stockData);


            /* const storeStockResponse = await fetch('/api/store-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stockData),
            });

            setSelectedProductName('');
            setStockQuantity('');
            setCurrentDate('');

            if (storeStockResponse.ok) {
                console.log('Stock added successfully');
                const updatedProducts = [...products];
                updatedProducts[selectedIndex].quantity += stockData.stockQuantity;
                setProducts(updatedProducts);
                console.log(updatedProducts);
                onClose();
                setBtnLoading(false);
                setStockModal(false);
            } else {
                console.error('Error adding stock');
            } */
            const addStockResponse = await fetch('/api/store-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stockData),
            });

            if (addStockResponse.ok) {
                console.log('Stock added successfully');
                window.location.reload();
                const updatedProducts = [...products];
                updatedProducts[selectedIndex].quantity += stockData.stockQuantity;
                setProducts(updatedProducts);
                onClose();
                setBtnLoading(false);
                setSelectedProductName('');
                setStockQuantity('');
                setCurrentDate('');
                setStockModal(false);
            } else {
                console.error('Error adding stock');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    function rohan() {
        onClose();
    }

    const handleProductSelect = (e) => {
        setSelectedProductName(e.target.value);
    };
    return (
        <>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
                <div className="relative w-[50rem] my-6 max-w-3xl">

                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                STOCK
                            </h3>
                            <button
                                className="p-1 ml-auto  border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={rohan}
                            >
                                <span className="text-black h-6 w-6 text-2xl block  ">
                                    X
                                </span>
                            </button>
                        </div>

                        <main className="relative p-6 flex justify-between">
                            <div className="my-4 text-blueGray-500 text-lg leading-relaxed w-[50rem]">
                                <form>
                                    <div className="mb-4">
                                        <p className="text-blue-600 text-center font-bold">Add Stock</p>
                                        <label htmlFor="productName" className="block mb-2">
                                            Select a Product
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
                                            ))}Name
                                        </select>
                                    </div>
                                    {selectedProductName && (<>
                                        <div className="mb-4">
                                            <label htmlFor="quantity" className="block mb-2">
                                                Quantity
                                            </label>
                                            {negativeStockError && (
                                                <p className="text-red-500">Please enter a valid quantity to add stock.</p>
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
                                            <label htmlFor="quantity" className="block mb-2">
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
                                    </>)}
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
                            <button disabled={btnLoading}
                                onClick={addStock}
                                className="disabled:opacity-10 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold mr-2"
                            >
                                Add Stock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
    );
}

export default Addstock;