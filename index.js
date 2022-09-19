const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const data = require("./Data.json");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qygv5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("DB Connected");

    const taskCollection = client.db("ACC").collection("task");

    app.get("/user/all", async (req, res) => {
      const limit = req.query.limit;
      const query = {};
      const result = await taskCollection.find(query).toArray();
      const resu = result.slice(0, limit);
      res.send(resu);
    });

    app.get("/user/random", async (req, res) => {
      const query = {};
      const result = await taskCollection.find(query).toArray();
      const randomuser = result[Math.floor(Math.random() * data.length)];
      res.send(randomuser);
    });

    app.post("/user/save", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await taskCollection.insertOne(user);
      res.send(result);
    });

    app.put("/user/update/:id", async (req, res) => {
      const id = req.params.id;
      const object = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: object,
      };
      const updatedBooking = await taskCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(updatedBooking);
    });

    app.patch("/user/bulk-update", async (req, res) => {
      var query = req.body;
      var data = { $set: { age: "above 22" } };
      const result = await taskCollection.updateMany(query, data);
      res.send(result);
    });

    app.delete("/user/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
