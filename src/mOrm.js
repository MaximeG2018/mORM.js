import {isEmpty} from 'lodash'
import {existSync} from 'fs'

export default class mOrm {
  configPathName = "./mOrm.config.json";

  async createConnection(dbConfig = {}) {
      if (isEmpty(dbConfig)){
        if(!existSync(this.configPathName)){
          throw new Error("Configuration file morm.config.js required")
        }
        this.config = require (this.configPathName);
      }else {
        if (dbConfig.uri){
           const regExp = /^(.*):\/\/(.*):(.*)@(.*):(\d)+\/(.*)/g
           const [, type, username, password, host, port, database ] = regExp.exec(dbConfig.uri);

           this.dbConfig = {
             type,
             username,
             password,
             host,
             port,
             database
           };
        } else {
          this.dbConfig = dbConfig;
        }
      }
  }
}
