const express = require('express');
const app = express();
const PORT = 8000;
app.get('/', (req,res) => res.send('Express + TypeScript Server'));
app.use(express.static('public'))

const mongo = require('mongodb'); 
const mongoClient = mongo.MongoClient
const url = "mongodb://localhost:27017/mydb";
mongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});