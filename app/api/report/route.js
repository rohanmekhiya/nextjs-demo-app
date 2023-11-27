import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/';
const databaseName = 'rohan';

export async function GET(request) {
    const queryParams = new URLSearchParams(request.url.split('?')[1]);
    const dateString = queryParams.get('date');

    if (!dateString) {
        return new Response(JSON.stringify({ message: 'No date is not there' }));
    }

    const date = new Date(dateString);

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db(databaseName);
        const stockTransactions = database.collection('stock-transactions');
        const products = database.collection('products');

        const yearMonthDay = date.toISOString().split('T')[0];
        const startDate = new Date(yearMonthDay);
        const endDate = new Date(yearMonthDay);
        endDate.setDate(endDate.getDate() + 1);

        const aggregationPipeline = [
            {
                $match: {
                    date: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $group: {
                    _id: '$product_Id',
                    totalPurchase: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'ADD'] },
                                '$quantity',
                                0
                            ]
                        }
                    },
                    totalSales: {
                        $sum: {
                            $cond: [
                                { $eq: ['$type', 'REMOVE'] },
                                '$quantity',
                                0
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    product_Id: '$_id',
                    totalPurchase: 1,
                    totalSales: 1,
                    _id: 0
                }
            }
        ];

        const reportArray = await stockTransactions.aggregate(aggregationPipeline).toArray();

        if (reportArray.length === 0) {
            return new Response(JSON.stringify({ error: 'No data found for the specified date' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        return new Response(JSON.stringify(reportArray), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    } finally {
        await client.close();
    }
}



/* import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/';
const databaseName = 'rohan';

export async function GET(request) {
    const queryParams = new URLSearchParams(request.url.split('?')[1]);
    const dateString = queryParams.get('date');

    if (!dateString) {
        return new Response(JSON.stringify({ message: 'no date is not there' }));
    }

    const date = new Date(dateString);

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db(databaseName);
        const stockTransactions = database.collection('stock-transactions');
        const products = database.collection('products');

        const yearMonthDay = date.toISOString().split('T')[0];
        const startDate = new Date(yearMonthDay);
        const endDate = new Date(yearMonthDay);
        endDate.setDate(endDate.getDate() + 1);

        const addTransactions = await stockTransactions.find({
            date: {
                $gte: startDate,
                $lt: endDate
            },
            type: "ADD"
        }).toArray();

        // Use different variable names for the following section
        const yearMonthDayRemove = date.toISOString().split('T')[0];

        const startDateRemove = new Date(yearMonthDayRemove);
        const endDateRemove = new Date(yearMonthDayRemove);
        endDateRemove.setDate(endDateRemove.getDate() + 1);

        const removeTransactions = await stockTransactions.find({
            date: {
                $gte: startDateRemove,
                $lt: endDateRemove
            },
            type: "REMOVE"
        }).toArray();



        const reportData = {};
        addTransactions.forEach((transaction) => {
            const productId = transaction.product_Id;
            if (!reportData[productId]) {
                reportData[productId] = {
                    totalPurchase: 0,
                    totalSales: 0,
                };
            }
            reportData[productId].totalPurchase += transaction.quantity;
        });

        removeTransactions.forEach((transaction) => {
            const productId = transaction.product_Id;
            if (!reportData[productId]) {
                reportData[productId] = {
                    totalPurchase: 0,
                    totalSales: 0,
                };
            }
            reportData[productId].totalSales += transaction.quantity;
        });

        const reportArray = Object.keys(reportData).map((productId) => ({
            product_Id: productId,
            totalPurchase: reportData[productId].totalPurchase,
            totalSales: reportData[productId].totalSales,
        }));

        if (reportArray.length === 0) {
            return new Response(JSON.stringify({ error: 'No data found for the specified date' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        return new Response(JSON.stringify(reportArray), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    } finally {
        await client.close();
    }
}
 */