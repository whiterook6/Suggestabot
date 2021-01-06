import { RowDataPacket } from "mysql2/promise";
import { Controller } from "./Controller";

interface Trope {
  id: number;
  name: string;
  scrapeURL?: string;
  scrapeDate?: Date;
}

const parseTropeRow = (row: RowDataPacket): Trope => {
  return {
    id: row.id,
    name: row.name,
    scrapeURL: row.scrape_url ? row.scrape_url : undefined,
    scrapeDate: row.scrape_date ? row.scrape_date : undefined,
  } as Trope;
}

export class TropeController extends Controller {
  public readonly getTrope = async (tropeID: number): Promise<Trope | null> => {
    const row = await this.selectOne("SELECT * FROM `tropes` WHERE `id` = ? LIMIT 1", [tropeID]);
    
    if (row === null){
      return null;
    } else {
      return parseTropeRow(row);
    }
  }

  public readonly getTropesByMedia = async (mediaID: number): Promise<Trope[]> => {
    const rows = await this.select("SELECT `tropes`.* FROM `tropes` JOIN `media_tropes` ON `media_tropes`.`trope_id` = `tropes`.`id` WHERE `media_id` = ?", [
      mediaID
    ]);

    return rows.map(parseTropeRow);
  }
}