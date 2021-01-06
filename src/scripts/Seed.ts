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
    await connection.query("INSERT INTO `media` (`name`, `scrape_url`) VALUES ('Samurai Jack', 'http://dbtropes.org/resource/WesternAnimation/SamuraiJack')");
  } finally {
    try {
      Database.closePool();
    } catch (error){}
  }

  return "Seeded";
}

run().then(console.log).catch(console.error);