"use client"

import React, { useState, useEffect } from 'react';
import Loading from '../loading';

function Report({ find }) {
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [productsData, setProductsData] = useState([]);

    const fetchReportData = async (selectedDate) => {
        try {
            const response = await fetch(`/api/report?date=${selectedDate}`);
            if (response.ok) {
                const data = await response.json();
                setReportData(data);
                setError(null);
            } else {
                setError('No data is there for selected date.');
            }
        } catch (error) {
            setError('Error fetching report data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProductsData = async () => {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                const data = await response.json();
                setProductsData(data);
            } else {
                setError('Error fetching products data.');
            }
        } catch (error) {
            setError('Error fetching products data.');
        }
    };

    useEffect(() => {
        const currentDate = new Date().toISOString();
        fetchReportData(currentDate);
        fetchProductsData();
    }, []);
    const getProductNames = (productId) => {
        const productsArray = productsData && productsData.products;
        const foundProduct = productsArray && productsArray.find(product => product._id === productId);
        return foundProduct ? foundProduct.name : 'Unknown Product';
    };


    return (
        <>
            <div className='flex justify-center mt-32 items-center gap-16 container mx-auto border-2 p-4'>
                <div>
                    <label htmlFor="date" className="text-gray-700 font-semibold w-16 mr-8">Date:</label>
                    <input
                        value={currentDate}
                        type="date"
                        onChange={(e) => setCurrentDate(e.target.value)}
                        id="date"
                        className="border border-gray-300 px-4 py-2 w-48"
                    />
                </div>
                <div>
                    <button
                        onClick={() => {
                            setLoading(true);
                            setError(null);
                            fetchReportData(currentDate);
                        }}
                        className="bg-blue-500 hover-bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                    >
                        Run
                    </button>
                </div>
            </div>
            {loading ? (
                <Loading />
            ) : error ? (
                <div className="flex justify-center mt-8 container mx-auto text-red-500 font-bold">
                    {error}
                </div>
            ) : (
                reportData && (
                    <div className="flex justify-center mt-8 container mx-auto">
                        <table className="border border-collapse w-full">
                            <thead>
                                <tr>
                                    <th className="border p-2">Name</th>
                                    <th className="border p-2">Purchase</th>
                                    <th className="border p-2">Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map((item, index) => (
                                    <tr key={index} className="text-center">
                                        <td className="border p-2">{getProductNames(item.product_Id)}</td>
                                        <td className="border p-2">{item.totalPurchase}</td>
                                        <td className="border p-2">{item.totalSales}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </>
    );
}

export default Report;
