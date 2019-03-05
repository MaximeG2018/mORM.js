
import mOrm from "./mOrm";

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
      database: "iLovePragmatic"
    })
  }catch (err){
    console.log(err);
    process.exit(-1);
  }
})()
