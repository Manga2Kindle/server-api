import { BodyParams, Controller, Get, PathParams, Put, Res } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";
import { Summary, Description, Returns } from "@tsed/schema";
import { Author } from "../models/Author";
import { Manga } from "../models/Manga";
import { isNaturalNumber } from "../modules/DataValidation";
import { MangaService } from "../services/MangaService";

@Controller("/manga")
export class MangaController {
  constructor(private mangaService: MangaService) {}

  @Get("/:id")
  @Summary("Get Manga by ID")
  @Description("Returns a manga")
  @Returns(200, Manga)
  @Returns(400)
  get(
    @Description("A manga ID")
    @PathParams("id")
    id: number
  ): unknown {
    if (!isNaturalNumber(id)) {
      throw new BadRequest("Not a valid ID");
    }

    return new Manga("Sousou no Frieren", id, "urn:uuid:12345678-1234-1234-1234-123456789012", [
      new Author("Yamada Kanehito"),
      new Author("Abe Tsukasa")
    ]);
  }

  @Get("/search/:query")
  @Summary("Search a manga")
  @Description("Returns an array with all mangas found, it can be an empty array")
  @(Returns(200, Array).Of(Manga))
  @Returns(400)
  async search(
    @Description("Query param")
    @PathParams("query")
    query: string
  ): Promise<Array<Manga> | void> {
    if (query.length < 3) {
      throw new BadRequest("Query too short");
    }

    return await this.mangaService.find(query);
  }

  @Put()
  @Summary("Add new manga")
  @Description("Add a manga if not exists")
  @(Returns(200, Manga).Description("Manga already exists"))
  @(Returns(201, Manga).Description("A new manga was created"))
  @Returns(400)
  async put(
    @Description("Manga object")
    @BodyParams(Manga)
    manga: Manga,
    @Res()
    response: Res
  ): Promise<Manga | void> {
    manga = await this.mangaService.create(manga);
    response.status(200).send(manga);
  }
}
