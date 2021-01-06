import { Controller } from "./Controller";

export class SimilarityController extends Controller {
  public readonly calculateSimilarity = async (leftMediaID: number, rightMediaID: number): Promise<number | null> => {
    const row = await this.selectOne("SELECT SUM(`has_1`) AS `cnt1`, SUM(`has_2`) AS `cnt2`, SUM(`has_1` AND `has_2`) AS `cntBoth` FROM (SELECT MAX(`media_id` = ?) AS `has_1`, MAX(`media_id` = ?) AS `has_2` FROM `media_tropes` `t` WHERE `media_id` IN (?, ?) GROUP BY `trope_id`) t", [
      leftMediaID,
      rightMediaID,
      leftMediaID,
      rightMediaID
    ]);

    if (row === null){
      return null;
    }

    const {cnt1, cnt2, cntBoth} = row;
    return cntBoth / (Math.sqrt(cnt1) * Math.sqrt(cnt2));
  }

  public readonly getSimilarity = async (leftMediaID: number, rightMediaID: number): Promise<number | null> => {
    const rows = await this.select("SELECT `similarity` FROM `media_similarities` WHERE `from_media_id` = ? AND `to_media_id` = ? LIMIT 1", [
      leftMediaID,
      rightMediaID
    ]);

    if (rows.length === 0){
      return null;
    } else {
      return rows[0].similarity as number;
    }
  }

  public readonly setSimilarity = async (leftMediaID: number, rightMediaID: number, similarity: number): Promise<any> => {
    return this.query("INSERT INTO `media_similarities` (`from_media_id`, `to_media_id`, `similarity`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `similarity` = ?", [
      leftMediaID,
      rightMediaID,
      similarity,
      similarity,
    ]);
  }
}