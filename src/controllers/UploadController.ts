import { Controller, MultipartFile, PathParams, PlatformMulterFile, Post } from "@tsed/common";
import { NotFound, BadRequest, InternalServerError, Exception } from "@tsed/exceptions";
import { Description, Returns, Summary } from "@tsed/schema";
import { isNaturalNumber } from "../modules/DataValidation";
import S3Storage from "../modules/S3Storage";
import { StatusService } from "../services/StatusService";

@Controller("/upload")
export class UploadController {
  constructor(private statusService: StatusService) {}

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
