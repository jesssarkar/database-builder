const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8005
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING
    dbName = 'alien-info'

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log('Connected to Database')
        db = client.db(dbName)
    })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extedned: true}))
app.use(express.json())

app.get('/', (request, response) => {
    db.collection('star-trek-api').find().toArray()
        .then(data => {
           let nameList = data.map(item => item.speciesName)
           console.log(nameList)
           response.render('index.ejs', {info: nameList})
        })
        .catch(error => console.log(error))
})

app.post('/api', (request, response) => {
    console.log('Post Heard')
    db.collection('star-trek-api').insertOne(
        request.body
    )
    .then(result => {
        console.log(result)
        response.redirect('/')
    })
})

app.put('/updateEntry', (request, response) => {
    console.log(request.body)
    Object.keys(request.body).forEach(key => {
        if (request.body[key] === null || request.body[key] === undefined || request.body[key] === ""){
            delete request.body[key]
        }
    })
    console.log(request.body)
    db.collection('star-trek-api').findOneAndUpdate(
        {name: request.body.name},
        {
            $set: request.body
        }
    )
    .then(result => {
        console.log(result)
        response.json('Success')
        
    })
    .catch(error => console.error(error))
})

app.delete('/deleteEntry', (request, response) => {
    db.collection('star-trek-api').deleteOne(
        {name: request.body.name}
    )
    .then(result => {
        console.log('Entry Deleted')
        response.json('Entry Deleted')
    })
    .catch(error => console.error(error))
})


app.listen(process.env.PORT || PORT, () => {
console.log('Server is Running')})