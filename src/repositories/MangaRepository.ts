import { registerProvider } from "@tsed/di";
import { Like } from "typeorm";
import { BetterSqlite3DataSource } from "../datasources/BetterSqlite3Datasource";
import { Manga } from "../models/Manga";

export const MangaRepository = BetterSqlite3DataSource.getRepository(Manga).extend({
  findById(id: number): Promise<Manga | undefined> {
    return this.findOne(id, {
      relations: ["author"]
    });
  },

  findByTitle(title: string): Promise<Manga[]> {
    return this.find({
      where: { title: Like(title) },
      relations: ["author"]
    });
  }
});
export const MANGA_REPOSITORY = Symbol.for("MangaRepository");
export type MANGA_REPOSITORY = typeof MangaRepository;

registerProvider({
  provide: MANGA_REPOSITORY,
  useValue: MangaRepository
});
