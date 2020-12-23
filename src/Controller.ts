import mysql, {Connection, OkPacket, RowDataPacket} from "mysql2/promise";

export class Controller {
  public readonly connection: Connection;

  constructor(connection: Connection){
    this.connection = connection;
  }

  public readonly query = async (sql: string, params: any[] = []) => {
    return this.connection.query(sql, params);
  }

  public readonly select = async (sql: string, params: any[] = []): Promise<RowDataPacket[]> => {
    const [results] = await this.connection.query(sql, params);
    return results as RowDataPacket[];
  }

  public readonly insert = async (sql: string, params: any[][] = []): Promise<OkPacket> => {
    const result = await this.connection.query(sql, [params]);
    return (result as OkPacket[])[0];
  }
};