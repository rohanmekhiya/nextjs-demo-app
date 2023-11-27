import React, { useState, useEffect } from "react";
import Loading from "./loading";

function List() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProductName, setNewProductName] = useState("");
    const [error, setError] = useState(null);
    const [btnLoading, setBtnLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const productsPerPage = 2;

    const fetchData = async (page) => {
        try {
            setLoading(true);
            let url = `/api/products?page=${currentPage}&perPage=${productsPerPage}`;

            if (searchTerm.length >= 3) {
                url += `&name=${searchTerm}`;
            }
            const response = await fetch(url);
            const rjson = await response.json();
            setProducts(rjson.products);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentPage === 1 && searchTerm === "") {
            fetchData(1);
        }
        if (searchTerm.length >= 3) {
            fetchData();
        }
    }, [currentPage, searchTerm]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const totalPages = Math.ceil(products.length / productsPerPage);

    const handleNextPage = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchData(nextPage); // Fetch the next 20 products
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setNewProductName(product.name);
    };

    const updateProductList = (updatedProduct) => {
        const updatedProducts = [...products];

        const index = updatedProducts.findIndex(
            (product) => product._id === updatedProduct._id
        );

        if (index !== -1) {
            updatedProducts[index] = updatedProduct;
            setProducts(updatedProducts);
        }
        setEditingProduct(null);
    };

    const handleEditSubmit = async () => {
        setBtnLoading(true);
        if (!newProductName) {
            setError("New product name cannot be empty.");
            setBtnLoading(false);
            return;
        }

        if (newProductName === editingProduct.name) {
            setError("New product name is the same as the original name.");
            setBtnLoading(false);
            return;
        }

        const isNameExists = products.some(
            (product) => product.name === newProductName
        );

        if (isNameExists) {
            setError("Product name already exists in the list.");
            setBtnLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/products", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: editingProduct._id,
                    newProductName,
                }),
            });

            if (response.ok) {
                console.log("Product name updated successfully");
                const updatedProduct = { ...editingProduct, name: newProductName };
                updateProductList(updatedProduct);
                setBtnLoading(false);
            } else {
                console.error("Product name update failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm.length >= 3) {
            fetchData();
        }
    };

    function rohan() {
        setSearchTerm("");
        window.location.reload;
    }

    return (
        <>
            <div className="container my-[px] mx-auto ">
                <h1 className="text-3xl font-semibold mb-6 text-center">PRODUCTS</h1>
                <div className="w-full flex justify-center my-[2rem]">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 px-4 py-2 mr-2 w-full"
                        />
                        <button
                            type="submit"
                            disabled={searchTerm === "" || searchTerm.length < 3}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-200"
                        >
                            Search
                        </button>

                        <button
                            onClick={rohan}
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md "
                        >
                            Clear
                        </button>
                    </form>
                </div>
                {loading ? (
                    <Loading />
                ) : (
                    <div>
                        {products.length === 0 ? (
                            <p className="text-red-500 font-bold text-center">
                                Product is not available for this search term.
                            </p>
                        ) : (
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="mx-[50px]">
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Quantity</th>
                                        <th className="px-4 py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentProducts.map((product) => (
                                        <tr
                                            className="border-2 text-center hover:bg-sky-100"
                                            key={product._id}
                                        >
                                            <td className="px-4 py-2">{product.name}</td>
                                            <td className="px-4 py-2">{product.quantity}</td>
                                            <td className="px-4 py-2">
                                                <span>
                                                    <button
                                                        onClick={() => {
                                                            openEditModal(product);
                                                        }}
                                                        className="p-2 rounded-lg font-medium bg-green-700 hover:bg-green-800 text-white"
                                                    >
                                                        EDIT
                                                    </button>
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {products.length > 0 && (
                            <div className="flex justify-center mt-4 pb-8">
                                <button
                                    onClick={handlePrevPage}
                                    className={`mx-1 px-3 py-1 rounded-md ${currentPage === 1
                                        ? "bg-gray-200"
                                        : "bg-blue-500 text-white"
                                        }`}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    className={`mx-1 px-3 py-1 rounded-md ${currentPage === totalPages
                                        ? "bg-gray-200"
                                        : "bg-blue-500 text-white"
                                        }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {editingProduct ? (
                    <>
                        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                            <div className="relative w-[50rem] my-6 max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            New Product Name
                                        </h3>
                                        <button
                                            className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                            onClick={() => setEditingProduct(false)}
                                        >
                                            <span className="text-black h-6 w-6 text-2xl block">X</span>
                                        </button>
                                    </div>
                                    <div className="text-center text-red-500 mt-8 font-semibold">
                                        {error}
                                    </div>
                                    {/*body*/}
                                    <main className="relative p-6 flex justify-between">
                                        <div className="my-4 text-blueGray-500 text-lg leading-relaxed w-[50rem]">
                                            <form>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="productName"
                                                        className="block mb-2 text-blue-600 font-semibold"
                                                    >
                                                        Edit Product
                                                    </label>
                                                    <input
                                                        value={newProductName}
                                                        onChange={(e) => setNewProductName(e.target.value)}
                                                        type="text"
                                                        id="newProductName"
                                                        className="w-full border border-gray-300 px-4 py-2"
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    </main>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setEditingProduct(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={handleEditSubmit}
                                            disabled={btnLoading}
                                            type="submit"
                                            className="disabled:opacity-10 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold"
                                        >
                                            SAVE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}
            </div>
        </>
    );
}

export default List;
