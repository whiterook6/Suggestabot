import { TropeController } from "../controllers/TropeController";
import { MediaController } from "../controllers/MediaController";
import { Database } from "../Database";

const run = async () => {
  const connection = await Database.getConnection({
    host: "localhost",
    port: 3306,
    database: "tvtropes",
    user: "root",
    password: "example"
  });

  const mediaController = new MediaController(connection);
  const tropeController = new TropeController(connection);

  try {
    const starTrekMedia = await mediaController.search("Star Trek");
    return starTrekMedia;
  } finally {
    try {
      Database.closePool();
    } catch (error){}
  }
}

run().then(console.log).catch(console.error);