import { AfterRoutesInit, Injectable } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Manga } from "../models/Manga";
import { MangaRepository } from "../repositories/MangaRepository";
import { CONECTION_NAME } from "./connections/DefaultConnection";

@Injectable()
export class MangaService implements AfterRoutesInit {
  private repository: MangaRepository;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const connection = this.typeORMService.get(CONECTION_NAME)!; // get connection by name
    this.repository = connection.getCustomRepository(MangaRepository);
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
