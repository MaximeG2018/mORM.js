import {isEmpty} from 'lodash'
import {existSync} from 'fs'
import Postgresql from './engine/postgresql'

export default class mOrm {
  configPathName = "./mOrm.config.json";

  async createConnection(dbConfig = {}, extras = {entities: [] }) {
      if (isEmpty(dbConfig)) {
        if(!existSync(path.join(__dirname,this.configPathName))) {
          throw new Error("Configuration file morm.config.js required")
        }
        this.config = require(this.configPathName);
      } else if (dbConfig.uri) {
        const regExp = /^(.*):\/\/(.*):(.*)@(.*):(\d+)\/(.*)$/g
         const [, type, username, password, host, port, database ] = regExp.exec(
           dbConfig.uri
         );

         let newConfig = {
           type,
           username,
           password,
           host,
           port,
           database
         };
         this.config = newConfig;
         console.log(this.config)
      } else {
        this.config = dbConfig;
        console.log(this.config)
      }

      this.config.synchronize = dbConfig.synchronize !== undefined ? dbConfig.synchronize : false;

      this.entities = {};
      for (const entities of extras.entities) {
        this.entities[entities.prototype.constructor.name] = entities;
      }

    switch (this.config.type) {
      case "postgres":
          this.dbInstance = new Postgresql(this.config, this.entities)
        break;
      default:
    }
    await this.dbInstance.initialize();
    console.log(`Connected to ${this.config.database}`)
  }
  getEntity(name){
    return new this.entities[name](this.dbInstance)
  }
}
