import { useState } from "react";

function addproduct({ onClose }) {
    const [emptyForm, setEmptyForm] = useState(false);
    const [productExists, setProductExists] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [productForm, setProductForm] = useState({});
    const [products, setProducts] = useState([]);

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
                window.location.reload();
                onClose();
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
        console.log(rjson2);
        setProducts(rjson2.products);

        setShowModal(false);
        setShowModal(false);
        //setProducts(rjson2.products);
        setBtnLoading(false);
        e.preventDefault();

    }



    const handleChange = (e) => {
        setProductForm({ ...productForm, [e.target.name]: e.target.value })
    }

    function rohan() {
        onClose();
    }
    return (
        <>

            <>
                <div
                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                >
                    <div className="relative w-[50rem] my-6 max-w-3xl">

                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                <h3 className="text-3xl font-semibold">
                                    PRODUCTS
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
                                            {productExists && (
                                                <p className="text-red-500 text-center">Product with the same name already exists</p>
                                            )}

                                            {emptyForm && (
                                                <p className="text-red-500 text-center">Product name can not be empty</p>
                                            )}
                                            <label htmlFor="productName" className="block mb-2">Product Name</label>
                                            <input required value={productForm?.name || ""} name='name' onChange={handleChange} type="text" id="productName" className="w-full border border-gray-300 px-4 py-2" />
                                        </div>
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
                                <button disabled={btnLoading} onClick={addProduct} type="submit" className="disabled:opacity-10 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>


        </>
    );
}

export default addproduct;