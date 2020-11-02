import { AfterRoutesInit, Injectable } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { Manga } from "../models/Manga";
import { CONECTION_NAME } from "./connections/DefaultConnection";

@Injectable()
export class MangaService implements AfterRoutesInit {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.connection = this.typeORMService.get(CONECTION_NAME)!; // get connection by name
  }

  async create(manga: Manga): Promise<Manga> {
    // TODO: validate data
    // TODO: check if exists
    await this.connection.manager.save(manga);
    console.log("Saved a new manga with id: " + manga.id);

    return manga;
  }

  async find(): Promise<Manga[]> {
    // TODO: search by title instead
    const mangas = await this.connection.manager.find(Manga);
    return mangas;
  }
}
