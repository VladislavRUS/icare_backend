import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  Column,
  ManyToOne,
  OneToMany
} from "typeorm";
import { Doctor } from "./Doctor";
import { User } from "./User";
import { Answer } from "./Answer";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => Doctor, { nullable: false })
  @JoinColumn()
  doctor: Doctor;

  @ManyToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column()
  dateTimestamp: string;

  @Column({ default: false })
  isConfirmedByUser: boolean;

  @Column({ default: false })
  isFinishedByDoctor: boolean;

  @OneToMany(type => Answer, answer => answer.appointment)
  answers: Answer[];
}
