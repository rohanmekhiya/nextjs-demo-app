import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";
    const client = new MongoClient(uri);
    try {
        const database = client.db('rohan');
        const inventory = database.collection('inventory');
        const query = {};
        const products = await inventory.find(query).toArray();
        return NextResponse.json({ success: true, products })
    } finally {
        await client.close();
    }

}

export async function POST(request) {
    let body = await request.json()
    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/";
    const client = new MongoClient(uri);
    try {
        const database = client.db('rohan');
        const inventory = database.collection('inventory');
        const product = await inventory.insertOne(body)
        return NextResponse.json({ product, ok: true })
    } finally {
        await client.close();
    }
}

export async function DELETE(request) {
    console.log("delete call");
    const id = request.nextUrl.searchParams.get("id");
    const uri = "mongodb+srv://rohanmekhiya915:avfsmM9sDAP2wYmB@cluster0.k10pl0t.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        const database = client.db("rohan");
        const products = database.collection("inventory");

        const query = { _id: new ObjectId(id) };
        console.log(query);
        const res = await products.deleteOne(query);
        console.log(res);

    } catch (error) {
        await client.close();
        console.log("catch");
    }

    return NextResponse.json({ message: "product deleted" }, { status: 200 });
}
