import mysql, {Connection} from "mysql2/promise";

export class Controller {
  public readonly connection: Connection;

  constructor(connection: Connection){
    this.connection = connection;
  }

  public readonly query = async (sql: string, params: any[] = []) => {
    return this.connection.query(sql, params);
  }
};