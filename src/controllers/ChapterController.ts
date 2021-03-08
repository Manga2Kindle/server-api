import { BodyParams, Controller, Delete, Get, MultipartFile, Patch, PathParams, PlatformMulterFile, Post, Put } from "@tsed/common";
import { BadRequest, Exception, InternalServerError, NotFound, ServiceUnvailable } from "@tsed/exceptions";
import { Description, Returns, Summary } from "@tsed/schema";
import axios from "axios";
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

  @Delete("/:id")
  @Summary("Deletes a status")
  @Description("Used when a status is used and nno longer needed. Does not return anything.")
  @Returns(204)
  @Returns(400)
  @Returns(404)
  async delete(
    @Description("A status ID")
    @PathParams("id")
    id: number
  ): Promise<void> {
    if (!isNaturalNumber(id)) {
      throw new BadRequest("Non Natural Number");
    }

    const status = await this.statusService.findByID(id);
    if (status) {
      if (status.status >= STATUS.DONE) {
        await this.statusService.delete(id);
        return;
      } else {
        throw new BadRequest("Not due to delete");
      }
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
  @(Returns(503, ServiceUnvailable).Description(
    "Service Unavailable<br>If we need to convert the chapter and there is no response from the worker"
  ))
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
  ): Promise<void | Exception> {
    return new Promise<void | Exception>(async (resolve, reject) => {
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

        // when the page is the last page in "chater > pages" we call the worker(s)
        const status: Status | undefined = await this.statusService.findByID(id);
        if (!status) {
          throw new NotFound("Chapter ID was not found");
        }
        if (status.pages == page) {
          axios.defaults.baseURL = process.env.MANGA2KINDLE_WORKER;

          axios
            .put(id.toString())
            .then((res) => {
              if (res.status != 200) {
                reject(new ServiceUnvailable("Worker reply: " + res.status + ": " + res.statusText));
              }
            })
            .catch((error) => {
              console.error("Worker did not respond: " + error);
              reject(new ServiceUnvailable("Worker did not respond"));
            });
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
