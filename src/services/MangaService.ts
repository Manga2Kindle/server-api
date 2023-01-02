import { Inject, Injectable, InjectorService } from "@tsed/common";
import { Manga } from "../models/Manga";
import { MANGA_REPOSITORY } from "../repositories/MangaRepository";

@Injectable()
export class MangaService {
  @Inject()
  protected injector: InjectorService;

  @Inject(MANGA_REPOSITORY)
  private repository: MANGA_REPOSITORY;

  async findById(id: number): Promise<Manga | undefined> {
    return this.repository.findById(id);
  }

  async create(manga: Manga): Promise<Manga> {
    // TODO: validate data
    // TODO: check if exists

    return this.repository.save(manga);
  }

  async find(title: string): Promise<Manga[]> {
    return this.repository.findByTitle(title);
  }
}
