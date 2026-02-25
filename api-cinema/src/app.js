const express = require('express')
const pool = require('./config/database')

const app = express()

app.use(express.json)

app.get('/', (req, res) => {
    res.send('A API cinema está funcionando')
})

app.get('/filme', (req, res) => {
    pool.query('SELECT * FROM filme',(err, results) => {
        res.json(results)
    })
})