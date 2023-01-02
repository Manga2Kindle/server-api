import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";

export const BETTER_SQLITE3_DATA_SOURCE = Symbol.for("BetterSqlite3DataSource");
export const BetterSqlite3DataSource = new DataSource({
  type: "better-sqlite3",
  entities: [],
  database: "manga2kindle.sqlite"
});

registerProvider<DataSource>({
  provide: BETTER_SQLITE3_DATA_SOURCE,
  type: "typeorm:datasource",
  deps: [Logger],
  async useAsyncFactory(logger: Logger) {
    await BetterSqlite3DataSource.initialize();

    logger.info("Connected with typeorm to database: BetterSqlite3");

    return BetterSqlite3DataSource;
  },
  hooks: {
    $onDestroy(dataSource) {
      return dataSource.isInitialized && dataSource.close();
    }
  }
});
