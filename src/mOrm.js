import {isEmpty} from 'lodash'
import {existSync} from 'fs'

export default class mOrm {
  configPathName = "./mOrm.config.json";

  async createConnection(dbConfig = {}) {
      if (isEmpty(dbConfig)){
        if(!existSync(path.join(__dirname,this.configPathName))){
          throw new Error("Configuration file morm.config.js required")
        }
        this.config = require(this.configPathName);
      }else {
        if (dbConfig.uri){
           const regExp = /^(.*):\/\/(.*):(.*)@(.*):(\d)+\/(.*)/g
           const matches = regExp.exec(dbConfig.uri)
           const [, type, username, password, host, port, database ] = matches

           this.config = {
             type,
             username,
             password,
             host,
             port,
             database
           };
        } else {
          this.config = dbConfig;
          console.log(this.config)
        }
      }
  }

  getEntity(name){
    for (let entityName in this.entities){
      if (entityName == name){
          // ???
      }
    }
  }
}
