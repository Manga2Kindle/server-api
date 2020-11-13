import { Controller, Get, Put, PathParams } from "@tsed/common";
import { NotFound, BadRequest } from "@tsed/exceptions";
import { Description, Returns, Summary } from "@tsed/schema";
import { Status } from "../models/Status";
import { isNaturalNumber } from "../modules/DataValidation";
import { StatusService } from "../services/StatusService";

@Controller("/status")
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get("/:id")
  @Summary("Get status by id")
  @Description("Returns the status of given ID")
  @Returns(200, Status)
  @Returns(400, BadRequest)
  @Returns(404, NotFound)
  async get(
    @Description("A status ID")
    @PathParams("id")
    id: number
  ): Promise<Status | void> {
    if (!isNaturalNumber(id)) {
      throw new BadRequest("Non Natural Number");
    }

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
