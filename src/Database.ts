import mysql, {Connection, Pool} from "mysql2/promise";

export class Database {
  public static getPool = (connectionOptions: Partial<mysql.PoolOptions> = {}) => {
    if (!Database.pool) {
      const options: Partial<mysql.PoolOptions> = {};
      Object.assign(
        options,
        {
          connectionLimit: 2,
          database: process.env.DB_NAME,
          host: process.env.DB_HOST,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
          queueLimit: 0,
          user: process.env.DB_USERNAME,
          waitForConnections: true,
        },
        connectionOptions
      );
      Database.pool = mysql.createPool(options);
    }
    return Database.pool;
  };
  public static getConnection = async (
    connectionOptions: Partial<mysql.PoolOptions> = {}
  ): Promise<Connection> => {
    return Database.getPool(connectionOptions).getConnection();
  };
  public static closePool = async (): Promise<void> => {
    if (Database.pool) {
      await Database.pool.end();
      Database.pool = undefined;
    }
  };
  private static pool?: Pool = undefined;
}
