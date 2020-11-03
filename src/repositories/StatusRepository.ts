import { Repository, EntityRepository } from "typeorm";
import { Status } from "../models/Status";

@EntityRepository(Status)
export class StatusRepository extends Repository<Status> {
  findById(id: number): Promise<Status | undefined> {
    return this.findOne(id);
  }
}
