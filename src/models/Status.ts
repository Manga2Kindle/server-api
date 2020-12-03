import { Example, Property } from "@tsed/schema";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export const STATUS = {
  REGISTERED: 10,
  UPLOADING: 20,
  UPLOADED: 30,
  ENQUEUED: 40,
  PROCESSING: 50,
  CONVERTING: 60,
  SENDING: 70,
  DONE: 80,
  ERROR: 90
};

@Entity()
export class Status {
  constructor();
  constructor(id: number);
  constructor(id: number, status: number);
  constructor(id: number, status: number, pages?: number);
  constructor(id?: number, status?: number, pages?: number) {
    if (id) {
      this.id = id;
    }
    if (status) {
      this.status = status;
    }
    if (pages) {
      this.pages = pages;
    }
  }

  @Property()
  @PrimaryGeneratedColumn()
  @Example(1234)
  public id: number;

  @Property()
  @Column()
  @Example(STATUS.REGISTERED, STATUS.UPLOADING, STATUS.ERROR)
  public status: number;

  @Column()
  public pages: number;

  @BeforeInsert()
  private beforeInsert() {
    this.id = Math.floor(0 + 2147483647 * Math.random()); // random from 0 to max int(11) value
  }
}
