const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()
const port = 5000
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(bodyParser.json())
app.use(cors())
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.x7xfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
const collection = client.db(process.env.DB_Name).collection('products');
const orderCollection = client.db(process.env.DB_Name).collection('orders');
  

 app.post('/addProduct',(req, res)=>{
     const proudcts = req.body;
     collection.insertMany(proudcts)
     .then(result =>{
         console.log(result.insertedCount);
         res.send(result.insertedCount)
     })
 })

 app.post('/productByKeys',(req, res)=>{
   const productsKeys = req.body;
   console.log(productsKeys);
   collection.find({key: { $in: productsKeys } })
    .toArray((err, documents)=>{
      res.send(documents)
      console.log(err);
    }) 
  

 })
 
 app.get('/products',(req, res)=>{
   collection.find({})
   .toArray((err, document)=>{
     res.send(document)
   })
 })
 app.get('/product/:key',(req, res)=>{
   collection.find({key: req.params.key})
   .toArray((err, document)=>{
     res.send(document[0])
   })
 })

 app.post('/addOrders', (req, res)=>{
  orderDetails = req.body;
  orderCollection.insertOne(orderDetails)
  .then(result =>{
    res.send(result.acknowledged);
  })
})

});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)