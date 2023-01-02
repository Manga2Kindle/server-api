import { registerProvider } from "@tsed/di";
import { BetterSqlite3DataSource } from "../datasources/TypeormDatasource";
import { Status } from "../models/Status";

export const StatusRepository = BetterSqlite3DataSource.getRepository(Status).extend({
  findById(id: number): Promise<Status | undefined> {
    return this.findOne(id);
  }
});
export const STATUS_REPOSITORY = Symbol.for("StatusRepository");
export type STATUS_REPOSITORY = typeof StatusRepository;

registerProvider({
  provide: STATUS_REPOSITORY,
  useValue: StatusRepository
});
