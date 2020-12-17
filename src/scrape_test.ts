import fetch from "node-fetch";
import cheerio from "cheerio";
import { Connection } from "mysql2/promise";
import Database from "./Database";

const getTitle = ($: cheerio.Root) => {
  const headerRow = $("tr").filter((_, element) => {
    return $(element).text().includes("label");
  });
  return headerRow.find("td > a").first().text().trim();
}

const getMediaWithFeature = ($: cheerio.Root) => {
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

const run = async () => {
  const connection = await Database.getPool({
    host: "localhost",
    port: 3306,
    database: "tvtropes",
    user: "root",
    password: "example"
  });

  const [rows] = await connection.query("select true");
  await Database.closePool();
  return rows;
}

run().then(console.log).catch(console.error);