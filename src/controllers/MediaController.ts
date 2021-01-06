import { RowDataPacket } from "mysql2";
import { Controller } from "./Controller";

interface Media {
  id:	number;
  name:	string;
  date?: Date;
  scrapeURL?: string;
  scrapeDate?: Date;
}

const parseMediaRow = (row: RowDataPacket): Media => {
  return {
    id: row.id,
    name: row.name,
    date: row.date ? row.date : undefined,
    scrapeURL: row.scrape_url ? row.scrape_url : undefined,
    scrapeDate: row.scrape_date ? row.scrape_date : undefined,
  } as Media;
}

export class MediaController extends Controller {
  public readonly getMedia = async (mediaID: number): Promise<Media | null> => {
    const row = await this.selectOne("SELECT * FROM `media` WHERE `id` = ? LIMIT 1", [mediaID]);
    if (row === null){
      return null;
    } else {
      return parseMediaRow(row);
    }
  }

  public readonly getMediaByTrope = async (tropeID: number): Promise<Media[]> => {
    const rows = await this.select("SELECT `media`.* FROM `media` JOIN `media_tropes` ON `media_tropes.media_id` = `media`.`id` WHERE `trope_id` = ?", [
      tropeID
    ]);

    return rows.map(parseMediaRow);
  }

  public readonly search = async (name: string): Promise<Media[]> => {
    const rows = await this.select("SELECT * FROM `media` WHERE `name` LIKE ?", [
      `%${name}%`
    ]);

    return rows.map(parseMediaRow);
  }
}