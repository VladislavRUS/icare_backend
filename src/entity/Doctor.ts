import { Specialization } from './Specialization';
import {Entity, JoinColumn, ManyToOne} from "typeorm";
import { User } from './User';

@Entity()
export class Doctor extends User {
    @ManyToOne(type => Specialization)
    @JoinColumn()
    specialization: Specialization;
}
