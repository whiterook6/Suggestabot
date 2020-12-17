import fetch from "node-fetch";
import cheerio from "cheerio";
import { Connection, OkPacket } from "mysql2/promise";
import Database from "./Database";

const getTitle = ($: cheerio.Root) => {
  const headerRow = $("tr").filter((_, element) => {
    return $(element).text().includes("label");
  });
  return headerRow.find("td > a").first().text().trim();
}

const getMediaWithFeature = ($: cheerio.Root): string[] => {
  const rows = $("tr").filter((_, element) => {
    return $(element).text().includes("hasFeature");
  });
  return rows.map((_, element) => {
    return $(element).find("td > a").first().text().trim();
  }).get();
}

const load = async (url: string): Promise<cheerio.Root> => {
  const response = await fetch(url);
  const content = await response.text();
  return cheerio.load(content);
}

const insertMedia = async (media: string[], connection: Connection) => {
  const sql = "INSERT INTO `media` (`name`) VALUES ?";
  const [results] = await connection.query(sql, [media.map(m => [m])]);
  return results;
}

const run = async () => {
  const connection = await Database.getConnection({
    host: "localhost",
    port: 3306,
    database: "tvtropes",
    user: "root",
    password: "example"
  });

  const $ = await load("http://dbtropes.org/resource/Main/ActionGenre");
  const media = getMediaWithFeature($);
  console.log(media);
  const results = await insertMedia(media, connection);
  await Database.closePool();
  const {affectedRows} = results as OkPacket;
  return affectedRows;
}

run().then(console.log).catch(console.error);