import { Inject, Injectable, InjectorService } from "@tsed/common";
import { Author } from "../models/Author";
import { isNaturalNumber } from "../modules/DataValidation";
import { Exception } from "@tsed/exceptions";
import { AUTHOR_REPOSITORY } from "../repositories/AuthorRepository";

@Injectable()
export class AuthorService {
  @Inject()
  protected injector: InjectorService;

  @Inject(AUTHOR_REPOSITORY)
  private repository: AUTHOR_REPOSITORY;

  async findByID(id: number): Promise<Author | undefined> {
    if (!isNaturalNumber(id)) {
      throw new Error("Non Natural Number");
    }
    return this.repository.findById(id);
  }

  async findByName(name: string): Promise<Author[]> {
    if (name.length == 0) {
      throw new Exception(400);
    }
    return this.repository.findByName(name);
  }
}
