const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =  express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iknar0j.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('foodDB').collection('product');
    const brandCollection = client.db('foodDB').collection('brands');
    

    app.get('/products', async(req, res) =>{
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    
    // brands get
    app.get('/brands', async(req, res) =>{
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    

    app.post('/products', async(req, res) =>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    })

    // brand post
    app.post('/brands', async(req, res) =>{
      const newBrand = req.body;
      console.log(newBrand);
      const result = await brandCollection.insertOne(newBrand);
      res.send(result);
    })

    // single brand
    app.get('/brands/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await brandCollection.findOne(filter);
      console.log(result);
      res.send(result);
    })

    // Brand wish product get
     app.get("/brand-product/:id", async (req, res) => {
        const brandId = req.params.id;
        const filter = {brand_id : brandId }
        const result = await productCollection.find(filter).toArray();
        res.send(result)
    });

  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('Food and bevarage server is running.')
})

app.listen(port, () =>{
    console.log(`Food and bevarage server is running on port: ${port}`)
})