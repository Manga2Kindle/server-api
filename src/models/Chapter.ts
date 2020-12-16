import { Description, Example, Max, MaxLength, Min, MinLength, Property, Required } from "@tsed/schema";
import { Manga } from "./Manga";

export class Chapter {
  @Property()
  @Required()
  @Example("Manga")
  public manga: Manga;

  @Property()
  @Example("The sword village")
  public title?: string;

  @Property()
  @Required()
  @Example(1, 64, 123.5)
  public chapter: number;

  @Property()
  @Example(20)
  public volume?: number;

  @Property()
  @Required()
  @Example(24)
  public pages: number;

  @Property()
  @Required()
  @Example("manga2kindle@kindle_email.com")
  public email: string;

  @Property()
  @MinLength(5)
  @MaxLength(5)
  @Example("manga", "comic")
  @Description("manga: RTL, Comic: LTR")
  public readMode: string;

  @Property()
  @Min(0)
  @Max(2)
  @Example(0, 1, 2)
  @Description("Double page parsing mode. 0: Split 1: Rotate 2: Both")
  public splitType: number;
}
