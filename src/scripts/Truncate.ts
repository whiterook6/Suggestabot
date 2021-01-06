import { Database } from "../Database";

const run = async () => {
  const connection = await Database.getConnection({
    host: "localhost",
    port: 3306,
    database: "tvtropes",
    user: "root",
    password: "example"
  });
  try {
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    await connection.query("TRUNCATE table media");
    await connection.query("TRUNCATE table tropes");
    await connection.query("TRUNCATE table media_tropes");
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  } finally {
    try {
      Database.closePool();
    } catch (error){}
  }

  return "Truncated";
}

run().then(console.log).catch(console.error);