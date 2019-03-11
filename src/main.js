
import mOrm from "./mOrm";
import Student from "./entities/student"

(async () => {
  const orm = new mOrm();

  try {
    await orm.createConnection({
       //"uri": "postgres://majdi:majdi@localhost:5432/iLovePragmatic"
      type: "postgres",
      host: "localhost",
      port: 5432,
      username:"maxime",
      password:"maxime",
      database: "iLovePragmatic",
      synchronize: true,
      entities: [
        Student
      ]
    })

    let student = {
    firstname: 'Dora',
    lastname: 'Lexploratrice'
  }

  const studentEntity = orm.getEntity('Student')

  // Number of rows in table
  const count = await studentEntity.count()
  console.log(`Number of Student(s) : ${count}`);

  // Save row in table (Insert)
  const saved = await studentEntity.save(student)
  console.log(`New student ${saved.firstname} ${saved.lastname}`)

  // Find student by Id
  const findById = await studentEntity.findByPk(id,{})
  console.log(`Find student by Id : ${findById.firstname} ${findById.lastname}`)

  // Get all student(s)
  const findAll = await studentEntity.findAll({})
  console.log(`Find all student(s) : ${findAll.map(s => s.firstname)}`)

  // Find student by firstname (Dora)
  const findOne = await studentEntity.findOne({
    where: {firstname:'Dora'},
    attributes: ['id', ['firstname', 'lastname']]
  })
  console.log(`Find student by firstname  : ${findOne.firstname} ${findOne.lastname}`)

  }catch (err){
    console.log(err);
    process.exit(-1);
  }
})()

// Project.findOne({
//   where: {title: 'aProject'},
//   attributes: ['id', ['name', 'title']]
// })
// async update(data) {}
// async remove(data) {}
