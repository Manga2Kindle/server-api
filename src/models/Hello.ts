import { Example, Property } from "@tsed/schema";

export class Hello {
  constructor(name: string, version: string) {
    this.name = name;
    this.version = version;
  }

  @Property()
  @Example("Manga2Kindle")
  public name: string;

  @Property()
  @Example("1.2.3")
  public version: string;
}
