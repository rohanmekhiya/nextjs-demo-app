import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {

    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const { date, name, stockQuantity } = await request.json();
    console.log(date, name, stockQuantity);

    try {
        await client.connect();

        const database = client.db('rohan');
        const stockUpdate = database.collection('stock-transactions');

        const stockEntry = {
            product_Id: existingProduct._id,
            quantity: stockQuantity,
            date: new Date(date),
            type: 'ADD',
        };

        await stockUpdate.insertOne(stockEntry);

        return new NextResponse(JSON.stringify({ message: 'Stock added successfully' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('Error:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
        //console.error('Error:', error);
    } finally {
        await client.close();
    }
}







/* import { MongoClient } from 'mongodb';

export async function POST(request) {
    if (request.method !== 'POST') {
        return new Response(null, { status: 405 });
    }

    const stockData = await request.json();

    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('rohan');
        const inventory = database.collection('products');
        const stockUpdate = database.collection('stock-transactions');

        const query = { name: stockData.name };
        const existingProduct = await inventory.findOne(query);

        if (!existingProduct) {
            return new Response(JSON.stringify({ error: 'Product not found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        // Update the product quantity based on the stockQuantity
        existingProduct.quantity += stockData.stockQuantity;
        existingProduct.date = new Date(stockData.date);

        const updateResult = await inventory.updateOne(query, { $set: existingProduct });

        if (updateResult.modifiedCount === 1) {
            // Check if an entry for the same date and product exists
            const existingEntry = await stockUpdate.findOne({ date: stockData.date, productId: existingProduct._id });

            if (existingEntry) {
                // Calculate the new stockQuantity by adding the new stock quantity to the existing entry
                existingEntry.stockQuantity += stockData.stockQuantity;
                await stockUpdate.updateOne({ _id: existingEntry._id }, { $set: { stockQuantity: existingEntry.stockQuantity } });
            } else {
                // Create a new entry in stock-transactions
                const stockEntry = {
                    productId: existingProduct._id,
                    stockQuantity: stockData.stockQuantity,
                    date: stockData.date,
                };
                await stockUpdate.insertOne(stockEntry);
            }

            return new Response(JSON.stringify({ message: 'Stock added successfully' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200,
            });
        } else {
            return new Response(JSON.stringify({ error: 'Failed to add stock' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return Response(JSON.stringify({ error: 'Internal server error' }), {
            headers: { 'Content-Type': 'application.json' },
            status: 500,
        });
    } finally {
        await client.close();
    }
}
 */