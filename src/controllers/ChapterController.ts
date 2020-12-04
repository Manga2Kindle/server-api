import { BodyParams, Controller, Get, MultipartFile, Patch, PathParams, PlatformMulterFile, Post, Put } from "@tsed/common";
import { BadRequest, Exception, InternalServerError, NotFound } from "@tsed/exceptions";
import { Description, Returns, Summary } from "@tsed/schema";
import { Chapter } from "../models/Chapter";
import { STATUS, Status } from "../models/Status";
import { isNaturalNumber } from "../modules/DataValidation";
import S3Storage from "../modules/S3Storage";
import { StatusService } from "../services/StatusService";

@Controller("/chapter")
export class ChapterController {
  constructor(private statusService: StatusService) {}

  @Put()
  @Summary("Register a new chapter")
  @Description("Returns a new status")
  @Returns(200, Status)
  async register(
    @Description("This object has a Manga and the chapter settings")
    @BodyParams()
    chapter: Chapter
  ): Promise<Status | Exception> {
    return new Promise<Status | Exception>(async (resolve, reject) => {
      const status = await this.statusService.create(chapter.pages);
      const path = status.id + "/ChapterData.json";

      new S3Storage().putFile(path, JSON.stringify(chapter), (error, metadata) => {
        if (error) reject(new InternalServerError("An error ocurred while managing the file (" + metadata + ")"));

        resolve(status);
      });
    });
  }

  @Get("/:id")
  @Summary("Get chapter status by id")
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

  @Patch("/:id/:status")
  @Summary("Update a chapter status")
  @Description("Does not return anything, just status codes")
  @Returns(204)
  @Returns(400)
  @Returns(404)
  async patch(
    @Description("A status ID")
    @PathParams("id")
    id: number,
    @Description("A status code")
    @PathParams("status")
    status: number
  ): Promise<void> {
    if (!isNaturalNumber(id) || !isNaturalNumber(status)) {
      throw new BadRequest("Non Natural Number");
    }

    // CHECK IF STATUS CODE EXISTS
    if (!Object.values(STATUS).includes(status)) {
      throw new BadRequest("Not a valid status code");
    }
    const statusObject = new Status(id, status);
    const editResponse = await this.statusService.edit(statusObject);
    if (editResponse == undefined) {
      throw new NotFound("ID not found");
    } else {
      return;
    }
  }

  @Post("/:id/:page")
  @Summary("Add new chapter page")
  @Description(
    'Upload chapter pages, one by one.<br>This call has an extra parameter named "file" in the body, it is a multipart to attach a page.'
  )
  @(Returns(201).Description("Created, no response expected"))
  @Returns(400, BadRequest)
  @Returns(404, NotFound)
  async post(
    @Description("A status (chapter) ID")
    @PathParams("id")
    id: number,
    @Description("A page number")
    @PathParams("page")
    page: number,
    @Description("A page file")
    @MultipartFile("file")
    file: PlatformMulterFile
  ): Promise<string | Exception> {
    return new Promise<string | Exception>(async (resolve, reject) => {
      try {
        if (!isNaturalNumber(id)) {
          throw new BadRequest("ID is not a Number");
        }
        if (!isNaturalNumber(page)) {
          throw new BadRequest("Page is not a Number");
        }

        if (!(await this.statusService.exists(id))) {
          throw new NotFound("Chapter ID was not found");
        }

        resolve();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new S3Storage().deleteFile(file.path, (error: any, metadata?: any) => {
          if (error) reject(new InternalServerError("An error ocurred while managing the file (" + metadata + ")"));
          else reject(error);
        });
      }
    });
  }
}
