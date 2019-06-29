import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany
} from "typeorm";
import { Answer } from "./Answer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  patronymic: string;

  @Column()
  age: number;

  @Column()
  sex: string;

  @OneToMany(type => Answer, answer => answer.user)
  answers: Answer[];
}
