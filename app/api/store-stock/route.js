import { MongoClient } from 'mongodb';

export async function POST(request) {
    const { name, stockQuantity, date, type } = await request.json();

    const uri = 'mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/';
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('rohan');
        const products = database.collection('products');
        const stockUpdate = database.collection('stock-transactions');

        const existingProduct = await products.findOne({ name: name });

        if (!existingProduct) {
            return new Response(JSON.stringify({ error: 'Product not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        if (type === 'ADD') {
            existingProduct.quantity += stockQuantity;
        } else if (type === 'REMOVE') {
            existingProduct.quantity -= stockQuantity;
        } else {
            return new Response(JSON.stringify({ error: 'Invalid operation type' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        const updateResult = await products.updateOne({ name: name }, { $set: { quantity: existingProduct.quantity } });

        if (updateResult.modifiedCount === 1) {
            const stockEntry = {
                product_Id: existingProduct._id,
                quantity: stockQuantity,
                date: new Date(date),
                type: type,
            };
            console.log(stockEntry);

            await stockUpdate.insertOne(stockEntry);

            return new Response(JSON.stringify({ message: 'Stock operation completed successfully' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to update stock' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            });
        }
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

const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";

export async function POST(request) {
    if (request.method !== 'POST') {
        return new Response(null, { status: 405 });
    }

    const stockData = await request.json();

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('rohan');
        const stockCollection = database.collection('stock-transactions');
        const productsCollection = database.collection('products');
        const product = await productsCollection.findOne({ name: stockData.name });

        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        const existingEntry = await stockCollection.findOne({
            productId: product._id,
            date: stockData.date,
        });

        if (existingEntry) {
            // Update the existing entry for the same product and date
            existingEntry.stockQuantity += stockData.stockQuantity;
            await stockCollection.updateOne(
                { _id: existingEntry._id },
                { $set: { stockQuantity: existingEntry.stockQuantity } }
            );
        } else {
            // Create a new entry for the product with the same date
            const stockInsertData = {
                product_Id: product._id,
                stockQuantity: stockData.stockQuantity,
                date: stockData.date,
                stockRemove: 0,
            };
            await stockCollection.insertOne(stockInsertData);
        }

        return new Response(JSON.stringify({ message: 'Stock added to stock-transactions successfully' }), {
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
/* to my stock-transactions collection fields like product_id,quantity,date,type when i click on add stock button the entry 
goes to collection but when i click on add stock button the entry goes to collection and type is assigned with ADD and when i click on remove stock button the entry
goes to my collection and type field is assigned with REMOVE */






/* import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";

export async function POST(request) {
    if (request.method !== 'POST') {
        return new Response(null, { status: 405 });
    }

    const stockData = await request.json();

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('rohan');
        const stockCollection = database.collection('stock-transactions');
        const productsCollection = database.collection('products');
        const product = await productsCollection.findOne({ name: stockData.name });

        if (!product) {
            return new Response(JSON.stringify({ error: 'Product not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        // Check if an entry for the same product and date exists
        const existingEntry = await stockCollection.findOne({
            productId: product._id,
            date: stockData.date,
        });

        if (existingEntry) {
            // Subtract the existing stockQuantity (initial value) from the update and add the new value
            existingEntry.stockQuantity = existingEntry.stockQuantity - existingEntry.stockRemove + stockData.stockQuantity;
            await stockCollection.updateOne(
                { _id: existingEntry._id },
                { $set: { stockQuantity: existingEntry.stockQuantity } }
            );
        } else {
            // Create a new entry for the product with the same date
            const stockInsertData = {
                productId: product._id,
                stockQuantity: stockData.stockQuantity,
                date: stockData.date,
                stockRemove: 0,
            };
            await stockCollection.insertOne(stockInsertData);
        }

        return new Response(JSON.stringify({ message: 'Stock added to stock-transactions successfully' }), {
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
} */

/*when i remove the stock of second product and the value which i give to remove stock of second product this value is added in first product's stockRemove field how to resolve?*/

/*when i add stock in my second or rest of the product the value which i want to add stock this value is taken by my first product's stockQuantity field how to solve this issue*/

/*the problem is here when i am add first product's stock,in my stock-transactions collection stockQuantity field gives me double value if i enter 2 then it gives me 4
and when i add second product's stock it also add first product's stock below is my code how to fix it?*/

/* 
in my stock-transactions collection i want one product with per one date and second product with the same date but a different entry when i am adding a stock at that time
in which product i am adding a stock its stockQuantity field is increased with stock which i am want to add */
