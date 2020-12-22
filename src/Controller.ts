import mysql, {Connection, OkPacket, RowDataPacket} from "mysql2/promise";

export class Controller {
  public readonly connection: Connection;

  constructor(connection: Connection){
    this.connection = connection;
  }

  public readonly query = async (sql: string, params: any[] = []) => {
    // console.log(this.connection.format(sql, params));
    return this.connection.query(sql, params);
  }

  public readonly select = async (sql: string, params: any[] = []): Promise<RowDataPacket[]> => {
    // console.log(await this.connection.format(sql, params));
    const [results] = await this.connection.query(sql, params);
    return results as RowDataPacket[];
  }

  public readonly insert = async (sql: string, params: any[][] = []): Promise<OkPacket> => {
    // console.log(await this.connection.format(sql, [params]));
    const result = await this.connection.query(sql, [params]);
    return (result as OkPacket[])[0];
  }
};