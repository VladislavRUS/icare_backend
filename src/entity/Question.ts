import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Specialization } from "./Specialization";
import { Option } from "./Option";
import { Answer } from "./Answer";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  text: string;

  @OneToMany(type => Option, option => option.question)
  options: Option[];

  @ManyToMany(type => Specialization, specialization => specialization.question)
  @JoinTable()
  specializations: Specialization[];

  @Column({ nullable: true })
  sex: string;

  @Column({ nullable: true })
  minAge: number;

  @Column({ nullable: true })
  maxAge: number;

  @OneToMany(type => Answer, answer => answer.question)
  answers: Answer[];
}
