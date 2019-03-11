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

  // METHODE SAVE (INSERT)
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

 // METHODE COUNT
  async count(tableName)  {
    return new Promise((resolve, reject) => {
      console.log(tableName);
        this.client.query(`SELECT COUNT(1) FROM ${tableName}`, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result.rows[0].count);
           }
        });
    });
  }

  // METHODE FINDALL
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

  // METHODE UPDATE
  async update (data, tableName) {
    return new Promise((resolve, reject) => {
      const columns = Object.keys(data).join(', ');
      const values = Object.values(data);
      const params = values.map((_, i) => `$${i + 1}`).join(', ');

      this.client.query(`UPDATE ${tableName} SET ${columns}`,(err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(result.rows[0])
        }
      });
    });
  }

  // METHODE REMOVE
  async remove(data, tableName){
    return new Promise((resolve, reject) => {
      const columns = Object.keys(data).join(', ');
      const values = Object.values(data);
      const params = values.map((_, i) => `$${i + 1}`).join(', ');
      console.log(columns);
      console.log(values);

      this.client.query(`DELETE FROM ${tableName} WHERE ${columns} = 'Chiper'`, (err, result) => {
        if(err){
          reject(err)
        }else {
          resolve(result.rows[0])
        }
      })
    })
  }
}
