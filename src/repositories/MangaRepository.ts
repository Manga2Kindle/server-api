import { Repository, EntityRepository } from "typeorm";
import { Manga } from "../models/Manga";

@EntityRepository(Manga)
export class MangaRepository extends Repository<Manga> {
  findById(id: number): Promise<Manga | undefined> {
    return this.findOne(id);
  }
}
