export default class Entity {
  constructor(dbInstance,tableName) {
    this.dbInstance = dbInstance;
    this.tableName = tableName;
  }

  async save(data) {
    return this.dbInstance.save(data, this.tableName);
  }

  async count() {
    return this.dbInstance.count(this.tableName);
  }

  async findAll({ attributes } = {} ) {
    return this.dbInstance.findAll(this.tableName, { attributes });
  }

  async update(data) {
    return this.dbInstance.update(data, this.tableName)
  }

  async remove(data) {
    return this.dbInstance.remove(data, this.tableName)
  }
  // async findOne({ where, attributes }) {
  //   return this.dbInstance.findOne(this.tableName, {})
  // }

  // async findByPk(id, { attributes }) {
  //   return this.dbInstance.findByPk(this.name, id, { attributes });
  // }
  //
  // async remove(data) {}

}
