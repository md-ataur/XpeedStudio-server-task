const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

/**
 * Middleware functions
 */
app.use(cors());
app.use(express.json());

/**
 * Database Connection
 */
const uri = "mongodb+srv://dbuser1:9P2AGUUElq70TuhK@cluster0.juclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Card");
        const records = database.collection("records");

        console.log('Successfully database connected');

        // Insert
        app.post('/data', async (req, res) => {
            const calculateData = req.body;
            const result = await records.insertOne(calculateData);
            res.send(result);
        });

        // Get data
        app.get('/data', async (req, res) => {
            const result = await records.find({}).toArray();
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log('Listening at', port);
});