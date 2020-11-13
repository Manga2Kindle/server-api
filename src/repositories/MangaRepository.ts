import { Repository, EntityRepository, Like } from "typeorm";
import { Manga } from "../models/Manga";

@EntityRepository(Manga)
export class MangaRepository extends Repository<Manga> {
  findById(id: number): Promise<Manga | undefined> {
    return this.findOne(id);
  }

  findByTitle(title: string): Promise<Manga[]> {
    return this.find({ title: Like(title) });
  }
}
