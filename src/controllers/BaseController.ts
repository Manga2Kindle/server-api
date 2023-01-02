import { Description, Get, Returns, Summary } from "@tsed/schema";
import { Controller } from "@tsed/di";
import { Hello } from "../models/Hello";

@Controller("/")
export class BaseController {
  @Get()
  @Summary("Base parh")
  @Description("Returns the server name and version")
  @Returns(200, Hello)
  get(): Hello {
    return new Hello("Manga2Kindle", process.env.npm_package_version as string);
  }
}
