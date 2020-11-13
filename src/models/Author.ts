import { Example, Property, Required, MaxLength } from "@tsed/schema";
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Manga } from "./Manga";

@Entity()
export class Author {
  constructor(name: string);
  constructor(name: string, id?: number) {
    if (name) {
      this.name = name;
    }
    if (id) {
      this.id = id;
    }
  }

  @Property()
  @PrimaryGeneratedColumn()
  @Example(1234)
  public id: number;

  @Property()
  @Column()
  @Required()
  @MaxLength(50)
  @Index({ unique: true })
  @Example("Yamada Kanehito")
  public name: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToMany((type) => Manga, (manga) => manga.author)
  public manga: Manga[];
}
