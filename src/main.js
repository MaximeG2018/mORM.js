
import mOrm from "./mOrm";
import Student from "./entities/student"

(async () => {
  const orm = new mOrm();

  try {
    await orm.createConnection({
      type: "postgres",
      host: "localhost",
      //port: 5432,
      //username: "20120107",
      port: 5431,
      username: 'efreitech',
      password: "",
      database: "iLovePragmatic",
      synchronize: true
    },
    {
      entities: [Student]
    }
  )

    let studentDora = {
      firstname: 'Dora',
      lastname: 'Lexploratrice',
      age: '10'
    }

  let studentChiper = {
    firstname: 'Chiper',
    lastname: 'Fox',
    age: '5'
  }

  const studentEntity = orm.getEntity('Student')

  // Insert row in table (Insert) --> Dora
  const insertDora = await studentEntity.save(studentDora)
  console.log(`New student : ${insertDora.firstname} ${insertDora.lastname} ${insertDora.age}`)

  // Insert row in table (Insert) --> Chiper
  const insertChiper = await studentEntity.save(studentChiper)
  console.log(`New student : ${insertChiper.firstname} ${insertChiper.lastname} ${insertChiper.age}`)

  // Number of rows in table
  const count = await studentEntity.count()
  console.log(`Number of Student(s) : ${count}`);

  // Get all student(s)
  const findAllStudents = await studentEntity.findAll()
  console.log(`Find all student(s) : ${findAllStudents.map(s => s.firstname).join(', ')}`)

  // Get all student(s) with attributes [lastname]
  const findAllStudentsAttributes = await studentEntity.findAll({attributes : ['lastname']})
  console.log(`Find all student(s) with attributes (lastname) : ${findAllStudentsAttributes.map(s => `${s.lastname}`).join(', ')}`)

  // Update student
  // studentDora.lastname = "Doritos"
  // const updateStudent = await studentEntity.update(studentDora)
  //console.log(`Update student : ${updateStudent.lastname}`)

  // Remove student
  const removeStudent = await studentEntity.remove(studentChiper)
  console.log(`Remove student : ${removeStudent.firstname}`);

  // // Find student by Id
  // const findById = await studentEntity.findByPk(id,{})
  // console.log(`Find student by Id : ${findById.firstname} ${findById.lastname}`)

  }catch (err){
    console.log(err);
    process.exit(-1);
  }
})()
