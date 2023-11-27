"use client"

import { useState, useEffect } from 'react';
import Loading from "../loading";
import List from '../list';
import Addproduct from '../addproduct';
import Addstock from '../addstock';
import Removestock from '../removestock';

function HomePage() {
    const [productForm, setProductForm] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [productExists, setProductExists] = useState(false);
    const [stockmodal, setStockModal] = useState(false);
    const [selectedProductName, setSelectedProductName] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [btnLoading, setBtnLoading] = useState(false);
    const [emptyForm, setEmptyForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProductName, setNewProductName] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [error, setError] = useState(null);
    const [removeStockModal, setRemoveStockModal] = useState(false);
    const [negativeStockError, setNegativeStockError] = useState(false);

    const updateProductQuantity = (productName, quantity) => {
        // Find the product in the state and update its quantity
        const updatedProducts = products.map((product) =>
            product.name === productName
                ? { ...product, quantity: product.quantity + quantity }
                : product
        );

        setProducts(updatedProducts);
    };

    /* 
        const openEditModal = (product) => {
            setEditingProduct(product);
            setNewProductName(product.name);
        }; */

    const handleProductSelect = (e) => {
        setSelectedProductName(e.target.value);
    };
    /*     const updateProductList = (updatedProduct) => {
            const updatedProducts = [...products];
    
            const index = updatedProducts.findIndex((product) => product._id === updatedProduct._id);
    
            if (index !== -1) {
                updatedProducts[index] = updatedProduct;
                setProducts(updatedProducts);
            }
            setEditingProduct(null);
        };
     */
    /* 
        useEffect(() => {
            //setLoading(true);
            const fetchProducts = async () => {
                const response = await fetch('/api/products')
                let rjson = await response.json();
                setProducts(rjson.products)
                //setLoading(false);
            }
            fetchProducts()
        }, [])  */

    const addProduct = async (e) => {
        setBtnLoading(true);

        productForm.quantity = 0;

        const response = await fetch(`/api/products?id=${productForm?._id}`);
        let rjson = await response.json()

        if (!productForm?.name || productForm.name.trim() === "") {
            setEmptyForm(true);
            setBtnLoading(false);
            return;
        }

        const productNameLowerCase = productForm.name.toLowerCase();
        for (const product of rjson.products) {

            if (product.name.toLowerCase() === productNameLowerCase) {
                setProductExists(true);
                setBtnLoading(false);
                return;
            }
        }

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productForm)
            });

            if (response.ok) {
                setShowModal(false);
                setProductForm({})
                setProductExists(false);
                setBtnLoading(false);
            } else {
                console.error('Error adding product');
            }
        } catch (error) {
            console.error('Error:', error);
        }

        const response2 = await fetch('/api/products')
        let rjson2 = await response2.json()

        setShowModal(false);
        setShowModal(false);
        setProducts(rjson2.products);
        setBtnLoading(false);
        e.preventDefault();

    }

    /* const addStock = async () => {
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


            const storeStockResponse = await fetch('/api/store-stock', {
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
                setBtnLoading(false);
                setStockModal(false);
            } else {
                console.error('Error adding stock');
            }

            const addStockResponse = await fetch('/api/add-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(stockData),
            });

            if (addStockResponse.ok) {
                console.log('Stock added successfully');
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
    }; */

    /* const handleEditSubmit = async () => {
        if (!newProductName) {
            setError('New product name cannot be empty.');
            return;
        }

        if (newProductName === editingProduct.name) {
            setError('New product name is the same as the original name.');
            return;
        }

        const isNameExists = products.some(product => product.name === newProductName);

        if (isNameExists) {
            setError('Product name already exists in the list.');
            return;
        }

        try {
            const response = await fetch('/api/products', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: editingProduct._id,
                    newProductName,
                }),
            });

            if (response.ok) {
                console.log('Product name updated successfully');
                const updatedProduct = { ...editingProduct, name: newProductName };
                updateProductList(updatedProduct);
            } else {
                console.error('Product name update failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }; */

    /* const removeStock = async () => {
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
                // Update the stock quantity in your local state (if using React)
                const updatedProducts = [...products];
                updatedProducts[selectedIndex].quantity -= stockData.stockQuantity;
                setProducts(updatedProducts);
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
    }; */

    /* 
        const handleChange = (e) => {
            setProductForm({ ...productForm, [e.target.name]: e.target.value })
        } */
    function namemodal() {
        setShowModal(false);
    }

    function add() {
        setStockModal(false);
    }
    function remove() {
        setRemoveStockModal(false);
    }
    return (
        <>

            <div className="flex justify-center mt-[5rem] mb-[2rem]">
                <button onClick={() => { setShowModal(true) }} type="button"
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    ADD PRODUCT</button>
                <button onClick={() => { setStockModal(true) }}
                    type="button" className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                    ADD STOCK</button>
                <button onClick={() => { setRemoveStockModal(true) }}
                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >REMOVE STOCK</button>
            </div>


            <div>
                {stockmodal ? <Addstock onClose={add} updateProductQuantity={updateProductQuantity} /> : null}
            </div>
            <div>
                {showModal ? <Addproduct onClose={namemodal} onAddProduct={addProduct} /> : null}
            </div>
            {/*removeStockModal ? (
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
                                        onClick={() => setRemoveStockModal(false)}
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
                                        onClick={() => setRemoveStockModal(false)}
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
                                                        ) : null*/}
            <div>
                <List products={products} />
            </div>
            <div>
                {removeStockModal ? <Removestock onClose={remove} /> : null}
            </div>
        </>
    );
}

export default HomePage;