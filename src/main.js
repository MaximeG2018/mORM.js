
import mOrm from "./mOrm";
import Student from "./entities/student"

(async () => {
  const orm = new mOrm();

  try {
    await orm.createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "20120107",
      password: "",
      database: "iLovePragmatic",
      synchronize: true
    },
    {
      entities: [Student]
    }
  )

    let studentDora = {
      id: 1,
      firstname: 'Dora',
      lastname: 'Lexploratrice',
      age: 10
    }

  let studentChiper = {
    id: 2,
    firstname: 'Chiper',
    lastname: 'Fox',
    age: 5
  }

  let studentTico = {
    id: 3,
    firstname: 'Tico',
    lastname: 'Remove',
    age: 12
  }

  const studentEntity = orm.getEntity('Student')

  // Insert row in table (Insert) --> Dora
  const insertDora = await studentEntity.save(studentDora)
  console.log(`New student : ${insertDora.firstname} ${insertDora.lastname} ${insertDora.age}`)

  // Insert row in table (Insert) --> Chiper
  const insertChiper = await studentEntity.save(studentChiper)
  console.log(`New student : ${insertChiper.firstname} ${insertChiper.lastname} ${insertChiper.age}`)

  const insertTico = await studentEntity.save(studentTico)
  console.log(`New student : ${insertTico.firstname} ${insertTico.lastname} ${insertTico.age}`)

  // Number of rows in table
  let count = await studentEntity.count()
  console.log(`Number of Student(s) : ${count}`);

  // Get all student(s)
  const findAllStudents = await studentEntity.findAll()
  console.log(`Find all student(s) : ${findAllStudents.map(s => s.firstname).join(', ')}`)

  // Get all student(s) with attributes [lastname]
  const findAllStudentsAttributes = await studentEntity.findAll({attributes : ['lastname']})
  console.log(`Find all student(s) with attributes (lastname) : ${findAllStudentsAttributes.map(s => `${s.lastname}`).join(', ')}`)

  // Update student

  studentDora.firstname = "Doritos"
  studentDora.lastname = "Exploractrice"
  studentDora.age = "10"
  const updateStudent = await studentEntity.update(studentDora)
  console.log(`Update student : ${studentDora.lastname} ${studentDora.firstname} ${studentDora.age}`)

  // Remove student
  const removeStudentTico = await studentEntity.remove(studentTico)
  console.log(`Remove student : Tico`);

  // Number of rows in table
  count = await studentEntity.count()
  console.log(`Number of Student(s) after remove : ${count}`);

  // FindOne Student
  const findOneStudent = await studentEntity.findOne({attributes : ['firstname', 'lastname'], where: {firstname: 'Chiper', lastname:'Fox'}})
  console.log(`Find student : ${findOneStudent.firstname} ${findOneStudent.lastname}`);


  }catch (err){
    console.log(err);
    process.exit(-1);
  }

})()
