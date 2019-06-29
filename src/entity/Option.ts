import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Question } from "./Question";

@Entity()
export class Option {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  order: number;

  @Column()
  text: string;

  @ManyToOne(type => Question, question => question.specializations, {
    onDelete: "CASCADE"
  })
  question: Question;
}
