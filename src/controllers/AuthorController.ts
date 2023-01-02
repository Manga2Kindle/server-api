import { Controller, Get, PathParams } from "@tsed/common";
import { NotFound, BadRequest } from "@tsed/exceptions";
import { Description, Returns, Summary } from "@tsed/schema";
import { Author } from "../models/Author";
import { AuthorService } from "../services/AuthorService";

@Controller("/author")
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get("/:id")
  @Summary("Get author by id")
  @Description("Returns the author of given ID")
  @Returns(200, Author)
  @Returns(404, NotFound)
  async get(
    @Description("An author ID")
    @PathParams("id")
    id: number
  ): Promise<Author | void> {
    const author = await this.authorService.findByID(id);
    if (author) {
      return author;
    } else {
      throw new NotFound("ID not found");
    }
  }

  @Get("/search/:query")
  @Summary("Search authors")
  @Description("Returns an array with all authors found, it can be an empty array")
  @Returns(200, Array).Of(Author)
  @Returns(400, BadRequest)
  async search(
    @Description("Query param")
    @PathParams("query")
    query: string
  ): Promise<Array<Author> | void> {
    if (query.length < 3) {
      throw new BadRequest("Query too short");
    }

    return await this.authorService.findByName(query);
  }
}
