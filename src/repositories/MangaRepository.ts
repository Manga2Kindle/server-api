import { Repository, EntityRepository, Like } from "typeorm";
import { Manga } from "../models/Manga";

@EntityRepository(Manga)
export class MangaRepository extends Repository<Manga> {
  findById(id: number): Promise<Manga | undefined> {
    return this.findOne(id, {
      relations: ["author"]
    });
  }

  findByTitle(title: string): Promise<Manga[]> {
    return this.find({
      where: { title: Like(title) },
      relations: ["author"]
    });
  }
}
