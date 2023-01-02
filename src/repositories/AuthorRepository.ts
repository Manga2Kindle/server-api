import { registerProvider } from "@tsed/di";
import { Like } from "typeorm";
import { BetterSqlite3DataSource } from "../datasources/TypeormDatasource";
import { Author } from "../models/Author";

export const AuthorRepository = BetterSqlite3DataSource.getRepository(Author).extend({
  findById(id: number): Promise<Author | undefined> {
    return this.findOneBy({ id: id });
  },

  findByName(name: string): Promise<Author[]> {
    return this.findBy({ name: Like("%" + name + "%") });
  }
});
export const AUTHOR_REPOSITORY = Symbol.for("AuthorRepository");
export type AUTHOR_REPOSITORY = typeof AuthorRepository;

registerProvider({
  provide: AUTHOR_REPOSITORY,
  useValue: AuthorRepository
});
