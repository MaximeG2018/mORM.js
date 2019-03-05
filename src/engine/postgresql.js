const { Client } = require('pg')
const client = new Client()

const connectionString = "postgresql://efrei@10.0.2.38:5432/efrei";

client.connect()

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message) // Hello World!
  client.end()
})
