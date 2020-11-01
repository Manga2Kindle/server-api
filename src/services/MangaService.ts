import { AfterRoutesInit, Injectable } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Connection } from "typeorm";
import { Manga } from "../models/Manga";

@Injectable()
export class MangaService implements AfterRoutesInit {
  private connection: Connection;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.connection = this.typeORMService.get("default")!; // get connection by name
  }

  async create(manga: Manga): Promise<Manga> {
    // do something
    // ...
    // Then save
    await this.connection.manager.save(manga);
    console.log("Saved a new user with id: " + manga.id);

    return manga;
  }

  async find(): Promise<Manga[]> {
    const mangas = await this.connection.manager.find(Manga);
    console.log("Loaded mangas: ", mangas);

    return mangas;
  }
}
