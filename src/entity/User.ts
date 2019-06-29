import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany} from "typeorm";

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
}
