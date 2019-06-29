import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Question } from "./Question";
import { User } from "./User";
import { Appointment } from "./Appointment";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @ManyToOne(type => Question, question => question.answers, {
    onDelete: "CASCADE"
  })
  question: Question;

  @ManyToOne(type => User, user => user.answers, {
    onDelete: "CASCADE"
  })
  user: User;

  @ManyToOne(type => Appointment, appointment => appointment.answers, {
    onDelete: "CASCADE"
  })
  appointment: Appointment;
}
