import { AfterRoutesInit, Injectable } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { CONECTION_NAME } from "./connections/DefaultConnection";
import { Status, STATUS } from "../models/Status";
import { StatusRepository } from "../repositories/StatusRepository";
import { isNaturalNumber } from "../modules/DataValidation";

@Injectable()
export class StatusService implements AfterRoutesInit {
  private repository: StatusRepository;

  constructor(private typeORMService: TypeORMService) {}

  $afterRoutesInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const connection = this.typeORMService.get(CONECTION_NAME)!; // get connection by name
    this.repository = connection.getCustomRepository(StatusRepository);
  }

  async create(): Promise<Status> {
    const status = new Status(0, STATUS.REGISTERED);
    return this.repository.manager.save(status);
  }

  async findByID(id: number): Promise<Status | undefined> {
    if (!isNaturalNumber(id)) {
      throw new Error("Non Natural Number");
    }
    return this.repository.findById(id);
  }

  async exists(id: number): Promise<boolean> {
    if (!isNaturalNumber(id)) {
      throw new Error("Non Natural Number");
    }

    const element = await this.repository.findById(id);

    if (element) return true;

    return false;
  }
}
