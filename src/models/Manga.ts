import { Example, Property, Required, MaxLength, CollectionOf } from "@tsed/schema";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Index } from "typeorm";
import { Author } from "./Author";

@Entity()
export class Manga {
  constructor(title: string);
  constructor(title: string, id: number);
  constructor(title: string, id: number, uuid: string, author: Array<Author>);
  constructor(title?: string, id?: number, uuid?: string, author?: Array<Author>) {
    if (title) {
      this.title = title;
    }
    if (id) {
      this.id = id;
    }
    if (uuid) {
      this.uuid = uuid;
    }
    if (author) {
      this.author = author;
    }
  }

  @Property()
  @PrimaryGeneratedColumn()
  @Example(1234)
  public id: number;

  @Property()
  @Column()
  @Required()
  @MaxLength(255)
  @Index({ unique: true })
  @Example("Sousou no Frieren")
  public title: string;

  @Property()
  @Column()
  @MaxLength(46)
  @Index({ unique: true })
  @Example("urn:uuid:12345678-1234-1234-1234-123456789012")
  public uuid: string;

  @Property()
  @Required()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => Author, (author) => author.manga, { cascade: true })
  @JoinTable()
  @CollectionOf(() => Author)
  @Example(['{ "id": 123, "name": "Yamada Kanehito" }'])
  public author: Author[];
}
