import { Repository, EntityRepository } from "typeorm";
import { Author } from "../models/Author";

@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> {
  findById(id: number): Promise<Author | undefined> {
    return this.findOne(id);
  }

  findByName(name: string): Promise<Author[]> {
    return this.find({ name: name });
  }
}
