import cheerio from "cheerio";
import fetch from "node-fetch";

export const load = async (url: string): Promise<cheerio.Root> => {
  const response = await fetch(url);
  const content = await response.text();
  return cheerio.load(content);
}

export interface Media {
  scrape_url: string,
  name: string
}

export class Scraper {
  public getMedia = async (url: string): Promise<Array<{name: string, scrape_url: string}>> => {
    console.log(`Scraping ${url}`);
    const $ = await load(url);

    const rows = $("tr").filter((_, element) => {
      return $(element).text().includes("hasFeature");
    });
    return rows.map((_, element) => {
      const a = $(element).find("td > a").first();
      return {
        name: a.text().trim(),
        scrape_url: a.attr("href")!.trim()
      }
    }).get();
  }

  public getTropes = async (url: string): Promise<Array<{name: string, scrape_url: string}>> => {
    console.log(`Scraping ${url}`);
    const $ = await load(url);

    const rows = $("tr").filter((_, el) => {
      const element = $(el);
      if (!element.text().includes("hasFeature")){
        return false;
      }
      const as = element.find("a");
      if (as.length !== 2){
        return false;
      }
      const secondA = as.eq(1);
      const href = secondA.attr("href");
      if (!href || href.includes(url)){
        return false;
      } else {
        return true;
      }
    });
    return rows.map((_, element) => {
      const a = $(element).find("td > a").last();
      const href = a.attr("href")!.trim();
      const text = a.text().trim();

      return {
        name: text.split(" / ")[0],
        scrape_url: href
      };
    }).get();
  }
}