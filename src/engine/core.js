export default class Core {

  constructor ({host, port, username, password, database, synchronize = false, entities =[]}){
    this.host = host
    this.port = port
    this.username = username
    this.password = password
    this.databse = database
    this.synchronize = synchronize
    this.entities = entities
  }

}
