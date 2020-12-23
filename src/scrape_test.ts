import { Connection } from "mysql2/promise";
import { Database } from "./Database";
import { Controller } from "./Controller";
import { Scraper } from "./Scraper";

interface Result {
  count: number;
  sampleNames: string[]
}

const scrapeMediaFromTropes = async (connection: Connection): Promise<Result> => {
  const scraper = new Scraper();
  const controller = new Controller(connection);
  const unscrapedTropes = await controller.select("SELECT * FROM `tropes` WHERE `scrape_date` IS NULL LIMIT 10");

  const now = new Date();
  let count: number = 0;
  const sampleNames: string[] = [];
  for (const trope of unscrapedTropes) {
    const mediaFromTrope = await scraper.getMedia(trope.scrape_url);
    await controller.query("UPDATE `tropes` SET `scrape_date` = ? WHERE `id` = ?", [now, trope.id]);
    if (mediaFromTrope.length === 0){
      continue;
    }

    const existingMedia = await controller.select("SELECT `name`, `scrape_url` FROM `media`");
    const existingMediaURLs = existingMedia.map(media => media.scrape_url.toLowerCase());
    const newMediaFromTrope = mediaFromTrope.filter(media => !existingMediaURLs.includes(media.scrape_url.toLowerCase()));
    if (newMediaFromTrope.length === 0){
      continue;
    }

    const toInsert = newMediaFromTrope.map(media => [media.name, media.scrape_url]);
    const {affectedRows} = await controller.insert("INSERT IGNORE INTO `media` (`name`, `scrape_url`) VALUES ?", toInsert);
    
    const newMediaNames = mediaFromTrope.map(media => media.name);
    sampleNames.push(newMediaNames[Math.floor(Math.random() * newMediaNames.length)]);
    await controller.query("INSERT IGNORE INTO `media_tropes` (trope_id, media_id) SELECT ? as `trope_id`, `id` as `media_id` FROM `media` WHERE `name` IN (?)", [trope.id, newMediaNames])
    
    count += affectedRows;
  }
  
  return {
    count,
    sampleNames
  } as Result;
}

const scrapeTropesFromMedia = async (connection: Connection) => {
  const scraper = new Scraper();
  const controller = new Controller(connection);
  const unscrapedMedia = await controller.select("SELECT * FROM `media` WHERE `scrape_date` IS NULL LIMIT 10");
  
  const now = new Date();
  let count: number = 0;
  const sampleNames: string[] = [];
  for (const media of unscrapedMedia) {
    const tropesFromMedia = await scraper.getTropes(media.scrape_url);
    await controller.query("UPDATE `media` SET `scrape_date` = ? WHERE `id` = ?", [now, media.id]);
    if (tropesFromMedia.length === 0){
      continue;
    }

    const existingTropes = await controller.select("SELECT `name`, `scrape_url` FROM `tropes`");
    const existingTropeURLs = existingTropes.map(media => media.scrape_url.toLowerCase());
    const newTropesFromMedia = tropesFromMedia.filter(media => !existingTropeURLs.includes(media.scrape_url.toLowerCase()));
    if (newTropesFromMedia.length === 0){
      continue;
    }
    
    const toInsert = newTropesFromMedia.map(trope => [trope.name, trope.scrape_url]);
    const {affectedRows} = await controller.insert("INSERT IGNORE INTO `tropes` (`name`, `scrape_url`) VALUES ?", toInsert);
    
    const newTropeNames = tropesFromMedia.map(trope => trope.name);
    sampleNames.push(newTropeNames[Math.floor(Math.random() * newTropeNames.length)]);
    await controller.query("INSERT IGNORE INTO `media_tropes` (media_id, trope_id) SELECT ? as `media_id`, `id` as `trope_id` FROM `tropes` WHERE `name` IN (?)", [media.id, newTropeNames])
    
    count += affectedRows;
  }
  
  
  return {
    count,
    sampleNames
  } as Result;
}

const run = async () => {
  const connection = await Database.getConnection({
    host: "localhost",
    port: 3306,
    database: "tvtropes",
    user: "root",
    password: "example"
  });

  const runningResults: Result = {
    count: 0,
    sampleNames: []
  };

  try {
    for (let i = 0; i < 10; i ++){
      const tropesResults = await scrapeTropesFromMedia(connection);
      const mediaResults = await scrapeMediaFromTropes(connection);

      const newResultCount = tropesResults.count + mediaResults.count;
      if (newResultCount === 0){
        break
      }

      runningResults.count += newResultCount;
      runningResults.sampleNames = [
        ...runningResults.sampleNames,
        ...tropesResults.sampleNames,
        ...mediaResults.sampleNames
      ];
    }
  } finally {
    try {
      Database.closePool();
    } catch (error){}
  }

  return runningResults;
}

run().then(console.log).catch(console.error);