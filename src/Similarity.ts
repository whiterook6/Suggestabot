import { Controller } from "./Controller";
import { Connection } from "mysql2/promise";
import { Database } from "./Database";

const calculateSimilarity = async (connection: Connection, media_id_1: number, media_id_2: number) => {
  const controller = new Controller(connection);
  const counts = await controller.selectOne("select sum(has_1) as cnt_1, sum(has_2) as cnt_2, sum(has_1 and has_2) as cnt_both from ( select max(media_id = ?) has_1, max(media_id = ?) as has_2 from media_tropes t where media_id in (?, ?) group by trope_id) t", [
    media_id_1, media_id_2, media_id_1, media_id_2
  ]);
  const {cnt_1, cnt_2, cnt_both} = counts;
  return cnt_both / (Math.sqrt(cnt_1) * Math.sqrt(cnt_2));
}

const run = async () => {
  const connection = await Database.getConnection({
    host: "localhost",
    port: 3306,
    database: "tvtropes",
    user: "root",
    password: "example"
  });
  try {
    const similarity = await calculateSimilarity(connection, 24, 90);
    return similarity;
  } finally {
    try {
      Database.closePool();
    } catch (error){}
  }
}

run().then(console.log).catch(console.error);