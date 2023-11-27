import { MongoClient } from 'mongodb';

export async function POST(request) {
    const { name, stockQuantity, date } = await request.json();

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

        if (existingProduct.quantity >= stockQuantity) {
            existingProduct.quantity -= stockQuantity;

            await products.updateOne({ name: name }, { $set: { quantity: existingProduct.quantity } });

            const stockEntry = {
                product_Id: existingProduct._id,
                quantity: stockQuantity,
                date: new Date(date),
                type: "REMOVE",
            };

            await stockUpdate.insertOne(stockEntry);

            return new Response(JSON.stringify({ message: 'Stock removal added successfully' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ error: 'Not enough stock quantity to remove' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
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





/* import { MongoClient, ObjectId } from 'mongodb';

export async function POST(request) {
    const { name, stockQuantity, date } = await request.json();

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

        existingProduct.quantity -= stockQuantity;

        const updateResult = await products.updateOne({ name: name }, { $set: { quantity: existingProduct.quantity } });

        if (updateResult.modifiedCount === 1) {
            const stockEntry = {
                productId: existingProduct._id,
                stockRemove: stockQuantity,
                date: new Date(date).toISOString().split('T')[0],
            };
            await stockUpdate.insertOne(stockEntry);
            return new Response(JSON.stringify({ message: 'Stock removed successfully' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to remove stock' }), {
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




 */