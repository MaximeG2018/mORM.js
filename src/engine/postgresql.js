const { Client } = require('pg')

export default class Postgresql extends Core {
  constructor(config){
    super(config)
  }
  async initialize(){
    let config = {
      //host, port, username, password, database
      host: host,
      port: port,
      username: username,
      password: password,
      database: database
    }

    const client = new Client()
    const connectionString = "postgresql://efrei@10.0.2.38:5432/efrei";

    client.connect()

    client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
      console.log(err ? err.stack : res.rows[0].message) // Hello World!
      client.end()
    })
  }
}
