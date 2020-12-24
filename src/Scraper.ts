import cheerio from "cheerio";
import fetch from "node-fetch";
import { cleanURL, getTropeNameFromURL } from "./URLs";

export const load = async (url: string): Promise<cheerio.Root> => {
  const response = await fetch(url);
  const content = await response.text();

  if (!response.ok){
    throw new Error(content);
  }

  return cheerio.load(content);
}

export interface Media {
  scrape_url: string,
  name: string
}

export class Scraper {
  public getMedia = async (url: string): Promise<Array<{name: string, scrape_url: string}>> => {
    let $: cheerio.Root;
    try {
      $ = await load(url);
    } catch (error){
      console.error(`Error loading ${url}`);
      console.error(error);
      return [];
    }

    const rows = $("tr").filter((_, element) => {
      const text = $(element).text();
      if (!text.includes("hasFeature")){
        return false;
      }

      const a = $(element).find("td > a").first();
      const href = a.attr("href");
      return href !== undefined && !href.includes("$");
    });
    return rows.map((_, element) => {
      const a = $(element).find("td > a").first();
      const href = a.attr("href") as string;
      return {
        name: a.text().trim(),
        scrape_url: cleanURL(href)
      }
    }).get();
  }

  public getTropes = async (url: string): Promise<Array<{name: string, scrape_url: string}>> => {
    let $: cheerio.Root;
    try {
      $ = await load(url);
    } catch (error){
      console.error(`Error loading ${url}`);
      console.error(error);
      return [];
    }

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
      if (!href || href.includes(url) || url.includes("$")){
        return false;
      } else {
        return true;
      }
    });
    return rows.map((_, element) => {
      const a = $(element).find("td > a").last();
      const href = a.attr("href")!;
      const text = a.text();

      return {
        name: text.split("/")[0].trim(),
        scrape_url: cleanURL(href)
      };
    }).get();
  }
}