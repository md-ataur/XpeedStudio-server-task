const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const upload = require('express-fileupload');

const app = express();
const port = process.env.PORT || 5000;

/**
 * Middleware functions
 */
app.use(cors());
app.use(express.json());
app.use(upload());

/**
 * Database Connection
 */
const uri = "mongodb+srv://dbuser1:9P2AGUUElq70TuhK@cluster0.juclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Card");
        const tasksCollection = database.collection("tasks");
        // console.log('Successfully database connected');

        // Data Insert
        app.post('/data', async (req, res) => {
            const calculateData = JSON.parse(req.body.data);
            const file = req.files.file;

            file.mv(`${__dirname}/uploads/${file.name}`, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                }
                // res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
            });

            calculateData.filePath = `/uploads/${file.name}`;
            const result = await tasksCollection.insertOne(calculateData);
            res.json(result);
        });

        // Get data
        app.get('/data', async (req, res) => {
            const result = await tasksCollection.find({}).toArray();
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