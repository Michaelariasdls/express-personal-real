const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
// https://chat.openai.com/c/44b28f33-6d16-4de7-bd0e-1ca8d54e5e8a    Explaination of code
var db, collection;
//  This code specifies the connection details for a database. It tells the application where to find the database and how to authenticate with it.  
                  //path       |       Key
const url = "mongodb+srv://michaelariasdls:Myfirstcluster@infocluster.1zuomgx.mongodb.net/?retryWrites=true&w=majority";
const dbName = "demo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

// https://expressjs.com/en/guide/using-template-engines.html

//https://ionicabizau.github.io/ejs-playground/     <- Visual representation
//A template engine enables you to use static template files in your application. At runtime, the template engine replaces variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This approach makes it easier to design an HTML page.
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('events').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {events: result})
  })
})

app.post('/events', (req, res) => {
  console.log(req)
  db.collection('events').insertOne({name: req.body.name, date: req.body.date}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})


//to be able to sort through the list of the likes they both need to be in the same app.put
app.put('/events', (req, res) => {
  db.collection('events')
  .findOneAndUpdate({name: req.body.name, date: req.body.date}, {
    $set: {
      willAttend: "yes"
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})
//.findOneAndUpdate({name: req.body.name, msg: req.body.msg.trim()}
//MongoDB duplicates & thats because it adds a random space, so trim trims it, for dupe it is a string, go to mongo to inspect the string
app.put('/events/maybe', (req, res) => {
  console.log(req.body)
  db.collection('events')
  .findOneAndUpdate({name: req.body.name, date: req.body.date}, {
    $set: {
      willAttend: "maybe"
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})




app.delete('/events', (req, res) => {
  db.collection('events').findOneAndDelete({name: req.body.name, date: req.body.date}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Event deleted!')
  })
})












