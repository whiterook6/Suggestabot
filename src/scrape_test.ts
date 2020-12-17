import fetch from "node-fetch";
import cheerio from "cheerio";

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

const run = async () => {
  const response = await fetch("http://dbtropes.org/resource/Main/ActionGenre");
  const content = await response.text();
  const $ = cheerio.load(content);

  return getMediaWithFeature($);
}

run().then(console.log).catch(console.error);