import Core from "./core";
import { Client } from 'pg';
import { isEmpty } from 'lodash';


export default class Postgresql extends Core {

// Initialize
  async initialize(){
    const {
      host,
      port,
      username,
      password,
      database,
      synchronize,
      entities
    } = this;

    this.client = new Client ({
      user: username,
      host,
      database,
      password,
      port
    })

    try {

      await this.client.connect()
      await this.createTable()
  }
  catch (err) {
    throw new Error(err.message)
  }
 }

// METHODE CREATE TABLE DYNAMIQUE
 async createTable() {
  const arEntities = Object.values(this.entities);
  for (const entity of arEntities) {
    const {name: tableName, columns } = entity.meta()

    let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;


      for (const entity of arEntities) {
        const { name: tableName, columns } = entity.meta();

        let query = `CREATE TABLE IF NOT EXISTS ${tableName} (`;

        for (const [key, item] of Object.entries(columns)) {
            let type;
            switch (item.type) {
                case "string":
                  type = "varchar(255)";
                  break;
                case "number":
                  type = "integer";
                  break;
                default:
                  type = "";
                  break;
            }

            if (item.primary) {
                query += `${key}`;
                if (item.generated) {
                query += ` SERIAL`;
                item.type = "";
                }
                query += ` PRIMARY KEY`;
            } else {
                query += `${key} ${type}`;
                query += ` ${item.optional === true ? "NULL" : "NOT NULL"}`;
            }
            query += ", ";
        }

        query = query.slice(0, -2) + ")";

        this.client.query(query, (err, res) => {
          if (err) {
            throw new Error(err.stack);
          } else {
            console.log(`Table ${tableName} has been created`);
          }
        });
    }
  }
    if(this.synchronize) {
      for(const entity of arEntities){
        const { name: tableName } = entity.meta()
        console.log(tableName);
        this.client.query(`DELETE FROM ${tableName}`, (err, res) => {
          if(err){
            throw new Error(err.stack)
          }else {
            console.log(`Table ${tableName} has been erased`)
          }
        })
      }
    }
  }

  // METHODE save (insert)
  async save(data, tableName) {
      return new Promise((resolve, reject) => {
        const columns = Object.keys(data).join(", ")
        const values = Object.values(data)
        const params = values.map((_, i) => `$${i + 1}`).join(', ')

          this.client.query(`INSERT INTO ${tableName} (${columns}) VALUES (${params}) RETURNING *`, values, (err, result) => {
          if (err) {
              reject(err);
          } else {
              resolve(result.rows[0]);
            }
          });
      });
  }

 // METHODE count
  async count(tableName)  {
    return new Promise((resolve, reject) => {
        this.client.query(`SELECT COUNT(1) FROM ${tableName}`, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result.rows[0].count);
           }
        });
    });
  }

  // METHODE findAll
  async findAll(tableName, { attributes }) {
    return new Promise((resolve, reject) => {
      let query = ` SELECT ${isEmpty(attributes) ? '*' : attributes.join(", ")}
                    FROM ${tableName} `;
      this.client.query(query, (err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(result.rows)
        }
     });
   });
 }

  // METHODE findOne
  async findOne(tableName, { attributes, where }) {
    return new Promise((resolve, reject) => {
      let array = []
      for (const key in where ){
        array.push(key+"="+where[key])
      }
      array = array.join(' AND ')
      let query = ` SELECT ${isEmpty(attributes) ? '*' : attributes.join(", ")}
                    FROM ${tableName}
                    WHERE firstname = 'Chiper'
                    LIMIT 1
                    `;

      this.client.query(query, (err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(result.rows[0])
        }
      });
    });
  }

  // METHODE update
  async update (data, tableName) {
    return new Promise((resolve, reject) => {
      const querySet = Object.keys(data).map((key, i) => { return `${key}=$${i+1}` }).join(', ');
      const values = Object.values(data);
      const params = values.map((_, i) => `$${i + 1}`).join(', ');
      this.client.query(`UPDATE ${tableName} SET ${querySet} WHERE id=${data.id}`, values, (err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(result)
        }
      });
    });
  }

  // METHODE remove
  async remove(data, tableName){
    return new Promise((resolve, reject) => {
      this.client.query(`DELETE FROM ${tableName} WHERE id=${data.id} `, (err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(result)
        }
      })
    })
  }
}
