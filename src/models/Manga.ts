import { Example, Property, Schema, Required, MaxLength } from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Manga {
  constructor(title: string);
  constructor(title: string, id: number);
  constructor(title: string, id: number, uuid: string, author: Array<string>);
  constructor(title?: string, id?: number, uuid?: string, author?: Array<string>) {
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
  @MaxLength(250)
  @Example("Sousou no Frieren")
  public title: string;

  @Property()
  @Column()
  @MaxLength(46)
  @Required()
  @Example("urn:uuid:12345678-1234-1234-1234-123456789012")
  public uuid: string;

  @Property()
  @Column()
  @Required()
  @Schema({ type: "array", items: { type: "string" } })
  @Example("['Yamada Kanehito', 'Abe Tsukasa']")
  public author: Array<string>;
}
