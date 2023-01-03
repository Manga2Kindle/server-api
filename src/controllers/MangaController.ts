import { BodyParams, Controller, Get, PathParams, Put, Res } from "@tsed/common";
import { BadRequest, NotFound } from "@tsed/exceptions";
import { Summary, Description, Returns } from "@tsed/schema";
import { Author } from "../models/Author";
import { Manga } from "../models/Manga";
import { isNaturalNumber } from "../modules/DataValidation";
import { MangaService } from "../services/MangaService";
import { AuthorService } from "../services/AuthorService";

@Controller("/manga")
export class MangaController {
  constructor(private mangaService: MangaService, private authorService: AuthorService) {}

  @Get("/:id")
  @Summary("Get Manga by ID")
  @Description("Returns a manga")
  @Returns(200, Manga)
  @Returns(400, BadRequest)
  @Returns(404, NotFound)
  async get(
    @Description("A manga ID")
    @PathParams("id")
    id: number
  ): Promise<Manga | void> {
    if (!isNaturalNumber(id)) {
      throw new BadRequest("Not a valid ID");
    }

    const manga = await this.mangaService.findById(id);

    if (manga instanceof Manga) {
      return manga;
    } else {
      throw new NotFound("This ID does not exists");
    }
  }

  @Get("/search/:query")
  @Summary("Search a manga")
  @Description("Returns an array with all mangas found, it can be an empty array")
  @Returns(200, Array).Of(Manga)
  @Returns(400, BadRequest)
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
  @Returns(200, Manga).Description("Manga already exists")
  @Returns(201, Manga).Description("A new manga was created")
  @Returns(400, BadRequest)
  async put(
    @Description("Manga object")
    @BodyParams(Manga)
    manga: Manga,
    @Res()
    response: Res
  ): Promise<Manga | void> {
    // sanitalize manga data
    if (manga.title.length < 3) {
      throw new BadRequest("Title too short");
    } else if (manga.id != 0 && manga.id != undefined) {
      throw new BadRequest("ID must be 0 or undefined");
    } else if (manga.uuid != undefined && manga.uuid != "") {
      throw new BadRequest('UUID must be "" (blank) or undefined');
    } else if (manga.author.length == 0) {
      throw new BadRequest("You may not add a Manga without author");
    }

    // set default needed data
    // manga.id = 0;
    // uuid will end like this: "urn:uuid:12345678-1234-1234-1234-123456789012"
    manga.uuid =
      "urn:uuid:" +
      this.generateRandom(10000000, 100000000) +
      "-" +
      this.generateRandom(1000, 10000) +
      "-" +
      this.generateRandom(1000, 10000) +
      "-" +
      this.generateRandom(1000, 10000) +
      "-" +
      this.generateRandom(100000000000, 1000000000000);

    // sanitalize author data
    for (const key in manga.author) {
      if (Author.prototype.hasOwnProperty.call(manga.author, key)) {
        const a = manga.author[key];

        // if author id is not set we take it as a new author
        if (a.id == undefined) {
          if (a.name.length < 3) {
            throw new BadRequest("Author name too short");
          }
        } else {
          // check if author exists
          const dbAuthor = await this.authorService.findByID(a.id);
          if (dbAuthor == undefined) {
            throw new BadRequest("Author id:" + a.id + " does not exists");
          }
        }
      }
    }

    // and finally: add and return
    manga = await this.mangaService.create(manga);
    response.status(200).send(manga);
  }

  //#region private functions

  /**
   * Generate a random number between the given values
   * @param min minimum value inclusive
   * @param max maximum value exclusive
   */
  private generateRandom(min: number, max: number): number {
    return Math.floor(min + (max - min) * Math.random());
  }

  //#endregion
}
