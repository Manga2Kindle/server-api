import { Inject, Injectable, InjectorService } from "@tsed/common";
import { Status, STATUS } from "../models/Status";
import { STATUS_REPOSITORY } from "../repositories/StatusRepository";
import { isNaturalNumber } from "../modules/DataValidation";

@Injectable()
export class StatusService {
  @Inject()
  protected injector: InjectorService;

  @Inject(STATUS_REPOSITORY)
  private repository: STATUS_REPOSITORY;
  async create(pages?: number): Promise<Status> {
    const status = new Status(0, STATUS.REGISTERED, pages);
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

  async edit(status: Status): Promise<Status | undefined> {
    if (await this.exists(status.id)) {
      return this.repository.manager.save(status);
    } else {
      return undefined;
    }
  }

  async delete(id: number): Promise<boolean> {
    await this.repository.delete(id);
    return true;
  }
}
