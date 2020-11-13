import { AfterRoutesInit, Injectable } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { Author } from "../models/Author";
import { AuthorRepository } from "../repositories/AuthorRepository";
import { CONECTION_NAME } from "./connections/DefaultConnection";
import { isNaturalNumber } from "../modules/DataValidation";
import { Exception } from "@tsed/exceptions";

@Injectable()
export class AuthorService implements AfterRoutesInit {
  private repository: AuthorRepository;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const connection = this.typeORMService.get(CONECTION_NAME)!; // get connection by name
    this.repository = connection.getCustomRepository(AuthorRepository);
  }

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
