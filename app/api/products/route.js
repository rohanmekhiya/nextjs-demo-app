import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import url from 'url';

export async function GET(req) {
    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('rohan');
        const inventory = database.collection('products');

        const parsedUrl = url.parse(req.url, true);
        const { name = '' } = parsedUrl.query;
        console.log(name);
        const queryObject = {};
        if (name) {
            queryObject.name = { $regex: new RegExp(name), $options: 'i' };
        }

        const products = await inventory.find(queryObject).toArray();

        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);

        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
}

/* export async function GET(req) {
    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        const database = client.db('rohan');
        const inventory = database.collection('products');

        // Manually parse query parameters from req.url
        const queryParameters = req.url.split('?')[1];
        const queryParams = new URLSearchParams(queryParameters);
        const page = queryParams.get('page') || 1;
        const perPage = queryParams.get('perPage') || 500;
        const name = queryParams.get('name') || '';

        console.log('Request query:', { page, perPage, name });

        // Construct the query based on the provided parameters
        const queryObject = {};
        if (name) {
            queryObject.name = { $regex: new RegExp(name), $options: 'i' }; // Case-insensitive regex search for name
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(perPage);

        // Fetch products based on the constructed query and apply pagination
        const products = await inventory.find(queryObject).skip(skip).limit(parseInt(perPage)).toArray();

        // Return a NextResponse with JSON data
        return NextResponse.json({ success: true, products });
    } catch (error) {
        console.error('Error fetching products:', error);

        // Return a NextResponse with JSON data and a 500 status
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
}
 */


/* 
export async function GET(request) {
    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";
    const client = new MongoClient(uri);
    try {
        const database = client.db('rohan');
        const inventory = database.collection('products');
        const query = {};
        const products = await inventory.find(query).toArray();
        return NextResponse.json({ success: true, products })
    } finally {
        await client.close();
    }

} */

export async function POST(request) {
    let body = await request.json()

    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";
    const client = new MongoClient(uri);

    try {
        const database = client.db('rohan');
        const inventory = database.collection('products');

        const existingProduct = await inventory.findOne({ name: body.name });

        if (existingProduct) {
            console.log("Product with the same name exists");
            return NextResponse.json({ error: 'Product with the same name already exists', ok: false });
        }

        body.date = new Date();

        const product = await inventory.insertOne(body);

        return NextResponse.json({ product, ok: true })
    } finally {
        await client.close();
    }
}

export async function PUT(request) {
    const uri = 'mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/';
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('rohan');
        const inventory = database.collection('products');

        const requestBody = await request.json();

        const id = requestBody.id;
        const newProductName = requestBody.newProductName;

        const filter = { _id: new ObjectId(id) };
        const update = {
            $set: { name: newProductName },
        };

        const result = await inventory.updateOne(filter, update);

        if (result.matchedCount === 1 && result.modifiedCount === 1) {
            return NextResponse.json({ message: 'Product name updated successfully', ok: true });
        } else {
            return NextResponse.json({ error: 'Product not found or update failed', ok: false });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error', ok: false });
    } finally {
        await client.close();
    }
}

