import { Question } from './Question';
import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";

@Entity()
export class Specialization {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToMany(type => Question, question => question.specializations)
    question: Question;
}
