const express = require('express');
const cors = require('cors');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjs4f1h.mongodb.net/?retryWrites=true&w=majority`;

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


    const userCollection = client.db("househunterDb").collection("user");
    const housesCollection = client.db("househunterDb").collection("houses");
    const bookingCollection = client.db("househunterDb").collection("booking");

    // app.post('/jwt', async (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: '1h'
    //   })
    //   res.send({ token });
    // })

    // //middlewares for verifytoken
    // const verifyToken = (req, res, next) => {
    //   console.log('inside verify token', req.headers);
    //   if (!req.headers.authorization) {
    //     return res.status(401).send({ message: 'unauthorized access' });
    //   }
    //   const token = req.headers.authorization.split(' ')[1];
    //   // next()
    //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //     if (err) {
    //       console.log(err);
    //       res.status(401).send({ message: 'unauthorized access' })
    //     }
    //     req.decoded = decoded;
    //     next()
    //   })
    // }


    app.get('/user', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })
    app.post('/user', async (req, res) => {
        const user = req.body;
        const query = { email: user.email }
        const userExits = await userCollection.findOne(query);
        if (userExits) {
          return res.send({ message: 'user already exists', insertedId: null })
        }
        const result = await userCollection.insertOne(user);
        res.send(result);
      })

      app.put('/user', async (req, res) => {
        const user = req.body;
        const query = { email: user.email, password: user.password }
        const result = await userCollection.findOne(query);
        if (result==null) {
               res.send({ flag: -1 })
            } else {
                 res.send({result})
            }
    })

      app.get('/houses', async (req, res) => {
        const result = await housesCollection.find().toArray();
        res.send(result);
      })

      app.post('/houses', async (req, res) => {
        const addHouses = req.body;
        const result = await housesCollection.insertOne(addHouses);
        res.send(result);
      })
      app.delete('/houses/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await housesCollection.deleteOne(query);
        res.send(result);
      })

//booking APi /....
      app.get('/booking', async (req, res) => {
        const result = await bookingCollection.find().toArray();
        res.send(result);
      })
      app.get('/booking', async (req, res) => {
        let query = {};
        if (req.query?.email) {
            query = { email: req.query.email }
        }
        const result = await bookingCollection.find(query).toArray();
        res.send(result);
    })
      app.post('/booking', async (req, res) => {
        const query = req.body;
        const result = await bookingCollection.insertOne(query);
        res.send(result);
      })
      app.delete('/booking/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await bookingCollection.deleteOne(query);
        res.send(result);
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(`house hunter server is running ${port}`);
})
