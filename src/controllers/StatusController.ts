import { Controller, Get, Put, PathParams } from "@tsed/common";
import { NotFound } from "@tsed/exceptions";
import { Description, Returns, Summary } from "@tsed/schema";
import { Status } from "../models/Status";
import { StatusService } from "../services/StatusService";

@Controller("/status")
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get("/:id")
  @Summary("Get status by id")
  @Description("Returns the status of given ID")
  @Returns(200, Status)
  @Returns(404)
  async get(
    @Description("A status ID")
    @PathParams("id")
    id: number
  ): Promise<Status | void> {
    const status = await this.statusService.findByID(id);
    if (status) {
      return status;
    } else {
      throw new NotFound("ID not found");
    }
  }

  @Put("/register")
  @Summary("Register a new status")
  @Description("Returns a new status")
  @Returns(200, Status)
  async register(): Promise<Status> {
    return this.statusService.create();
  }
}
